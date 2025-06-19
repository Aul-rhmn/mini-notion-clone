const Note = require('../models/note.model');
const Block = require('../models/block.model');

const getNotes = async (req, res) => {
  const notes = await Note.find({ user_id: req.user._id }).sort({ order_index: 'asc' });
  res.json(notes);
};

const createNote = async (req, res) => {
  const { title } = req.body;
  const count = await Note.countDocuments({ user_id: req.user._id });

  const note = new Note({
    user_id: req.user._id,
    title: title || 'Untitled',
    order_index: count,
  });
  const createdNote = await note.save();
  res.status(201).json(createdNote);
};

const getNoteById = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.user_id.toString() === req.user._id.toString()) {
    const blocks = await Block.find({ note_id: note._id }).sort({ order_index: 1 });
    res.json({ note, blocks });
  } else {
    res.status(404).json({ message: 'Note not found or user not authorized' });
  }
};

const updateNote = async (req, res) => {
  const { title } = req.body;
  const note = await Note.findById(req.params.id);

  if (note && note.user_id.toString() === req.user._id.toString()) {
    note.title = title || note.title;
    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404).json({ message: 'Note not found or user not authorized' });
  }
};

const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.user_id.toString() === req.user._id.toString()) {
    await Block.deleteMany({ note_id: note._id });
    await note.deleteOne();
    res.json({ message: 'Note and associated blocks removed' });
  } else {
    res.status(404).json({ message: 'Note not found or user not authorized' });
  }
};

const updateNoteOrder = async (req, res) => {
  const { orderedNoteIds } = req.body;

  if (!Array.isArray(orderedNoteIds)) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  try {
    const bulkOps = orderedNoteIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, user_id: req.user._id },
        update: { $set: { order_index: index } }
      }
    }));

    if (bulkOps.length > 0) {
      await Note.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: 'Note order updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update note order' });
  }
};

module.exports = {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  updateNoteOrder,
};
