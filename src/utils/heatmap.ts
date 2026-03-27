import { subDays, format } from 'date-fns';
import type { HeatmapDataPoint, ReadingSession } from '../types';

// 热力图等级阈值（分钟）
const HEAT_THRESHOLDS = [0, 10, 30, 60, 120];

// 根据阅读时长获取热力等级
export function getHeatLevel(minutes: number): 0 | 1 | 2 | 3 | 4 {
  if (minutes >= HEAT_THRESHOLDS[4]) return 4;
  if (minutes >= HEAT_THRESHOLDS[3]) return 3;
  if (minutes >= HEAT_THRESHOLDS[2]) return 2;
  if (minutes >= HEAT_THRESHOLDS[1]) return 1;
  return 0;
}

// 生成热力图数据
export function generateHeatmapData(
  sessions: ReadingSession[],
  days: number = 84 // 12周
): HeatmapDataPoint[] {
  // 按日期汇总阅读时长
  const durationByDate = new Map<string, number>();
  
  sessions.forEach(session => {
    const current = durationByDate.get(session.date) || 0;
    durationByDate.set(session.date, current + session.durationMinutes);
  });
  
  // 生成过去 N 天的数据
  const result: HeatmapDataPoint[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const duration = durationByDate.get(dateStr) || 0;
    
    result.push({
      date: dateStr,
      duration,
      level: getHeatLevel(duration),
    });
  }
  
  return result;
}

// 获取热力图颜色标签
export function getHeatLabel(level: number): string {
  const labels = ['无记录', '较少', '一般', '较多', '很多'];
  return labels[level] || '无记录';
}
