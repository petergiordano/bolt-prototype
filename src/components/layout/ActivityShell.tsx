import React, { ReactNode } from 'react';
import { ProgressIndicator } from '../ProgressIndicator';
import { ResetButton } from '../ui';

interface ActivityShellProps {
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps: number;
  userKey: string;
  children: ReactNode;
  onReset: () => void;
}

export const ActivityShell: React.FC<ActivityShellProps> = ({
  title,
  subtitle,
  currentStep,
  totalSteps,
  userKey,
  children,
  onReset
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => ({
    number: i + 1,
    label: `Step ${i + 1}`
  }));

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #FFE599 0%, #FF9000 100%)'
    }}>
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Activity Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                {title}
              </h1>
              <p className="text-gray-600" style={{ color: '#666666' }}>
                {subtitle}
              </p>
            </div>
            {userKey && (
              <div className="text-sm bg-gray-50 px-3 py-2 rounded-lg" style={{ 
                color: '#8A8A8A',
                backgroundColor: '#f8f9fa'
              }}>
                User ID: {userKey.substring(0, 6)}...
              </div>
            )}
          </div>
          
          <ProgressIndicator currentStep={currentStep} steps={steps} />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 relative">
          {/* Reset Button */}
          <div className="absolute top-4 right-4">
            <ResetButton onClick={onReset} variant="icon" />
          </div>

          {/* Dynamic Content */}
          {children}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-30 rounded-full">
            <div className="w-6 h-6 border-2 border-white border-opacity-60 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};