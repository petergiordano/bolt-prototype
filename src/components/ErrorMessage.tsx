import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry 
}) => {
  return (
    <div className="border-2 rounded-lg p-4" style={{
      backgroundColor: '#FEF2F2',
      borderColor: '#FECACA'
    }}>
      <div className="flex items-center mb-2">
        <AlertCircle className="mr-2" size={20} style={{ color: '#DC2626' }} />
        <h3 className="text-lg font-semibold" style={{ color: '#991B1B' }}>Error</h3>
      </div>
      <p className="mb-3" style={{ color: '#B91C1C' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded transition-colors"
          style={{
            backgroundColor: '#DC2626',
            color: '#FFFFFF'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#B91C1C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#DC2626';
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};