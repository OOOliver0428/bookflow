import React, { useState, useRef } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };
  
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--color-bg-elevated)]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--color-bg-elevated)]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--color-bg-elevated)]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--color-bg-elevated)]',
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 pointer-events-none
            ${positionClasses[position]}
          `}
        >
          <div className={`
            px-3 py-2 
            bg-[var(--color-bg-elevated)] 
            border border-[var(--color-border)]
            rounded-lg shadow-lg
            text-sm text-[var(--color-text-primary)]
            whitespace-nowrap
          `}>
            {content}
          </div>
          {/* Arrow */}
          <div className={`
            absolute w-0 h-0 
            border-4 border-transparent
            ${arrowClasses[position]}
          `} />
        </div>
      )}
    </div>
  );
};
