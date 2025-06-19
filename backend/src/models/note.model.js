const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Untitled Note',
  },
  order_index: {
      type: Number,
      required: true,
  }
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;