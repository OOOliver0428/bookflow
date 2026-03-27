import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = '搜索书名、作者...' 
}) => {
  const [value, setValue] = useState('');
  // FIX: 使用 useDebounce hook 替代 setTimeout，避免内存泄漏和多次触发
  const debouncedValue = useDebounce(value, 200);
  
  useEffect(() => {
    onSearch(debouncedValue.trim());
  }, [debouncedValue, onSearch]);
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-3 py-2
          bg-[var(--color-bg-surface)]
          border border-[var(--color-border)]
          rounded-lg
          text-sm text-[var(--color-text-primary)]
          placeholder:text-[var(--color-text-tertiary)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]
          transition-all duration-200
        "
      />
    </div>
  );
};
