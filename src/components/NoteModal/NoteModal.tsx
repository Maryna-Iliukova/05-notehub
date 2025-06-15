import React, { useEffect, type ReactNode } from 'react';
import ReactDOM from 'react-dom';
import NoteForm from '../NoteForm/NoteForm';
import css from './NoteModal.module.css';
import type { CreateNotePayload } from '../../services/noteService';

interface NoteModalProps {
  onClose: () => void;
  onCreateNote: (data: CreateNotePayload) => void;
  children?: ReactNode;
}

const NoteModal: React.FC<NoteModalProps> = ({ onClose, onCreateNote }) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // 🔒 Disable scroll
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <NoteForm onClose={onClose} onSubmit={onCreateNote} />
      </div>
    </div>,
    document.body
  );
};

export default NoteModal;
