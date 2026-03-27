import React, { useMemo } from 'react';
import { getDay, isSameMonth, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useAppStore } from '../stores/appStore';
import { generateHeatmapData, getHeatLabel } from '../utils/heatmap';
import { Tooltip } from './ui';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export const Heatmap: React.FC = () => {
  const { sessions } = useAppStore();
  
  const data = useMemo(() => generateHeatmapData(sessions, 84), [sessions]);
  
  // 按周分组
  const weeks = useMemo(() => {
    const result: typeof data[] = [];
    if (data.length === 0) return result;
    
    let currentIndex = data.length - 1;
    
    while (currentIndex >= 0) {
      const week: typeof data = [];
      const currentDay = data[currentIndex];
      const dayOfWeek = getDay(new Date(currentDay.date));
      
      // 填充本周剩余天数（倒序）
      for (let i = dayOfWeek; i >= 0 && currentIndex >= 0; i--) {
        week.unshift(data[currentIndex]);
        currentIndex--;
      }
      
      // 如果这周没满7天，在前面补null
      while (week.length < 7) {
        week.unshift(null as unknown as typeof data[0]);
      }
      
      result.unshift(week);
    }
    
    return result;
  }, [data]);
  
  // 统计
  const stats = useMemo(() => {
    const totalDays = data.filter(d => d.duration > 0).length;
    const totalDuration = data.reduce((sum, d) => sum + d.duration, 0);
    return { totalDays, totalDuration };
  }, [data]);
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  if (data.length === 0) {
    return (
      <div className="h-32 bg-[var(--color-bg-hover)] rounded-lg animate-pulse" />
    );
  }
  
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--color-text-secondary)]">
          {stats.totalDays} 天阅读 · 累计 {Math.floor(stats.totalDuration / 60)} 小时
        </p>
        
        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-tertiary)]">
          <span>少</span>
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-2.5 h-2.5 rounded-[2px] heat-${level}`}
              />
            ))}
          </div>
          <span>多</span>
        </div>
      </div>
      
      {/* Heatmap Grid */}
      <div className="flex gap-1">
        {/* Weekday Labels */}
        <div className="flex flex-col gap-1 pt-5">
          {WEEKDAYS.map((day, i) => (
            <div 
              key={i} 
              className="h-3 text-[9px] text-[var(--color-text-tertiary)] flex items-center justify-end w-4"
            >
              {i % 2 === 1 ? day : ''}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {weeks.map((week, weekIndex) => {
              const weekMonth = week.find(d => d)?.date 
                ? format(new Date(week.find(d => d)!.date), 'M月', { locale: zhCN })
                : '';
              
              const isFirstWeekOfMonth = weekIndex === 0 || 
                (week[0]?.date && weeks[weekIndex - 1]?.[6]?.date &&
                  !isSameMonth(new Date(week[0].date), new Date(weeks[weekIndex - 1][6]!.date)));
              
              return (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {/* Month Label */}
                  <div className="h-4 flex items-end pb-0.5">
                    {isFirstWeekOfMonth && (
                      <span className="text-[10px] text-[var(--color-text-tertiary)] font-medium">
                        {weekMonth}
                      </span>
                    )}
                  </div>
                  
                  {/* Days */}
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <div key={dayIndex} className="w-3 h-3 rounded-[2px]" />;
                    }
                    
                    const isToday = day.date === todayStr;
                    const dayOfWeek = WEEKDAYS[dayIndex];
                    
                    return (
                      <Tooltip
                        key={dayIndex}
                        content={
                          <div className="space-y-1 min-w-[120px]">
                            <div className="text-sm font-medium text-[var(--color-text-primary)]">
                              {format(new Date(day.date), 'MM月dd日', { locale: zhCN })} {dayOfWeek}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-[var(--color-text-primary)]">
                                {day.duration}
                              </span>
                              <span className="text-xs text-[var(--color-text-secondary)]">分钟</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-hover)] text-[var(--color-text-tertiary)]">
                                {getHeatLabel(day.level)}
                              </span>
                            </div>
                          </div>
                        }
                      >
                        <div
                          className={`
                            w-3 h-3 rounded-[2px] cursor-pointer
                            transition-all duration-200
                            ${isToday ? 'ring-1 ring-[var(--color-accent)] ring-offset-[1px]' : ''}
                            hover:scale-125
                            heat-${day.level}
                          `}
                        />
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
