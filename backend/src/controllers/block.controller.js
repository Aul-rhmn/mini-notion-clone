const Block = require('../models/block.model');
const Note = require('../models/note.model');

const checkNoteOwnership = async (noteId, userId) => {
  const note = await Note.findById(noteId);
  return note && note.user_id.equals(userId);
};


const createBlock = async (req, res) => {
  const { note_id, type, content, order_index } = req.body;

  if (!await checkNoteOwnership(note_id, req.user._id)) {
    return res.status(403).json({ message: 'User not authorized for this note' });
  }

  const block = new Block({
    note_id,
    type,
    content,
    order_index
  });

  const createdBlock = await block.save();
  res.status(201).json(createdBlock);
};

const updateBlock = async (req, res) => {
  const { content, type } = req.body;
  const block = await Block.findById(req.params.id);

  if (block) {
    if (!await checkNoteOwnership(block.note_id, req.user._id)) {
        return res.status(403).json({ message: 'User not authorized for this block' });
    }
    block.content = content !== undefined ? content : block.content;
    block.type = type || block.type;
    const updatedBlock = await block.save();
    res.json(updatedBlock);
  } else {
    res.status(404).json({ message: 'Block not found' });
  }
};

const updateBlockOrder = async (req, res) => {
  const { blocks } = req.body;

  if (!Array.isArray(blocks) || blocks.length === 0) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  const firstBlock = await Block.findById(blocks[0]._id);
  if (!firstBlock || !await checkNoteOwnership(firstBlock.note_id, req.user._id)) {
      return res.status(403).json({ message: 'User not authorized to reorder these blocks' });
  }
  
  const bulkOps = blocks.map(b => ({
      updateOne: {
          filter: { _id: b._id },
          update: { $set: { order_index: b.order_index } }
      }
  }));

  try {
      await Block.bulkWrite(bulkOps);
      res.status(200).json({ message: 'Block order updated successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to update block order', error });
  }
};

const deleteBlock = async (req, res) => {
    const block = await Block.findById(req.params.id);

    if (block) {
        if (!await checkNoteOwnership(block.note_id, req.user._id)) {
            return res.status(403).json({ message: 'User not authorized for this block' });
        }
        await block.deleteOne();
        res.json({ message: 'Block removed' });
    } else {
        res.status(404).json({ message: 'Block not found' });
    }
};


module.exports = { createBlock, updateBlock, updateBlockOrder, deleteBlock };