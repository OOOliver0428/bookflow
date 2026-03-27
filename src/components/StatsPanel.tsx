import React from 'react';
import { useAppStore } from '../stores/appStore';
import { formatDuration } from '../utils/date';

export const StatsPanel: React.FC = () => {
  const { getStats } = useAppStore();
  const stats = getStats();
  
  const items = [
    { label: '本周阅读', value: formatDuration(stats.weeklyReadingMinutes), accent: true },
    { label: '本月读完', value: `${stats.monthlyCompletedBooks} 本`, accent: true },
    { label: '连续阅读', value: `${stats.currentStreak} 天`, success: true },
  ];
  
  return (
    <div className="space-y-3">
      {items.map(item => (
        <div 
          key={item.label}
          className="flex items-center justify-between py-2 border-b border-[var(--color-border)]/50 last:border-0"
        >
          <span className="text-sm text-[var(--color-text-secondary)]">{item.label}</span>
          <span className={`
            text-sm font-semibold tabular-nums
            ${item.accent ? 'text-[var(--color-accent)]' : ''}
            ${item.success ? 'text-[var(--color-success)]' : ''}
          `}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};
