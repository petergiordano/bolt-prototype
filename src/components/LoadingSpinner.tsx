import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-2" style={{
        borderColor: '#FF9000'
      }}></div>
      <p style={{ color: '#8A8A8A' }}>{message}</p>
    </div>
  );
};