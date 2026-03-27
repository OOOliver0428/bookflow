import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, Edit2, Trash2, Play } from 'lucide-react';
import type { Book } from '../types';
import { useAppStore } from '../stores/appStore';
import { Button, Badge, Modal, TextArea, Input } from './ui';
import { formatDuration } from '../utils/date';

interface BookDetailProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStartTimer: () => void;
}

export const BookDetail: React.FC<BookDetailProps> = ({
  book,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStartTimer,
}) => {
  const { getNotesByBook, getSessionsByBook, addNote, deleteNote, updateBookProgress } = useAppStore();
  const notes = getNotesByBook(book.id);
  const sessions = getSessionsByBook(book.id);
  
  const [progressInput, setProgressInput] = useState(book.currentPage.toString());
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteComment, setNoteComment] = useState('');
  const [notePage, setNotePage] = useState('');
  
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const progress = book.totalPages > 0 
    ? Math.round((book.currentPage / book.totalPages) * 100) 
    : 0;
  const initials = book.title.charAt(0).toUpperCase();
  
  const handleProgressChange = () => {
    const page = parseInt(progressInput) || 0;
    updateBookProgress(book.id, page);
  };
  
  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    
    addNote({
      bookId: book.id,
      content: noteContent.trim(),
      comment: noteComment.trim() || undefined,
      page: notePage ? parseInt(notePage) : undefined,
    });
    
    setNoteContent('');
    setNoteComment('');
    setNotePage('');
    setShowNoteForm(false);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="书籍详情"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onEdit}>
            <Edit2 className="w-4 h-4 mr-1" />
            编辑
          </Button>
          <Button variant="ghost" onClick={onStartTimer}>
            <Play className="w-4 h-4 mr-1" />
            开始计时
          </Button>
          <Button variant="danger" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-1" />
            删除
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6">
        {/* Cover */}
        <div className="aspect-[2/3] bg-[var(--color-bg-hover)] rounded-lg overflow-hidden">
          {book.coverUrl ? (
            <img 
              src={book.coverUrl} 
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-elevated)]">
              <span className="text-5xl font-bold text-[var(--color-text-tertiary)]">{initials}</span>
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
              {book.title}
            </h2>
            <p className="text-[var(--color-text-secondary)]">{book.author}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge status={book.status} />
            {book.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-0.5 text-xs bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] rounded-full border border-[var(--color-border)]"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 py-3 border-y border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--color-text-tertiary)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                阅读时长: <span className="text-[var(--color-text-primary)] font-medium">{formatDuration(totalMinutes)}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--color-text-tertiary)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                阅读次数: <span className="text-[var(--color-text-primary)] font-medium">{sessions.length} 次</span>
              </span>
            </div>
          </div>
          
          {/* Progress */}
          {book.totalPages > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--color-text-secondary)]">阅读进度</span>
                <span className="text-sm font-medium text-[var(--color-accent)]">
                  {book.currentPage} / {book.totalPages} 页 ({progress}%)
                </span>
              </div>
              <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max={book.totalPages}
                  value={progressInput}
                  onChange={e => setProgressInput(e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-[var(--color-text-tertiary)]">/ {book.totalPages} 页</span>
                <Button size="sm" onClick={handleProgressChange}>更新</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Notes Section */}
      <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            阅读笔记 ({notes.length})
          </h3>
          <Button size="sm" onClick={() => setShowNoteForm(!showNoteForm)}>
            {showNoteForm ? '取消' : '添加笔记'}
          </Button>
        </div>
        
        {/* Add Note Form */}
        {showNoteForm && (
          <div className="mb-4 p-4 bg-[var(--color-bg-hover)] rounded-lg space-y-3">
            <TextArea
              placeholder="摘录内容..."
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
            />
            <TextArea
              placeholder="个人评论（可选）..."
              value={noteComment}
              onChange={e => setNoteComment(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="页码（可选）"
                value={notePage}
                onChange={e => setNotePage(e.target.value)}
                className="w-32"
              />
              <Button size="sm" onClick={handleAddNote} disabled={!noteContent.trim()}>
                保存笔记
              </Button>
            </div>
          </div>
        )}
        
        {/* Notes List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {notes.length === 0 ? (
            <p className="text-sm text-[var(--color-text-tertiary)] text-center py-4">
              暂无笔记
            </p>
          ) : (
            notes.map(note => (
              <div key={note.id} className="p-3 bg-[var(--color-bg-hover)] rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[var(--color-accent)] font-medium">
                    {note.page ? `第 ${note.page} 页` : '未标注页码'}
                  </span>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm text-[var(--color-text-primary)] italic mb-1">
                  "{note.content}"
                </p>
                {note.comment && (
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {note.comment}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
