const express = require('express');
const router = express.Router();
const {
    createBlock,
    updateBlock,
    updateBlockOrder,
    deleteBlock
} = require('../controllers/block.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/', createBlock);
router.put('/order', updateBlockOrder);
router.route('/:id').put(updateBlock).delete(deleteBlock);

module.exports = router;