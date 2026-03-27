import { useState, useRef } from 'react';
import { Upload, ImageIcon, X } from 'lucide-react';
import type { BookInput, BookStatus } from '../types';
import { Button, Input, Select } from './ui';
import { handleImageUpload } from '../utils/image';

interface BookFormProps {
  initialData?: Partial<BookInput>;
  onSubmit: (data: BookInput) => void;
  onCancel: () => void;
}

const statusOptions = [
  { value: 'reading', label: '正在阅读' },
  { value: 'want', label: '计划阅读' },
  { value: 'done', label: '已完成' },
  { value: 'notes', label: '做笔记中' },
];

export const BookForm: React.FC<BookFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || '');
  const [totalPages, setTotalPages] = useState(initialData?.totalPages?.toString() || '');
  const [currentPage, setCurrentPage] = useState(initialData?.currentPage?.toString() || '0');
  const [status, setStatus] = useState<BookStatus>(initialData?.status || 'reading');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    
    onSubmit({
      title: title.trim(),
      author: author.trim(),
      coverUrl: coverUrl || undefined,
      totalPages: parseInt(totalPages) || 0,
      currentPage: parseInt(currentPage) || 0,
      status,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    const result = await handleImageUpload(file);
    
    if (result.success && result.data) {
      setCoverUrl(result.data);
    } else {
      setUploadError(result.error || '上传失败');
    }
    
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Cover Upload */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          封面
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {coverUrl ? (
          <div className="relative w-28 aspect-[2/3] rounded-lg overflow-hidden group">
            <img 
              src={coverUrl} 
              alt="书籍封面" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-white hover:text-[var(--color-accent)] transition-colors"
                title="更换封面"
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setCoverUrl('')}
                className="p-2 text-white hover:text-[var(--color-danger)] transition-colors"
                title="删除封面"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex flex-col items-center justify-center w-28 aspect-[2/3] rounded-lg border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-[var(--color-text-tertiary)] mb-1" />
                <span className="text-xs text-[var(--color-text-secondary)]">上传封面</span>
              </>
            )}
          </button>
        )}
        
        {uploadError && (
          <p className="mt-2 text-sm text-[var(--color-danger)]">{uploadError}</p>
        )}
      </div>
      
      <Input
        label="书名 *"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="例如：百年孤独"
        required
      />
      
      <Input
        label="作者 *"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        placeholder="例如：加西亚·马尔克斯"
        required
      />
      
      <div className="grid grid-cols-3 gap-3">
        <Input
          label="总页数"
          type="number"
          min="0"
          value={totalPages}
          onChange={e => setTotalPages(e.target.value)}
          placeholder="0"
        />
        <Input
          label="当前页"
          type="number"
          min="0"
          value={currentPage}
          onChange={e => setCurrentPage(e.target.value)}
          placeholder="0"
        />
        <Select
          label="状态"
          value={status}
          onChange={e => setStatus(e.target.value as BookStatus)}
          options={statusOptions}
        />
      </div>
      
      <Input
        label="标签（逗号分隔）"
        value={tags}
        onChange={e => setTags(e.target.value)}
        placeholder="例如：文学, 经典, 拉美"
      />
      
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" disabled={!title.trim() || !author.trim()}>
          保存
        </Button>
      </div>
    </form>
  );
};
