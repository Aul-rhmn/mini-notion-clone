const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middlewares/auth.middleware');

const uploadDir = 'public/images';

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir); 
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images Only!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', protect, (req, res) => {
    const uploader = upload.single('image');

    uploader(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }
        
        // Sukses
        res.status(201).send({
            message: 'Image Uploaded successfully',
            url: `http://localhost:5000/images/${req.file.filename}`,
        });
    });
});

module.exports = router;