import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = '搜索书名、作者...' 
}) => {
  const [value, setValue] = useState('');
  
  // 简单的防抖实现
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // 使用 setTimeout 实现简单防抖
    setTimeout(() => {
      onSearch(newValue.trim());
    }, 200);
  };
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
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
