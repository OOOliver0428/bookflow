import { format, subDays, isSameDay, startOfWeek, startOfMonth, getMonth, getYear } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 获取今天的日期字符串 (YYYY-MM-DD)
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

// 格式化日期显示 (完整)
export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'yyyy年MM月dd日', { locale: zhCN });
}

// 格式化日期显示 (简短)
export function formatDateShort(dateStr: string): string {
  return format(new Date(dateStr), 'MM/dd', { locale: zhCN });
}

// 格式化日期显示 (月份)
export function formatMonth(dateStr: string): string {
  return format(new Date(dateStr), 'M月', { locale: zhCN });
}

// 获取本周开始日期
export function getWeekStart(): Date {
  const now = new Date();
  return startOfWeek(now, { weekStartsOn: 1 }); // 周一开始
}

// 获取本月开始日期
export function getMonthStart(): Date {
  return startOfMonth(new Date());
}

// 获取过去 N 天的日期列表（包含今天）
export function getPastNDays(days: number): string[] {
  const result: string[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    result.push(format(date, 'yyyy-MM-dd'));
  }
  
  return result;
}

// 检查日期是否在今天之前
export function isBeforeToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

// 检查是否是同一天
export function isSameDate(date1: string, date2: string): boolean {
  return isSameDay(new Date(date1), new Date(date2));
}

// 计算连续阅读天数
export function calculateStreak(dates: string[]): { current: number; longest: number } {
  if (dates.length === 0) return { current: 0, longest: 0 };
  
  // 去重并排序
  const uniqueDates = [...new Set(dates)].sort();
  const today = getTodayString();
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  
  let longest = 0;
  let currentStreak = 0;
  let maxStreak = 0;
  
  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }
  }
  
  longest = Math.max(maxStreak, currentStreak);
  
  // 计算当前连续天数
  const lastDate = uniqueDates[uniqueDates.length - 1];
  let current = 0;
  
  if (lastDate === today || lastDate === yesterday) {
    current = currentStreak;
  } else {
    current = 0;
  }
  
  return { current, longest };
}

// 格式化时长显示
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} 分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} 小时`;
  }
  return `${hours} 小时 ${mins} 分钟`;
}

// 格式化计时器显示 (MM:SS 或 HH:MM:SS)
export function formatTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// 检查日期是否在本月
export function isThisMonth(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  return getMonth(date) === getMonth(now) && getYear(date) === getYear(now);
}

// 检查日期是否在本周
export function isThisWeek(dateStr: string): boolean {
  const date = new Date(dateStr);
  const weekStart = getWeekStart();
  return date >= weekStart;
}
