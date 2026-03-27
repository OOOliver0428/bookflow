# BookFlow - AI Agent Guide

> 本文档为 AI 编程助手提供项目背景、架构说明和开发指南。

## 项目概述

**BookFlow** 是一款图书阅读记录工具，用于追踪用户的阅读活动。这是一款纯前端单页应用（SPA），所有数据存储在浏览器本地。

### 核心功能
- 📚 **书籍管理** - 添加、编辑、删除书籍，支持封面上传
- 📝 **阅读记录** - 记录每日阅读时长，自动合并同一天同一书籍的多次记录
- 🔥 **热力图** - GitHub 风格年度阅读可视化
- 💬 **阅读笔记** - 为书籍添加摘录和评论
- ⏱️ **阅读计时** - 实时计时器，自动记录阅读时长
- 📊 **统计摘要** - 本周时长、本月本数、连续天数等数据
- 🎨 **主题切换** - 支持明亮/暗黑模式
- 💾 **数据管理** - JSON/CSV 导出导入，本地持久化存储

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript 5 |
| 状态管理 | Zustand 5 (持久化到 LocalStorage) |
| 样式方案 | Tailwind CSS v4 + CSS 变量 |
| 构建工具 | Vite 6 |
| 图标库 | Lucide React |
| 日期处理 | date-fns |
| ID 生成 | Nano ID (21字符 URL-safe) |

## 项目结构

```
bookflow/
├── docs/                      # 文档
├── public/                    # 静态资源
│   └── favicon.svg
├── src/
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── index.ts
│   │   ├── BookCard.tsx      # 书籍卡片
│   │   ├── BookGrid.tsx      # 书籍网格
│   │   ├── BookForm.tsx      # 书籍表单
│   │   ├── BookDetail.tsx    # 书籍详情
│   │   ├── ReadingTimer.tsx  # 阅读计时器
│   │   ├── ReadingLog.tsx    # 阅读日志
│   │   ├── Heatmap.tsx       # 热力图
│   │   ├── StatsPanel.tsx    # 统计面板
│   │   ├── TagFilter.tsx     # 标签筛选
│   │   ├── SearchBar.tsx     # 搜索栏
│   │   ├── ThemeToggle.tsx   # 主题切换
│   │   ├── DataManager.tsx   # 数据管理
│   │   └── index.ts
│   ├── hooks/                 # 自定义 Hooks
│   │   └── useDebounce.ts
│   ├── stores/
│   │   └── appStore.ts       # Zustand 状态管理
│   ├── types/
│   │   └── index.ts          # TypeScript 类型定义
│   ├── utils/
│   │   ├── date.ts           # 日期处理
│   │   ├── export.ts         # 导入导出
│   │   ├── heatmap.ts        # 热力图计算
│   │   ├── id.ts             # ID 生成
│   │   └── image.ts          # 图片处理
│   ├── App.tsx               # 主应用组件
│   ├── main.tsx              # 应用入口
│   └── index.css             # 全局样式
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
└── AGENTS.md
```

## 核心数据模型

### Book (书籍)
```typescript
interface Book {
  id: string;              // Nano ID (21字符)
  title: string;           // 书名
  author: string;          // 作者
  coverUrl?: string;       // 封面 (base64 或 URL)
  totalPages: number;      // 总页数
  currentPage: number;     // 当前页数
  status: 'want' | 'reading' | 'done' | 'notes';
  tags: string[];
  createdAt: string;       // ISO 8601
  updatedAt: string;
}
```

### Note (阅读笔记)
```typescript
interface Note {
  id: string;
  bookId: string;          // 关联书籍 ID
  content: string;         // 摘录内容
  comment?: string;        // 个人评论
  page?: number;           // 页码
  createdAt: string;
  updatedAt: string;
}
```

### ReadingSession (阅读记录)
```typescript
interface ReadingSession {
  id: string;
  bookId: string;          // 关联书籍 ID
  date: string;            // YYYY-MM-DD
  durationMinutes: number; // 阅读时长
  note?: string;           // 备注
  createdAt: string;
  updatedAt: string;
}
```

## 核心业务逻辑

### 1. 阅读记录合并规则
同一天同一书籍的多次阅读会自动合并：
- 时长累加
- 更新时间刷新

### 2. 级联删除
- 删除书籍 → 同时删除关联的笔记和阅读记录

### 3. 进度自动更新
- 更新阅读进度时，如果达到总页数，自动标记为已完成

### 4. 数据统计
- 连续天数：自动计算当前连续和最长连续阅读天数
- 本周时长：从本周一开始计算
- 本月完成：本月标记为 done 的书籍

## 状态管理 (Zustand)

存储键名：`bookflow-storage`

### Store 结构
```typescript
interface AppStore {
  // 状态
  books: Book[];
  notes: Note[];
  sessions: ReadingSession[];
  theme: 'light' | 'dark';
  
  // 操作方法
  addBook(input): Book
  updateBook(id, input): void
  deleteBook(id): void
  addNote(input): Note
  updateNote(id, input): void
  deleteNote(id): void
  submitSession(input): ReadingSession
  updateSession(id, input): void
  deleteSession(id): void
  // ... 其他方法
}
```

### 使用示例
```typescript
import { useAppStore } from './stores/appStore';

// 读取状态
const books = useAppStore(state => state.books);

// 调用方法
const addBook = useAppStore(state => state.addBook);
const book = addBook({ title: '百年孤独', author: '马尔克斯', status: 'reading' });
```

## 代码风格指南

### TypeScript 规范
- 严格模式启用 (`strict: true`)
- 未使用的变量和参数必须清理
- 使用 ES2020 目标
- 模块使用 ESNext + Bundler 解析

### React 规范
- 使用函数组件 + Hooks
- Props 接口定义使用 `interface` + `React.FC`
- 事件处理使用回调函数

### 样式规范
- 使用 Tailwind CSS 工具类
- CSS 变量管理主题色彩 (定义在 `index.css`)
- 主题相关颜色使用 CSS 变量：`var(--color-*)`

### 命名规范
- 组件文件：PascalCase (如 `BookCard.tsx`)
- 工具函数文件：camelCase (如 `date.ts`)
- 类型定义：PascalCase + 接口名 (如 `Book`, `ReadingSession`)

## 数据导入导出

### JSON 格式 (完整备份)
```typescript
{
  version: '1.0',
  exportAt: string,    // ISO 8601
  books: Book[],
  notes: Note[],
  sessions: ReadingSession[]
}
```

### CSV 格式 (表格分析)
字段：`日期,书籍,作者,阅读时长(分钟),备注`

## 图片处理

- 支持格式：JPG, PNG
- 最大大小：5MB
- 自动压缩：最大 400x400 像素，JPEG 质量 0.8
- 存储格式：base64 Data URL

## 开发注意事项

### 1. 数据持久化
- 数据自动保存到 LocalStorage
- 导入数据会**覆盖**当前所有数据
- 清除浏览器数据会导致数据丢失

### 2. 日期处理
- 所有日期使用 `YYYY-MM-DD` 格式字符串
- 时间戳使用 ISO 8601 格式
- 使用 `date-fns` 进行日期计算

### 3. ID 生成
- 使用 `nanoid` 生成 21 字符唯一 ID
- ID 格式：URL-safe (A-Z, a-z, 0-9, _, -)

## 构建和开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

---

*Enjoy your reading journey 📚*
