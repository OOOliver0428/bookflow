import React from 'react';
import type { Book } from '../types';
import { BookCard } from './BookCard';
import { EmptyState } from './ui';
import { BookOpen } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  onBookClick,
  emptyTitle = '暂无书籍',
  emptyDescription,
}) => {
  if (books.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="w-full h-full" />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {books.map(book => (
        <BookCard
          key={book.id}
          book={book}
          onClick={() => onBookClick(book)}
        />
      ))}
    </div>
  );
};
