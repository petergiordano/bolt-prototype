import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
  disabled?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label,
  className = '',
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center min-h-[44px] ${
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
    >
      <ArrowLeft size={18} className="mr-2" />
      {label}
    </button>
  );
};