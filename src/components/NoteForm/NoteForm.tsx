import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, type CreateNotePayload } from '../../services/noteService';
import css from './NoteForm.module.css';
import type { NoteTag } from '../../types/note';

interface NoteFormProps {
  onSubmit: (data: CreateNotePayload) => void;
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('Title is required'),
  content: Yup.string()
    .max(500, 'Content must be at most 500 characters')
    .nullable(),
  tag: Yup.mixed<NoteTag>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Tag is required'),
});

const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      tag: 'Todo' as NoteTag,
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit} noValidate>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={!!(formik.touched.title && formik.errors.title)}
          aria-describedby="title-error"
        />
        {formik.touched.title && formik.errors.title ? (
          <span id="title-error" className={css.error}>
            {formik.errors.title}
          </span>
        ) : (
          <span id="title-error" className={css.error} />
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={!!(formik.touched.content && formik.errors.content)}
          aria-describedby="content-error"
        />
        {formik.touched.content && formik.errors.content ? (
          <span id="content-error" className={css.error}>
            {formik.errors.content}
          </span>
        ) : (
          <span id="content-error" className={css.error} />
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={formik.values.tag}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={!!(formik.touched.tag && formik.errors.tag)}
          aria-describedby="tag-error"
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.touched.tag && formik.errors.tag ? (
          <span id="tag-error" className={css.error}>
            {formik.errors.tag}
          </span>
        ) : (
          <span id="tag-error" className={css.error} />
        )}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={onClose}
          tabIndex={0}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={!formik.isValid || formik.isSubmitting || mutation.isPending}
        >
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
