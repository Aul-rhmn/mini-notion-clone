const express = require('express');
const router = express.Router();
const {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  updateNoteOrder, 
} = require('../controllers/note.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.route('/').get(getNotes).post(createNote);
router.put('/order', updateNoteOrder); 
router.route('/:id').get(getNoteById).put(updateNote).delete(deleteNote);

module.exports = router;