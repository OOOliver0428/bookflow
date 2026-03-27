import React from 'react';
import { useAppStore } from '../stores/appStore';
import { Tag } from './ui';

interface TagFilterProps {
  activeTag: string;
  onTagChange: (tag: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ activeTag, onTagChange }) => {
  const { getAllTags } = useAppStore();
  const tags = getAllTags();
  
  return (
    <div className="flex flex-wrap gap-2">
      <Tag 
        active={activeTag === 'all'} 
        onClick={() => onTagChange('all')}
      >
        全部
      </Tag>
      {tags.map(tag => (
        <Tag 
          key={tag}
          active={activeTag === tag}
          onClick={() => onTagChange(tag)}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
};
