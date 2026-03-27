import type { Book, Note, ReadingSession, ExportData } from '../types';

// 导出为 JSON
export function exportToJSON(books: Book[], notes: Note[], sessions: ReadingSession[]): string {
  const data: ExportData = {
    version: '1.0',
    exportAt: new Date().toISOString(),
    books,
    notes,
    sessions,
  };
  return JSON.stringify(data, null, 2);
}

// 导出为 CSV (仅阅读记录)
export function exportSessionsToCSV(sessions: ReadingSession[], books: Book[]): string {
  const bookMap = new Map(books.map(b => [b.id, b]));
  
  const headers = ['日期', '书籍', '作者', '阅读时长(分钟)', '备注'];
  const rows = sessions.map(session => {
    const book = bookMap.get(session.bookId);
    return [
      session.date,
      book?.title || '未知书籍',
      book?.author || '',
      session.durationMinutes.toString(),
      session.note || '',
    ];
  });
  
  // CSV 转义
  const escapeCSV = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };
  
  return [headers, ...rows]
    .map(row => row.map(escapeCSV).join(','))
    .join('\n');
}

// 下载文件
export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 从文件导入 JSON
export async function importFromJSON(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as ExportData;
        
        // 验证数据结构
        if (!data.books || !Array.isArray(data.books)) {
          reject(new Error('无效的数据格式：缺少 books 数组'));
          return;
        }
        if (!data.notes || !Array.isArray(data.notes)) {
          reject(new Error('无效的数据格式：缺少 notes 数组'));
          return;
        }
        if (!data.sessions || !Array.isArray(data.sessions)) {
          reject(new Error('无效的数据格式：缺少 sessions 数组'));
          return;
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error('JSON 解析失败'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}
