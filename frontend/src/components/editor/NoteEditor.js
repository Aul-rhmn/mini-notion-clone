import React, { useEffect, useRef } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Type, ListTodo, Image as ImageIcon, Code, Trash2, GripVertical } from 'lucide-react';
import api from '../../utils/api';
import Block from './Block';
import { useSocket } from '../../hooks/useSocket';
import Spinner from '../ui/Spinner';

const AddBlockToolbar = ({ onAddBlock }) => (
    <div className="flex items-center space-x-2 my-4 border-t border-b border-gray-700 py-2">
        <span className="text-gray-400 mr-2 text-sm font-semibold">ADD:</span>
        <button onClick={() => onAddBlock('text')} className="p-2 hover:bg-gray-700 rounded-lg" title="Text"><Type size={20} /></button>
        <button onClick={() => onAddBlock('checklist')} className="p-2 hover:bg-gray-700 rounded-lg" title="Checklist"><ListTodo size={20} /></button>
        <button onClick={() => onAddBlock('image')} className="p-2 hover:bg-gray-700 rounded-lg" title="Image"><ImageIcon size={20} /></button>
        <button onClick={() => onAddBlock('code')} className="p-2 hover:bg-gray-700 rounded-lg" title="Code"><Code size={20} /></button>
    </div>
);

const NoteEditor = ({ noteId, blocks, setBlocks, title, setTitle, isLoading }) => {
  const socket = useSocket();
  const debouncedTitleRef = useRef(null);

  useEffect(() => {
    clearTimeout(debouncedTitleRef.current);
    debouncedTitleRef.current = setTimeout(() => {
      if (noteId && title !== undefined) {
        api.put(`/notes/${noteId}`, { title: title });
      }
    }, 750);
    return () => clearTimeout(debouncedTitleRef.current);
  }, [title, noteId]);

  useEffect(() => {
    if (socket && noteId) {
        socket.emit('note:join', noteId);
        const handleBlockUpdated = (updatedBlock) => { setBlocks(prev => prev.map(b => b._id === updatedBlock._id ? { ...b, content: updatedBlock.content } : b)); };
        const handleBlockCreated = (newBlock) => { setBlocks(prev => [...prev, newBlock].sort((a,b) => a.order_index - b.order_index)); };
        const handleBlockDeleted = (blockId) => { setBlocks(prev => prev.filter(b => b._id !== blockId)); };
        socket.on('block:updated', handleBlockUpdated);
        socket.on('block:created', handleBlockCreated);
        socket.on('block:deleted', handleBlockDeleted);
        return () => { socket.off('block:updated', handleBlockUpdated); socket.off('block:created', handleBlockCreated); socket.off('block:deleted', handleBlockDeleted); }
    }
  }, [noteId, socket, setBlocks]);

  const handleContentChange = (blockId, newContent) => {
    setBlocks(prevBlocks => prevBlocks.map(b => b._id === blockId ? { ...b, content: newContent } : b));
    api.put(`/blocks/${blockId}`, { content: newContent }).then(response => { socket.emit('block:update', { noteId, blockData: response.data }); });
  };
  
  const handleCheckboxChange = (blockId, isChecked) => {
    const block = blocks.find(b => b._id === blockId);
    if(block) { const newContent = { ...block.content, checked: isChecked }; handleContentChange(blockId, newContent); }
  };

  const handleAddBlock = async (type) => {
    const order_index = blocks.length;
    let content = {};
    if (type === 'text') content = { text: '' };
    if (type === 'checklist') content = { text: '', checked: false };
    if (type === 'image') content = { url: '' };
    if (type === 'code') content = { text: '' };
    const { data: newBlock } = await api.post('/blocks', { note_id: noteId, type, content, order_index });
    setBlocks(prev => [...prev, newBlock]);
    socket.emit('block:create', { noteId, blockData: newBlock });
  };

  const handleDeleteBlock = async (blockIdToDelete) => {
    await api.delete(`/blocks/${blockIdToDelete}`);
    setBlocks(prev => prev.filter(b => b._id !== blockIdToDelete));
    socket.emit('block:delete', { noteId, blockId: blockIdToDelete });
  };

  if (isLoading) { return <div className="flex-grow flex items-center justify-center"><Spinner /></div>; }
  if (!noteId) { return <div className="flex-grow flex items-center justify-center text-gray-400">Select a note to start editing, or create a new one.</div> }

  return (
    <div className="flex-grow p-8 overflow-y-auto max-w-4xl mx-auto w-full">
      <input type="text" value={title || ''} onChange={(e) => setTitle(e.target.value)} className="text-4xl font-bold bg-transparent outline-none w-full mb-4 text-white" placeholder="Untitled Note" />
      <AddBlockToolbar onAddBlock={handleAddBlock} />
      <Droppable droppableId="editor-blocks">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {blocks.map((block, index) => (
              <Draggable key={block._id} draggableId={block._id} index={index}>
                {(providedDraggable) => (
                  <div ref={providedDraggable.innerRef} {...providedDraggable.draggableProps} className="group flex items-start my-1 py-1">
                    <div {...providedDraggable.dragHandleProps} className="p-1 text-gray-500 hover:text-white cursor-grab opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                      <GripVertical size={20}/>
                    </div>
                    <div className="flex-grow">
                      <Block block={block} onContentChange={handleContentChange} onCheckboxChange={handleCheckboxChange} />
                    </div>
                    <button onClick={() => handleDeleteBlock(block._id)} className="ml-2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default NoteEditor;