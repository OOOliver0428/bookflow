# Changelog

All notable changes to BookFlow will be documented in this file.

## [0.1.0] - 2026-03-28

### Bug Fixes
- **SearchBar**: 修复防抖实现 bug，使用 `useDebounce` hook 替代 `setTimeout`，避免内存泄漏和重复触发
- **BookCard**: 修复图片加载失败时使用 `innerHTML` 的 XSS 风险，改用 React state 控制降级渲染
- **App**: 优化状态管理，使用 Zustand selector 精确订阅，移除无效 `useMemo`，handler 函数使用 `useCallback` 稳定引用
- **Heatmap**: 修复 null 类型不安全的 `as unknown` 类型断言，改用 `(type | null)[][]` 明确类型

### Improvements
- **ReadingTimer**: 添加 `beforeunload` 事件监听，计时进行中关闭页面时提示用户确认
- **DataManager**: 导入数据前自动备份当前数据到 localStorage；添加 localStorage 容量监控面板
- **Export**: 导入 JSON 时添加版本校验和字段完整性验证，给出具体错误信息
- **ThemeToggle/ReadingLog**: 图标按钮添加 `aria-label`，提升可访问性
- **appStore**: 首次使用时自动检测系统主题偏好（`prefers-color-scheme`）
- **ReadingLog**: 使用 `useMemo` 缓存 `bookMap`，避免每次渲染重新创建

### Dependencies
- 无新增依赖

## [0.0.0] - 2026-03-27

### Initial Release
- 书籍 CRUD 管理（四状态：计划/阅读中/完成/笔记中）
- 阅读计时器与阅读日志
- 阅读热力图（类 GitHub contribution graph）
- 阅读统计面板
- 阅读笔记系统
- 双主题系统（Light: Notion 风格 / Dark: Liquid Glass 风格）
- 数据导入导出（JSON/CSV）
