import React, { memo, useState } from 'react';
import type { Book } from '../types';
import { Badge } from './ui';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

export const BookCard: React.FC<BookCardProps> = memo(({ book, onClick }) => {
  // FIX: 使用 state 控制图片加载失败状态，替代不安全的 innerHTML 操作
  const [imgError, setImgError] = useState(false);
  
  const progress = book.totalPages > 0 
    ? Math.round((book.currentPage / book.totalPages) * 100) 
    : 0;
  const initials = book.title.charAt(0).toUpperCase();
  
  return (
    <div
      onClick={onClick}
      className="group bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden cursor-pointer transition-all duration-250 hover:border-[var(--color-border-hover)] hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] bg-[var(--color-bg-hover)] overflow-hidden">
        {book.coverUrl && !imgError ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-elevated)]">
            <span className="text-4xl font-bold text-[var(--color-text-tertiary)]">{initials}</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge status={book.status} />
        </div>
      </div>
      
      {/* Info */}
      <div className="p-3">
        <h3 
          className="font-medium text-sm text-[var(--color-text-primary)] truncate mb-1"
          title={book.title}
        >
          {book.title}
        </h3>
        <p 
          className="text-xs text-[var(--color-text-secondary)] truncate mb-2"
          title={book.author}
        >
          {book.author}
        </p>
        
        {/* Progress bar for reading books */}
        {book.status === 'reading' && book.totalPages > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--color-text-tertiary)] tabular-nums">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

BookCard.displayName = 'BookCard';
