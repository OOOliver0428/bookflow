// BookFlow - 图书阅读管理应用类型定义

// 书籍状态
export type BookStatus = 'want' | 'reading' | 'done' | 'notes';

// 书籍
export interface Book {
  id: string;              // nanoid (21字符)
  title: string;           // 书名
  author: string;          // 作者
  coverUrl?: string;       // 封面图片 (base64 或 URL)
  totalPages: number;      // 总页数
  currentPage: number;     // 当前页数 (0-totalPages)
  status: BookStatus;      // 阅读状态
  tags: string[];          // 标签
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}

// 阅读笔记
export interface Note {
  id: string;
  bookId: string;          // 关联书籍 ID
  content: string;         // 摘录内容
  comment?: string;        // 个人评论
  page?: number;           // 页码
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}

// 阅读记录/打卡
export interface ReadingSession {
  id: string;
  bookId: string;          // 关联书籍 ID
  date: string;            // YYYY-MM-DD
  durationMinutes: number; // 阅读时长 (分钟)
  note?: string;           // 备注
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}

// 书籍表单输入
export interface BookInput {
  title: string;
  author: string;
  coverUrl?: string;
  totalPages?: number;
  currentPage?: number;
  status: BookStatus;
  tags?: string[];
}

// 笔记表单输入
export interface NoteInput {
  bookId: string;
  content: string;
  comment?: string;
  page?: number;
}

// 阅读记录表单输入
export interface SessionInput {
  bookId: string;
  date: string;
  durationMinutes: number;
  note?: string;
}

// 热力图数据点
export interface HeatmapDataPoint {
  date: string;
  duration: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// 统计摘要
export interface StatsSummary {
  totalBooks: number;           // 总书籍数
  readingBooks: number;         // 正在阅读数
  completedBooks: number;       // 已完成数
  totalReadingMinutes: number;  // 总阅读时长 (分钟)
  weeklyReadingMinutes: number; // 本周阅读时长
  monthlyCompletedBooks: number;// 本月完成数
  currentStreak: number;        // 当前连续阅读天数
  longestStreak: number;        // 最长连续阅读天数
}

// 筛选选项
export interface FilterOptions {
  status?: BookStatus | 'all';
  tag?: string;
  searchQuery?: string;
}

// 导出数据格式
export interface ExportData {
  version: '1.0';
  exportAt: string;        // ISO 8601
  books: Book[];
  notes: Note[];
  sessions: ReadingSession[];
}

// 应用状态
export interface AppState {
  books: Book[];
  notes: Note[];
  sessions: ReadingSession[];
  theme: 'light' | 'dark';
}
