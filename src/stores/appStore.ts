import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Book, Note, ReadingSession, 
  BookInput, NoteInput, SessionInput,
  StatsSummary, FilterOptions, ExportData 
} from '../types';
import { generateId } from '../utils/id';
import { calculateStreak, getWeekStart, isThisMonth } from '../utils/date';

interface AppStore {
  // 状态
  books: Book[];
  notes: Note[];
  sessions: ReadingSession[];
  theme: 'light' | 'dark';
  
  // 主题操作
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  // 书籍 CRUD
  addBook: (input: BookInput) => Book;
  updateBook: (id: string, input: Partial<BookInput>) => void;
  deleteBook: (id: string) => void;
  updateBookProgress: (id: string, page: number) => void;
  
  // 笔记 CRUD
  addNote: (input: NoteInput) => Note;
  updateNote: (id: string, input: Partial<NoteInput>) => void;
  deleteNote: (id: string) => void;
  
  // 阅读记录 CRUD
  addSession: (input: SessionInput) => ReadingSession;
  updateSession: (id: string, input: Partial<SessionInput>) => void;
  deleteSession: (id: string) => void;
  // 同一天同书籍自动合并
  submitSession: (input: SessionInput) => ReadingSession;
  
  // 数据管理
  importData: (data: ExportData) => void;
  exportData: () => ExportData;
  resetData: () => void;
  
  // 查询方法 (派生状态)
  getBookById: (id: string) => Book | undefined;
  getNotesByBook: (bookId: string) => Note[];
  getSessionsByBook: (bookId: string) => ReadingSession[];
  getSessionsByDate: (date: string) => ReadingSession[];
  getStats: () => StatsSummary;
  getFilteredBooks: (filter: FilterOptions) => Book[];
  getAllTags: () => string[];
}

const initialState = {
  books: [],
  notes: [],
  sessions: [],
  theme: 'light' as const,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // 主题操作
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
      
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.setAttribute('data-theme', newTheme);
      },
      
      // 书籍 CRUD
      addBook: (input) => {
        const now = new Date().toISOString();
        const book: Book = {
          id: generateId(),
          title: input.title,
          author: input.author,
          coverUrl: input.coverUrl,
          totalPages: input.totalPages || 0,
          currentPage: input.currentPage || 0,
          status: input.status,
          tags: input.tags || [],
          createdAt: now,
          updatedAt: now,
        };
        set(state => ({ books: [...state.books, book] }));
        return book;
      },
      
      updateBook: (id, input) => {
        set(state => ({
          books: state.books.map(b => 
            b.id === id 
              ? { 
                  ...b, 
                  ...input,
                  tags: input.tags || b.tags,
                  updatedAt: new Date().toISOString() 
                } 
              : b
          ),
        }));
      },
      
      deleteBook: (id) => {
        // 级联删除关联的笔记和阅读记录
        set(state => ({
          books: state.books.filter(b => b.id !== id),
          notes: state.notes.filter(n => n.bookId !== id),
          sessions: state.sessions.filter(s => s.bookId !== id),
        }));
      },
      
      updateBookProgress: (id, page) => {
        const book = get().getBookById(id);
        if (!book) return;
        
        const validPage = Math.max(0, Math.min(page, book.totalPages));
        const isCompleted = book.totalPages > 0 && validPage === book.totalPages;
        
        set(state => ({
          books: state.books.map(b => 
            b.id === id 
              ? { 
                  ...b, 
                  currentPage: validPage,
                  status: isCompleted ? 'done' : b.status,
                  updatedAt: new Date().toISOString() 
                } 
              : b
          ),
        }));
      },
      
      // 笔记 CRUD
      addNote: (input) => {
        const now = new Date().toISOString();
        const note: Note = {
          id: generateId(),
          bookId: input.bookId,
          content: input.content,
          comment: input.comment,
          page: input.page,
          createdAt: now,
          updatedAt: now,
        };
        set(state => ({ notes: [...state.notes, note] }));
        return note;
      },
      
      updateNote: (id, input) => {
        set(state => ({
          notes: state.notes.map(n => 
            n.id === id 
              ? { ...n, ...input, updatedAt: new Date().toISOString() } 
              : n
          ),
        }));
      },
      
      deleteNote: (id) => {
        set(state => ({
          notes: state.notes.filter(n => n.id !== id),
        }));
      },
      
      // 阅读记录 CRUD
      addSession: (input) => {
        const now = new Date().toISOString();
        const session: ReadingSession = {
          id: generateId(),
          bookId: input.bookId,
          date: input.date,
          durationMinutes: input.durationMinutes,
          note: input.note,
          createdAt: now,
          updatedAt: now,
        };
        set(state => ({ sessions: [...state.sessions, session] }));
        return session;
      },
      
      updateSession: (id, input) => {
        set(state => ({
          sessions: state.sessions.map(s => 
            s.id === id 
              ? { ...s, ...input, updatedAt: new Date().toISOString() } 
              : s
          ),
        }));
      },
      
      deleteSession: (id) => {
        set(state => ({
          sessions: state.sessions.filter(s => s.id !== id),
        }));
      },
      
      // 提交阅读记录（自动合并同一天同书籍）
      submitSession: (input) => {
        const state = get();
        const existing = state.sessions.find(
          s => s.bookId === input.bookId && s.date === input.date
        );
        
        if (existing) {
          // 合并时长
          const updated: ReadingSession = {
            ...existing,
            durationMinutes: existing.durationMinutes + input.durationMinutes,
            updatedAt: new Date().toISOString(),
          };
          set({
            sessions: state.sessions.map(s => 
              s.id === existing.id ? updated : s
            ),
          });
          return updated;
        } else {
          // 新建记录
          return state.addSession(input);
        }
      },
      
      // 数据管理
      importData: (data) => {
        set({
          books: data.books || [],
          notes: data.notes || [],
          sessions: data.sessions || [],
        });
      },
      
      exportData: () => ({
        version: '1.0',
        exportAt: new Date().toISOString(),
        books: get().books,
        notes: get().notes,
        sessions: get().sessions,
      }),
      
      resetData: () => {
        set(initialState);
      },
      
      // 查询方法
      getBookById: (id) => {
        return get().books.find(b => b.id === id);
      },
      
      getNotesByBook: (bookId) => {
        return get().notes.filter(n => n.bookId === bookId);
      },
      
      getSessionsByBook: (bookId) => {
        return get().sessions.filter(s => s.bookId === bookId);
      },
      
      getSessionsByDate: (date) => {
        return get().sessions.filter(s => s.date === date);
      },
      
      getStats: () => {
        const state = get();
        const weekStart = getWeekStart();
        
        // 基础统计
        const totalBooks = state.books.length;
        const readingBooks = state.books.filter(b => b.status === 'reading').length;
        const completedBooks = state.books.filter(b => b.status === 'done').length;
        
        // 时长统计
        const totalReadingMinutes = state.sessions.reduce(
          (sum, s) => sum + s.durationMinutes, 0
        );
        const weeklyReadingMinutes = state.sessions
          .filter(s => new Date(s.date) >= weekStart)
          .reduce((sum, s) => sum + s.durationMinutes, 0);
        
        // 本月完成数
        const monthlyCompletedBooks = state.books.filter(b => {
          return b.status === 'done' && isThisMonth(b.updatedAt);
        }).length;
        
        // 连续天数
        const uniqueDates = [...new Set(state.sessions.map(s => s.date))];
        const streaks = calculateStreak(uniqueDates);
        
        return {
          totalBooks,
          readingBooks,
          completedBooks,
          totalReadingMinutes,
          weeklyReadingMinutes,
          monthlyCompletedBooks,
          currentStreak: streaks.current,
          longestStreak: streaks.longest,
        };
      },
      
      getFilteredBooks: (filter) => {
        let result = get().books;
        
        // 状态筛选
        if (filter.status && filter.status !== 'all') {
          result = result.filter(b => b.status === filter.status);
        }
        
        // 标签筛选
        if (filter.tag && filter.tag !== 'all') {
          result = result.filter(b => b.tags.includes(filter.tag!));
        }
        
        // 搜索筛选
        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          result = result.filter(b => 
            b.title.toLowerCase().includes(query) || 
            b.author.toLowerCase().includes(query)
          );
        }
        
        return result;
      },
      
      getAllTags: () => {
        const tags = new Set<string>();
        get().books.forEach(b => b.tags.forEach(t => tags.add(t)));
        return [...tags].sort();
      },
    }),
    {
      name: 'bookflow-storage',
      partialize: (state) => ({ 
        books: state.books, 
        notes: state.notes, 
        sessions: state.sessions,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        // 恢复时应用主题
        if (state) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
