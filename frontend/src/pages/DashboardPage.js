import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Sidebar from '../components/layout/Sidebar';
import NoteEditor from '../components/editor/NoteEditor';
import api from '../utils/api';
import Spinner from '../components/ui/Spinner';

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [isEditorLoading, setIsEditorLoading] = useState(false);


  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notes');
      setNotes(data);
      if (data.length > 0 && !activeNoteId) {
        setActiveNoteId(data[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch notes", error);
    } finally {
      setLoading(false);
    }
  }, [activeNoteId]);
  const fetchNoteContent = useCallback(async (noteId) => {
    if (!noteId) {
      setBlocks([]);
      setNoteTitle('');
      return;
    }
    setIsEditorLoading(true);
    try {
      const { data } = await api.get(`/notes/${noteId}`);
      setBlocks(data.blocks);
      setNoteTitle(data.note.title);
    } catch (error) {
      console.error("Failed to fetch note content", error);
      setBlocks([]);
      setNoteTitle('');
    } finally {
      setIsEditorLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    fetchNoteContent(activeNoteId);
  }, [activeNoteId, fetchNoteContent]);


  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    
    if (destination.droppableId === 'sidebar-notes') {
      const newNotes = Array.from(notes);
      const [reorderedItem] = newNotes.splice(source.index, 1);
      newNotes.splice(destination.index, 0, reorderedItem);
      setNotes(newNotes);
      const orderedNoteIds = newNotes.map(note => note._id);
      api.put('/notes/order', { orderedNoteIds });
    }

    if (destination.droppableId === 'editor-blocks') {
      const newBlocks = Array.from(blocks);
      const [reorderedItem] = newBlocks.splice(source.index, 1);
      newBlocks.splice(destination.index, 0, reorderedItem);
      
      const updatedBlocks = newBlocks.map((b, index) => ({ ...b, order_index: index }));
      setBlocks(updatedBlocks);

      const orderUpdate = updatedBlocks.map(b => ({ _id: b._id, order_index: b.order_index }));
      api.put('/blocks/order', { blocks: orderUpdate });
    }
  };

  const handleCreateNote = async () => {
    const { data: newNote } = await api.post('/notes', { title: 'Untitled' });
    await api.post('/blocks', {
        note_id: newNote._id,
        type: 'text',
        content: { text: '' },
        order_index: 0
    });
    await fetchNotes();
    setActiveNoteId(newNote._id);
  };
  
  const handleDeleteNote = async (noteIdToDelete) => {
    const noteIndex = notes.findIndex(n => n._id === noteIdToDelete);
    const newNotes = notes.filter(n => n._id !== noteIdToDelete);
    setNotes(newNotes);
    
    if (activeNoteId === noteIdToDelete) {
        if (newNotes.length > 0) {
            const newActiveIndex = Math.max(0, noteIndex - 1);
            setActiveNoteId(newNotes[newActiveIndex]._id);
        } else {
            setActiveNoteId(null);
        }
    }
    await api.delete(`/notes/${noteIdToDelete}`);
  };


  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center bg-gray-900"><Spinner /></div>
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-screen bg-gray-900 text-white font-sans">
        <Sidebar
          notes={notes}
          onSelectNote={setActiveNoteId}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
          activeNoteId={activeNoteId}
        />
        <main className="flex-grow flex flex-col bg-gray-800/50">
          <NoteEditor
            noteId={activeNoteId}
            blocks={blocks}
            setBlocks={setBlocks}
            title={noteTitle}
            setTitle={setNoteTitle}
            isLoading={isEditorLoading}
          />
        </main>
      </div>
    </DragDropContext>
  );
};

export default DashboardPage;