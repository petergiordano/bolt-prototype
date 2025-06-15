import React from 'react';
import { Tooltip, TOOLTIP_MESSAGES } from './Tooltip';

interface ResetButtonProps {
  onClick: () => void;
  variant?: 'icon' | 'full';
  className?: string;
  disabled?: boolean;
}

export const ResetButton: React.FC<ResetButtonProps> = ({
  onClick,
  variant = 'icon',
  className = '',
  disabled = false
}) => {
  if (variant === 'icon') {
    return (
      <Tooltip content={TOOLTIP_MESSAGES.RESET_ACTIVITY} position="bottom">
        <button
          onClick={onClick}
          disabled={disabled}
          className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center transition-all duration-200 group relative ${
            disabled ? 'cursor-not-allowed opacity-50' : ''
          } ${className}`}
          style={{
            backgroundColor: disabled ? '#e5e7eb' : '#f5f5f5',
            color: disabled ? '#9ca3af' : '#8A8A8A'
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.backgroundColor = '#FFE599';
              e.currentTarget.style.color = '#FF9000';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.color = '#8A8A8A';
            }
          }}
          title={TOOLTIP_MESSAGES.RESET_ACTIVITY}
          aria-label="Reset Activity"
        >
          <svg 
            className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={TOOLTIP_MESSAGES.RESET_ACTIVITY} position="top">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-6 py-3 rounded-lg transition-colors font-medium ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        } ${className}`}
        style={{
          backgroundColor: disabled ? '#d1d5db' : '#8A8A8A',
          color: '#FFFFFF'
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = '#666666';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = '#8A8A8A';
          }
        }}
        title={TOOLTIP_MESSAGES.RESET_ACTIVITY}
        aria-describedby="reset-activity-tooltip"
      >
        Reset Activity
      </button>
    </Tooltip>
  );
};