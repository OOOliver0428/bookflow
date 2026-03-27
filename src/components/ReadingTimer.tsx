import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { formatTimer, getTodayString } from '../utils/date';
import { Button, Select } from './ui';

export const ReadingTimer: React.FC = () => {
  const { books, submitSession } = useAppStore();
  const readingBooks = books.filter(b => b.status === 'reading');
  
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const start = () => {
    if (!selectedBookId) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };
  
  const pause = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const stop = () => {
    if (seconds > 0 && selectedBookId) {
      const minutes = Math.round(seconds / 60);
      if (minutes > 0) {
        submitSession({
          bookId: selectedBookId,
          date: getTodayString(),
          durationMinutes: minutes,
        });
      }
    }
    
    setIsRunning(false);
    setSeconds(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const selectedBook = books.find(b => b.id === selectedBookId);
  
  const bookOptions = [
    { value: '', label: '选择书籍...' },
    ...readingBooks.map(b => ({ value: b.id, label: b.title })),
  ];
  
  return (
    <div className="space-y-4">
      {/* Book Selector */}
      <Select
        value={selectedBookId}
        onChange={e => setSelectedBookId(e.target.value)}
        options={bookOptions}
      />
      
      {/* Timer Display */}
      <div className="text-center py-4">
        <div className="text-4xl font-bold text-[var(--color-text-primary)] tabular-nums tracking-tight font-[Outfit]">
          {formatTimer(seconds)}
        </div>
        {selectedBook && (
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            正在阅读: <span className="text-[var(--color-accent)]">{selectedBook.title}</span>
          </p>
        )}
      </div>
      
      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <Button
            variant="primary"
            onClick={start}
            disabled={!selectedBookId}
            className="!rounded-full !w-12 !h-12 !p-0"
          >
            <Play className="w-5 h-5 ml-0.5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={pause}
            className="!rounded-full !w-12 !h-12 !p-0"
          >
            <Pause className="w-5 h-5" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          onClick={stop}
          disabled={seconds === 0}
          className="!rounded-full !w-12 !h-12 !p-0"
        >
          <Square className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
