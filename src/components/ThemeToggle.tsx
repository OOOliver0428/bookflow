import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { Button } from './ui';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useAppStore();
  const isDark = theme === 'dark';
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="!p-2"
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
      aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      {isDark ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </Button>
  );
};
