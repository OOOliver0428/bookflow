import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2 
            bg-[var(--color-bg-primary)] 
            border border-[var(--color-border)] 
            rounded-lg 
            text-[var(--color-text-primary)] 
            placeholder:text-[var(--color-text-tertiary)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]
            transition-all duration-200
            resize-vertical
            min-h-[80px]
            ${error ? 'border-[var(--color-danger)]' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-[var(--color-danger)]">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
