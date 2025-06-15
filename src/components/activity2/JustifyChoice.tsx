import React from 'react';
import { CheckSquare, FileText } from 'lucide-react';
import { Timer } from '../Timer';
import { BackButton } from '../ui';
import { WordCountFeedback } from '../WordCountFeedback';

interface JustifyChoiceProps {
  landingZoneChoice: string;
  evidenceSupport: string;
  onInputChange: (field: string, value: string) => void;
  onContinue: () => void;
  onBack: () => void;
  isValid: boolean;
}

export const JustifyChoice: React.FC<JustifyChoiceProps> = ({
  landingZoneChoice,
  evidenceSupport,
  onInputChange,
  onContinue,
  onBack,
  isValid
}) => {
  const landingZoneOptions = [
    { value: '', label: 'Select your landing zone...' },
    { value: 'mainstream-market', label: 'Mainstream Market' },
    { value: 'low-end-market', label: 'Low-end Market' },
    { value: 'new-overlooked-segments', label: 'New/Overlooked Segments' },
    { value: 'overlap-between-segments', label: 'Overlap Between Segments' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">
          Step 3: Justify Your Strategic Choice (3 minutes)
        </h3>
        <p className="text-gray-700">
          Provide evidence and reasoning for your landing zone selection
        </p>
      </div>

      <div className="border-2 rounded-lg p-5 mb-4" style={{
        background: 'linear-gradient(135deg, #F0FDF4 0%, #22C55E 20%)',
        borderColor: '#22C55E'
      }}>
        <div className="flex items-center mb-3">
          <CheckSquare className="mr-2 text-white" size={24} />
          <h4 className="text-lg font-semibold text-white">Strategic Validation</h4>
        </div>
        <p className="mb-2 text-white">Complete your strategic analysis:</p>
        <ol className="list-decimal list-inside space-y-1 ml-2 text-white">
          <li>Select which landing zone category best describes your choice</li>
          <li>Provide detailed evidence supporting your strategic decision</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Landing Zone Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Which landing zone did you choose?
          </label>
          <select
            value={landingZoneChoice}
            onChange={(e) => onInputChange('landingZoneChoice', e.target.value)}
            className="w-full p-3 border rounded-lg transition-all duration-200 text-gray-900"
            style={{
              borderColor: '#d1d5db',
              backgroundColor: '#FFFFFF'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#FF9000';
              e.target.style.boxShadow = '0 0 0 2px rgba(255, 144, 0, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          >
            {landingZoneOptions.map((option) => (
              <option key={option.value} value={option.value} disabled={option.value === ''}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Evidence Support */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            What evidence supports your choice?
          </label>
          <textarea
            value={evidenceSupport}
            onChange={(e) => onInputChange('evidenceSupport', e.target.value)}
            className="w-full min-h-[150px] p-3 border rounded-lg resize-none transition-all duration-200 text-gray-900"
            style={{
              borderColor: '#d1d5db',
              lineHeight: '1.5'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#FF9000';
              e.target.style.boxShadow = '0 0 0 2px rgba(255, 144, 0, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
            placeholder="e.g. Market research shows that 70% of companies in this segment are underserved by current solutions. Our unique capabilities in predictive analytics directly address their most urgent pain points..."
          />
          <WordCountFeedback text={evidenceSupport} minWords={20} />
        </div>
      </div>

      {/* Landing Zone Descriptions */}
      {landingZoneChoice && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium mb-2 text-blue-900">
            About {landingZoneOptions.find(opt => opt.value === landingZoneChoice)?.label}:
          </h4>
          <p className="text-sm text-blue-800">
            {landingZoneChoice === 'mainstream-market' && 
              'Competing directly in established markets with well-defined customer needs and existing solutions.'}
            {landingZoneChoice === 'low-end-market' && 
              'Targeting price-sensitive customers with simpler, more affordable solutions.'}
            {landingZoneChoice === 'new-overlooked-segments' && 
              'Creating new market categories or serving previously ignored customer segments.'}
            {landingZoneChoice === 'overlap-between-segments' && 
              'Positioning at the intersection of multiple market segments to capture cross-segment value.'}
          </p>
        </div>
      )}

      {/* Validation Status */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium mb-2 text-gray-800">Progress Status:</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${landingZoneChoice.trim().length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm" style={{ color: landingZoneChoice.trim().length > 0 ? '#22C55E' : '#6B7280' }}>
              Landing zone selected
            </span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${evidenceSupport.trim().split(/\s+/).filter(w => w.length > 0).length >= 20 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm" style={{ color: evidenceSupport.trim().split(/\s+/).filter(w => w.length > 0).length >= 20 ? '#22C55E' : '#6B7280' }}>
              Evidence provided (minimum 20 words)
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Timer 
          duration={180} 
          label="Timer: 3 minutes"
          onComplete={() => {}}
        />
        
        <div className="flex flex-col sm:flex-row gap-3">
          <BackButton
            onClick={onBack}
            label="Back to Step 2"
          />
          
          <button
            onClick={onContinue}
            disabled={!isValid}
            className={`px-6 py-2 rounded-lg transition-colors font-medium min-h-[44px] ${
              isValid
                ? 'text-white hover:opacity-90'
                : 'cursor-not-allowed'
            }`}
            style={{
              backgroundColor: isValid ? '#FF9000' : '#d1d5db',
              color: isValid ? '#FFFFFF' : '#6B7280'
            }}
          >
            Continue to Summary
          </button>
        </div>
      </div>
    </div>
  );
};