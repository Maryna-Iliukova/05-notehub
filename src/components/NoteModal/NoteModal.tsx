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

const modalRoot = document.getElementById('modal-root') as HTMLElement;

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
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <NoteForm onCancel={onClose} onSubmit={onCreateNote} />
      </div>
    </div>,
    modalRoot
  );
};

export default NoteModal;
