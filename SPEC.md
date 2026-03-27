# BookFlow — 图书阅读管理

## 1. Concept & Vision

一个让人**沉浸于阅读**的管理工具。不是冷冰冰的书单列表，而是一个安静、专注、有点仪式感的个人图书馆。白天用浅色主题保护视力，夜间自动切换深色玻璃主题。打开它，就像走进一个专属于你的阅读角落。

## 2. Dual Theme System

### Light Theme（白天/阅读模式）
**Aesthetic**: Notion-inspired Digital Minimalism — 干净的浅色背景，温暖的视觉感受，极简的边框和卡片。

| Token | Value |
|-------|-------|
| bg-base | `#F7F6F3` (Notion workspace 暖灰) |
| bg-surface | `#FFFFFF` |
| bg-elevated | `#FAFAF9` |
| border | `#E8E5E0` |
| text-primary | `#37352F` (Notion 黑) |
| text-secondary | `#787774` |
| accent | `#2383E2` (Notion 蓝) |
| success | `#4DAB9A` |

**Typography**: Outfit + Noto Sans SC
**Radius**: 6px (Notion 风格，偏方)
**Motion**: 轻盈，150-250ms ease-out

### Dark Theme（夜间/沉浸模式）
复刻 TaskFlow 的 Liquid Glass 风格。

| Token | Value |
|-------|-------|
| bg-base | `#09090b` |
| glass-bg | `rgba(22,22,28,0.6)` |
| glass-border | `rgba(255,255,255,0.07)` |
| accent | `#3b82f6` |
| text-primary | `#f4f4f5` |

**Typography**: Outfit + Noto Sans SC
**Radius**: 12-20px 分层
**Motion**: Spring physics, 250-400ms

## 3. Layout & Structure

```
┌──────────────────────────────────────────────────────────┐
│  Header: BookFlow logo + 当前阅读数 + 主题切换 + 搜索   │
├─────────────────────┬────────────────────────────────────┤
│  Sidebar (左侧)    │  Main Content (右侧)               │
│  ─────────────────  │  ─────────────────────────────────│
│  📊 阅读统计        │  🔖 正在阅读 (Gallery)            │
│  - 本周阅读时长     │  [封面] [封面] [封面] [封面]       │
│  - 本月阅读本数     │                                    │
│  - 连续阅读天数     │  📚 我的书架 (Gallery)             │
│                     │  [封面] [封面] [封面] [封面] ...    │
│  🔥 阅读热力图     │                                    │
│  (类 GitHub graph)  │  📝 阅读笔记 (List)                │
│                     │                                    │
│  🏷️ 标签筛选       │  ⏱️ 阅读日志 (Table)               │
└─────────────────────┴────────────────────────────────────┘
```

**响应式**: 移动端侧边栏收起为抽屉，单列展示。

## 4. Features & Interactions

### 4.1 书籍管理
**添加书籍**:
- 点击「+ 添加书籍」展开表单
- 字段：书名(必填)、作者(必填)、封面图片 URL、标签、总页数、出版社
- 支持快速添加：书名 + Enter 即创建

**书籍状态** (四档):
- 📖 计划阅读 (Want to Read)
- 🔄 正在阅读 (Currently Reading) — 显示阅读进度
- ✅ 已完成 (Read)
- 📝 做笔记中 (Taking Notes)

**进度追踪**:
- 百分比进度条
- 当前页数 / 总页数
- 预计完成时间（基于阅读速度）

### 4.2 阅读计时
**计时器**:
- 点击书籍 → 展开详情 → 「开始阅读」按钮
- 实时计时（分钟）
- 暂停/继续/结束
- 结束后自动记入阅读日志

**阅读日志**:
- 日期 | 时长(分钟) | 书籍 | 章节备注
- 可手动编辑

### 4.3 阅读热力图
- 类似 GitHub contribution graph
- 展示过去 12 周的阅读活动
- 颜色深浅 = 阅读时长

### 4.4 阅读笔记
- 关联到具体书籍
- 支持摘录 + 评论
- 按书籍筛选

### 4.5 主题切换
- 自动检测系统偏好（`prefers-color-scheme`）
- 手动 toggle 覆盖
- 记住用户偏好（localStorage）
- 切换时平滑过渡（300ms）

### 4.6 统计面板
- 本周阅读时长
- 本月阅读本数
- 连续阅读天数
- 平均阅读速度（页/小时）

## 5. Component Inventory

### BookCard (Gallery)
- 封面图片（16:9 aspect ratio，fallback 到书名首字）
- 书名（单行截断）
- 作者（副标题色）
- 进度条（当前阅读时显示）
- 状态标签

### BookDetail (Modal/Expanded)
- 大封面
- 书名、作者、出版社、ISBN
- 阅读进度编辑
- 计时器
- 笔记入口

### ReadingTimer
- 大字体计时显示 `HH:MM`
- 开始/暂停/结束按钮
- 当前书籍关联

### HeatmapGrid
- 12 周 × 7 天网格
- 5 级颜色深度（0-10-30-60-120+ 分钟）
- hover 显示具体时长

### ReadingLogTable
- 日期 | 时长 | 书籍(关联) | 备注
- 排序（最新在前）
- 支持手动新增/删除

### TagBadge
- 彩色小标签
- 可点击筛选

## 6. Technical Approach

**Stack**: 纯 HTML + CSS + JavaScript（无框架）

**Data Model**:
```javascript
Book {
  id: string,
  title: string,
  author: string,
  coverUrl: string | null,
  totalPages: number,
  currentPage: number,        // 0-totalPages
  status: 'want' | 'reading' | 'done' | 'notes',
  tags: string[],
  createdAt: string,
  updatedAt: string,
  notes: Note[]
}

Note {
  id: string,
  bookId: string,
  content: string,           // 摘录文字
  comment: string,           // 笔记评论
  page: number | null,
  createdAt: string
}

ReadingSession {
  id: string,
  bookId: string,
  date: string,              // ISO date
  durationMinutes: number,
  note: string
}

UserPrefs {
  theme: 'light' | 'dark' | 'system',
  stats: { streak: number, lastReadDate: string }
}
```

**Storage**: localStorage（各数据独立 key）

**Theme Switch**: CSS Custom Properties 切换 + `data-theme` 属性在 `<html>` 上

**Performance**:
- 懒加载封面图片
- 热力图 Canvas 渲染（大量格子）
- 防抖搜索

## 7. Design Tokens Summary

| Token | Light | Dark |
|-------|-------|------|
| bg-primary | `#F7F6F3` | `#09090b` |
| bg-surface | `#FFFFFF` | `rgba(22,22,28,0.6)` |
| border | `#E8E5E0` | `rgba(255,255,255,0.07)` |
| text-primary | `#37352F` | `#f4f4f5` |
| accent | `#2383E2` | `#3b82f6` |
| radius | 6px | 12-20px |
