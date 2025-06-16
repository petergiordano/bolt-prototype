import React, { useMemo } from 'react';
import { ProgressIndicator } from '../ProgressIndicator';

interface StickyHeaderProps {
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps: number;
  userKey?: string;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  title,
  subtitle,
  currentStep,
  totalSteps,
  userKey,
}) => {
  const steps = useMemo(
    () => Array.from({ length: totalSteps }, (_, i) => ({
      number: i + 1,
      label: `Step ${i + 1}`,
    })),
    [totalSteps]
  );

  return (
    <div className="sticky top-0 z-10 p-4 sm:p-6 pb-0">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {title}
            </h1>
            <p className="text-gray-600">
              {subtitle}
            </p>
          </div>
          {userKey && (
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              User ID: {userKey.substring(0, 6)}...
            </div>
          )}
        </div>

        <ProgressIndicator currentStep={currentStep} steps={steps} />
      </div>
    </div>
  );
};