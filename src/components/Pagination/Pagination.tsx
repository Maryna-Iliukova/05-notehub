import React from 'react';
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number; 
  currentPage: number;
  onPageChange: (selectedPage: number) => void; 
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
}) => {
  if (pageCount <= 1) return null;

  const handlePageClick = (event: { selected: number }) => {
    onPageChange(event.selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={handlePageClick}
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousLabel="← Previous"
      previousClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextLabel="Next →"
      nextClassName={css.pageItem}
      nextLinkClassName={css.pageLink}
      breakLabel="..."
      breakClassName={css.pageItem}
      breakLinkClassName={css.pageLink}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      ariaLabelBuilder={(page) => `Go to page ${page}`}
    />
  );
};

export default Pagination;
