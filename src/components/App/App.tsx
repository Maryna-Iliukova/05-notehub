import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotes,
  createNote,
  deleteNote,
  type CreateNotePayload,
} from '../../services/noteService';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import NoteModal from '../NoteModal/NoteModal';
import css from './App.module.css';
import useDebounce from '../hooks/useDebounce';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const debouncedSearch = useDebounce(searchQuery, 500); 

  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', { search: debouncedSearch, page }],
    queryFn: () =>
      fetchNotes({ search: debouncedSearch, page, perPage }),
    placeholderData: (prev) => prev,
  });

  const handleDeleteNote = async (id: number) => {
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
    } catch (err) {
      console.error('Failed to create note', err);
    }
  };

  if (isError) {
    return (
      <ErrorMessage
        message={`Error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`}
      />
    );
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <main className={css.main}>
        {isLoading && <Loader />}
        {data?.notes && (
          <NoteList notes={data.notes} onDeleteNote={handleDeleteNote} />
        )}

        {isModalOpen && (
          <NoteModal
            onClose={() => setIsModalOpen(false)}
            onCreateNote={handleCreateNote}
          />
        )}
      </main>
    </div>
  );
};

export default App;
