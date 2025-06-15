import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className = '',
  position = 'bottom',
  maxWidth = '16rem' // 256px / 64 characters
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2';
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2';
      case 'right':
        return 'left-full ml-2';
      default:
        return 'top-full mt-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-4 border-l-transparent border-r-transparent border-t-gray-800';
      case 'bottom':
        return 'bottom-full left-4 border-l-transparent border-r-transparent border-b-gray-800';
      case 'left':
        return 'left-full top-2 border-t-transparent border-b-transparent border-l-gray-800';
      case 'right':
        return 'right-full top-2 border-t-transparent border-b-transparent border-r-gray-800';
      default:
        return 'bottom-full left-4 border-l-transparent border-r-transparent border-b-gray-800';
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div
          className={`absolute ${getPositionClasses()} z-50 p-3 text-sm rounded-lg shadow-lg pointer-events-none transition-opacity duration-200`}
          style={{
            backgroundColor: '#1f2937',
            color: '#ffffff',
            maxWidth
          }}
          role="tooltip"
        >
          <div className="relative">
            {content}
            {/* Tooltip arrow */}
            <div
              className={`absolute w-0 h-0 ${getArrowClasses()}`}
              style={{
                borderWidth: '6px'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Standard tooltip messages
export const TOOLTIP_MESSAGES = {
  RESET_ACTIVITY: "This will restart the activity and clear your responses. Your user ID will stay the same so your progress across other activities won't be lost."
} as const;