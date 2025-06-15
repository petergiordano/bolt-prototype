import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  steps: Array<{
    number: number;
    label: string;
  }>;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  steps 
}) => {
  return (
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className={`flex items-center space-x-2`} style={{
            color: currentStep >= step.number ? '#FF9000' : '#8A8A8A'
          }}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold`} style={{
              backgroundColor: currentStep >= step.number ? '#FF9000' : '#e5e7eb',
              color: currentStep >= step.number ? '#FFFFFF' : '#8A8A8A'
            }}>
              {step.number}
            </div>
            <span className="font-semibold">{step.label}</span>
          </div>
          
          {index < steps.length - 1 && (
            <div className="flex-1 h-1 bg-gray-200 rounded">
              <div className={`h-full rounded transition-all duration-300`} style={{
                backgroundColor: '#FF9000',
                width: currentStep > step.number ? '100%' : '0%'
              }}></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};