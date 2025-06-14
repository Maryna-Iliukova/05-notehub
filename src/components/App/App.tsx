import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, createNote, deleteNote, type CreateNotePayload  } from '../../services/noteService';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import NoteModal from '../NoteModal/NoteModal';
import NoteForm from '../NoteForm/NoteForm'
import css from './App.module.css';


const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const queryClient = useQueryClient();


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', { search: searchQuery, page }],
    queryFn: () => fetchNotes({ search: searchQuery, page: page + 1, perPage }),
    placeholderData: (previousData) => previousData,
  });
  
  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  };
  
  const handleCreateNote = async (noteData: CreateNotePayload) => {
    try {
      await createNote(noteData);
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create note', error);
    }
  };

  if (isError) {
    return <ErrorMessage message={`Error: ${error instanceof Error ? error.message : 'Unknown error'}`} />;

  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
      <SearchBox value={searchQuery} onChange={setSearchQuery} />


        
        {data && data.totalPages > 1 && (
          <Pagination pageCount={data.totalPages} currentPage={page} onPageChange={setPage} />

        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main className={css.main}>
        {isLoading && <Loader />}

        {data && data.results && (
  <NoteList notes={data.results} onDeleteNote={handleDeleteNote} />
)}


{isModalOpen && (
  <NoteModal
  onClose={() => setIsModalOpen(false)}
  onCreateNote={handleCreateNote} 
>
  <NoteForm
    onSubmit={handleCreateNote} 
    onCancel={() => setIsModalOpen(false)}
  />
</NoteModal>
)}

      </main>
    </div>
  );
};

export default App;