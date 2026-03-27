import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, LayoutGrid, List, Database } from 'lucide-react';
import { useAppStore } from './stores/appStore';
import {
  BookGrid,
  BookForm,
  BookDetail,
  ReadingTimer,
  ReadingLog,
  Heatmap,
  StatsPanel,
  TagFilter,
  SearchBar,
  ThemeToggle,
  DataManager,
} from './components';
import { Button, Modal } from './components/ui';
import type { Book, BookInput } from './types';

function App() {
  // FIX: 使用 Zustand selector 精确订阅所需数据，避免整个 store 变化触发重渲染
  const readingCount = useAppStore(state => state.books.filter(b => b.status === 'reading').length);
  const addBook = useAppStore(state => state.addBook);
  const updateBook = useAppStore(state => state.updateBook);
  const deleteBook = useAppStore(state => state.deleteBook);
  const getFilteredBooks = useAppStore(state => state.getFilteredBooks);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  // Derived state - getFilteredBooks 已是纯函数，直接调用
  const filteredBooks = getFilteredBooks({ tag: activeTag, searchQuery });
  const readingBooks = filteredBooks.filter(b => b.status === 'reading');
  const otherBooks = filteredBooks.filter(b => b.status !== 'reading');
  
  // Handlers - 使用 useCallback 稳定引用
  const handleAddBook = useCallback((input: BookInput) => {
    addBook(input);
    setIsBookFormOpen(false);
  }, [addBook]);
  
  const handleUpdateBook = useCallback((input: BookInput) => {
    if (editingBook) {
      updateBook(editingBook.id, input);
      setEditingBook(null);
      setSelectedBook(null);
    }
  }, [editingBook, updateBook]);
  
  const handleDeleteBook = useCallback(() => {
    if (selectedBook) {
      deleteBook(selectedBook.id);
      setSelectedBook(null);
    }
  }, [selectedBook, deleteBook]);
  
  const handleStartTimer = useCallback(() => {
    setSelectedBook(null);
    document.getElementById('reading-timer')?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  // FIX: 使用 useCallback 稳定搜索回调，避免 SearchBar 不必要重渲染
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 'n' to add new book (when not in input)
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsBookFormOpen(true);
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-bg-base)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center shadow-sm">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--color-text-primary)]">BookFlow</h1>
                <p className="text-xs text-[var(--color-text-secondary)]">图书阅读管理</p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Reading Count */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-secondary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                正在阅读 {readingCount} 本
              </div>
              
              {/* Search */}
              <div className="hidden md:block w-48">
                <SearchBar onSearch={handleSearch} />
              </div>
              
              {/* Data Manager */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsDataManagerOpen(true)}
                className="!p-2"
                title="数据管理"
                aria-label="数据管理"
              >
                <Database className="w-5 h-5" />
              </Button>
              
              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-6 animate-fade-down">
            {/* Stats */}
            <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5">
              <h2 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">
                阅读统计
              </h2>
              <StatsPanel />
            </div>
            
            {/* Heatmap */}
            <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5">
              <h2 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">
                阅读热力图
              </h2>
              <Heatmap />
            </div>
            
            {/* Tags */}
            <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5">
              <h2 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">
                标签筛选
              </h2>
              <TagFilter activeTag={activeTag} onTagChange={setActiveTag} />
            </div>
            
            {/* Timer */}
            <div id="reading-timer" className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl p-5">
              <h2 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">
                阅读计时
              </h2>
              <ReadingTimer />
            </div>
          </aside>
          
          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Mobile Search */}
            <div className="md:hidden">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            {/* Currently Reading */}
            <section className="animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  正在阅读
                  <span className="text-sm font-normal text-[var(--color-text-tertiary)]">
                    ({readingBooks.length})
                  </span>
                </h2>
                <Button onClick={() => setIsBookFormOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  添加书籍
                </Button>
              </div>
              <BookGrid 
                books={readingBooks}
                onBookClick={setSelectedBook}
                emptyTitle="没有正在阅读的书籍"
                emptyDescription="点击上方「添加书籍」开始你的阅读之旅"
              />
            </section>
            
            {/* Bookshelf */}
            <section className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                  <List className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  我的书架
                  <span className="text-sm font-normal text-[var(--color-text-tertiary)]">
                    ({otherBooks.length})
                  </span>
                </h2>
              </div>
              <BookGrid 
                books={otherBooks}
                onBookClick={setSelectedBook}
                emptyTitle="书架是空的"
                emptyDescription="添加一些书籍吧"
              />
            </section>
            
            {/* Reading Log */}
            <section className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2 mb-4">
                <List className="w-5 h-5 text-[var(--color-text-secondary)]" />
                阅读日志
              </h2>
              <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                <ReadingLog />
              </div>
            </section>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            BookFlow · 记录你的阅读之旅
          </p>
          <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
            按 <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-hover)] rounded text-[var(--color-text-secondary)]">N</kbd> 快速添加书籍
          </p>
        </div>
      </footer>
      
      {/* Book Form Modal */}
      <Modal
        isOpen={isBookFormOpen}
        onClose={() => {
          setIsBookFormOpen(false);
          setEditingBook(null);
        }}
        title="添加书籍"
        size="md"
      >
        <BookForm
          onSubmit={handleAddBook}
          onCancel={() => setIsBookFormOpen(false)}
        />
      </Modal>
      
      {/* Edit Book Modal */}
      {editingBook && (
        <Modal
          isOpen={!!editingBook}
          onClose={() => setEditingBook(null)}
          title="编辑书籍"
          size="md"
        >
          <BookForm
            initialData={{
              title: editingBook.title,
              author: editingBook.author,
              coverUrl: editingBook.coverUrl,
              totalPages: editingBook.totalPages,
              currentPage: editingBook.currentPage,
              status: editingBook.status,
              tags: editingBook.tags,
            }}
            onSubmit={handleUpdateBook}
            onCancel={() => setEditingBook(null)}
          />
        </Modal>
      )}
      
      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetail
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          onEdit={() => {
            setEditingBook(selectedBook);
            setSelectedBook(null);
          }}
          onDelete={() => {
            if (confirm('确定要删除这本书吗？')) {
              handleDeleteBook();
            }
          }}
          onStartTimer={handleStartTimer}
        />
      )}
      
      {/* Data Manager Modal */}
      <Modal
        isOpen={isDataManagerOpen}
        onClose={() => setIsDataManagerOpen(false)}
        title="数据管理"
        size="md"
      >
        <DataManager />
      </Modal>
    </div>
  );
}

export default App;
