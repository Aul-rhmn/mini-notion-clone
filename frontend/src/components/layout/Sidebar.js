import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, LogOut, Trash2, GripVertical } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ notes, onSelectNote, onCreateNote, onDeleteNote, activeNoteId }) => {
  const { logout, user } = useAuth();

  const handleDeleteClick = (e, noteId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDeleteNote(noteId);
    }
  };

  return (
    <div className="w-72 h-screen bg-gray-900/70 backdrop-blur-sm border-r border-white/5 text-gray-300 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-white/5">
        <h2 className="text-lg font-semibold text-white">{user?.email}'s Notes</h2>
      </div>

      <Droppable droppableId="sidebar-notes" type="DEFAULT">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="flex-grow p-2 overflow-y-auto">
            {notes.map((note, index) => (
              <Draggable key={note._id} draggableId={note._id} index={index}>
                {(providedDraggable, snapshot) => (
                  <div
                    ref={providedDraggable.innerRef}
                    {...providedDraggable.draggableProps}
                    onClick={() => onSelectNote(note._id)}
                    className={`group flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                      activeNoteId === note._id ? 'bg-blue-600/30 text-white' : 'hover:bg-white/10'
                    } ${snapshot.isDragging ? 'bg-blue-600/50' : ''}`}
                  >
                    <div {...providedDraggable.dragHandleProps} className="text-gray-500 group-hover:text-white mr-2">
                       <GripVertical size={18} />
                    </div>
                    <span className="truncate flex-grow">{note.title || 'Untitled'}</span>
                    <button onClick={(e) => handleDeleteClick(e, note._id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="p-4 border-t border-white/5 space-y-2">
        <button onClick={onCreateNote} className="flex items-center w-full p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Plus size={18} className="mr-2" /> New Note
        </button>
        <button onClick={logout} className="flex items-center w-full p-2 rounded-lg hover:bg-white/10 transition-colors">
          <LogOut size={18} className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;