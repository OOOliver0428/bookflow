import { nanoid } from 'nanoid';

// 生成唯一 ID (21字符 URL-safe)
export function generateId(): string {
  return nanoid();
}
