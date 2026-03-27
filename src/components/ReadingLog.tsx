import React, { useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { formatDate } from '../utils/date';

export const ReadingLog: React.FC = () => {
  const { sessions, books, deleteSession } = useAppStore();
  
  // FIX: 使用 useMemo 缓存 bookMap，避免每次渲染都重新创建
  const bookMap = useMemo(() => new Map(books.map(b => [b.id, b])), [books]);
  
  // 按日期倒序
  const sortedSessions = useMemo(() => 
    [...sessions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    [sessions]
  );
  
  if (sortedSessions.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-text-tertiary)]">
        暂无阅读记录
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="text-left py-2 px-3 text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide">
              日期
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide">
              时长
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide">
              书籍
            </th>
            <th className="text-right py-2 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {sortedSessions.map(session => {
            const book = bookMap.get(session.bookId);
            return (
              <tr 
                key={session.id}
                className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-bg-hover)] transition-colors group"
              >
                <td className="py-3 px-3 text-sm text-[var(--color-text-primary)]">
                  {formatDate(session.date)}
                </td>
                <td className="py-3 px-3 text-sm text-[var(--color-text-primary)] tabular-nums">
                  {session.durationMinutes} <span className="text-[var(--color-text-tertiary)]">分钟</span>
                </td>
                <td className="py-3 px-3 text-sm">
                  {book ? (
                    <span className="text-[var(--color-accent)]">{book.title}</span>
                  ) : (
                    <span className="text-[var(--color-text-tertiary)]">未知书籍</span>
                  )}
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="p-1.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="删除记录"
                    aria-label="删除阅读记录"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
