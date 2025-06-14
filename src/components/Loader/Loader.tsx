import React from 'react';
import css from './Loader.module.css';

const Loader: React.FC = () => {
  return (
    <div className={css.loader} role="alert" aria-busy="true" aria-label="Loading">
      <div className={css.spinner}></div>
      <span>Loading...</span>
    </div>
  );
};

export default Loader;