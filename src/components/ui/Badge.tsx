import React from 'react';
import type { BookStatus } from '../../types';

interface BadgeProps {
  status: BookStatus;
}

const statusConfig: Record<BookStatus, { label: string; className: string }> = {
  reading: {
    label: '阅读中',
    className: 'bg-[var(--color-accent)] text-white',
  },
  done: {
    label: '已读完',
    className: 'bg-[var(--color-success)] text-white',
  },
  want: {
    label: '计划读',
    className: 'bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
  },
  notes: {
    label: '做笔记',
    className: 'bg-[var(--color-warning)] text-white',
  },
};

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  
  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 
      rounded-full text-[10px] font-semibold uppercase tracking-wide
      ${config.className}
    `}>
      {config.label}
    </span>
  );
};

// 通用标签组件
interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const Tag: React.FC<TagProps> = ({ children, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center px-2.5 py-1 
        rounded-full text-xs font-medium
        transition-all duration-200
        ${active 
          ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]' 
          : 'bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
        }
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {children}
    </button>
  );
};
