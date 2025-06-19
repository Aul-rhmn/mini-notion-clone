const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  note_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true,
  },
  
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block',
    default: null,
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'checklist', 'image', 'code'],
  },
  content: {
    type: Object,
    required: true,
  },
  order_index: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Block = mongoose.model('Block', blockSchema);
module.exports = Block;