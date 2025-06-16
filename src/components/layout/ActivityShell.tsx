import React, { ReactNode } from 'react';
import { StickyHeader } from './StickyHeader';
import { ResetButton } from '../ui';

interface ActivityShellProps {
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps: number;
  userKey?: string;
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
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #FFE599 0%, #FF9000 100%)'
    }}>
      <div className="max-w-5xl mx-auto">
        <StickyHeader
          title={title}
          subtitle={subtitle}
          currentStep={currentStep}
          totalSteps={totalSteps}
          userKey={userKey}
        />

        {/* Main Content Card */}
        <div className="p-4 sm:p-6 pt-0">
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
    </div>
  );
};