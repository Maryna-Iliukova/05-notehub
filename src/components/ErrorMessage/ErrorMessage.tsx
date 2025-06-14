import React from 'react';
import css from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className={css.error} role="alert" aria-live="assertive">
      {message}
    </div>
  );
};

export default ErrorMessage;