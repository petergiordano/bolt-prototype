import React from 'react';
import { Edit } from 'lucide-react';
import { WordCountFeedback } from './WordCountFeedback';
import { Timer } from './Timer';

interface IndividualReflectionProps {
  responses: {
    momentOfRealization: string;
    whoExperienced: string;
    whyMatters: string;
  };
  onInputChange: (field: string, value: string) => void;
  onContinue: () => void;
  isValid: boolean;
}

export const IndividualReflection: React.FC<IndividualReflectionProps> = ({
  responses,
  onInputChange,
  onContinue,
  isValid
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2" style={{ color: '#666666' }}>
          Individual Reflection (2 minutes)
        </h3>
        <p style={{ color: '#8A8A8A' }}>
          Take a moment to reflect on the origin of your problem
        </p>
      </div>

      <div className="border-2 rounded-lg p-5 mb-4" style={{
        backgroundColor: '#FFE599',
        borderColor: '#F1C232'
      }}>
        <div className="flex items-center mb-3">
          <Edit className="mr-2" size={24} style={{ color: '#FF9000' }} />
          <h4 className="text-lg font-semibold" style={{ color: '#FF9000' }}>Reflection Prompts</h4>
        </div>
        <p className="mb-2" style={{ color: '#A58E6F' }}>Answer these questions about your problem:</p>
        <ol className="list-decimal list-inside space-y-1 ml-2" style={{ color: '#A58E6F' }}>
          <li>What specific moment made you realize this problem exists?</li>
          <li>Who was experiencing it?</li>
          <li>Why did it matter to them?</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
            What specific moment made you realize this problem exists?
          </label>
          <textarea
            value={responses.momentOfRealization}
            onChange={(e) => onInputChange('momentOfRealization', e.target.value)}
            className="w-full min-h-[150px] p-3 border rounded-lg resize-none transition-all duration-200"
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
            placeholder="e.g. I was watching my elderly neighbor struggle to remember which medications to take when..."
          />
          <WordCountFeedback text={responses.momentOfRealization} minWords={10} />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
            Who was experiencing it?
          </label>
          <textarea
            value={responses.whoExperienced}
            onChange={(e) => onInputChange('whoExperienced', e.target.value)}
            className="w-full min-h-[120px] p-3 border rounded-lg resize-none transition-all duration-200"
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
            placeholder="e.g. Elderly patients living independently, family caregivers..."
          />
          <WordCountFeedback text={responses.whoExperienced} minWords={5} />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
            Why did it matter to them?
          </label>
          <textarea
            value={responses.whyMatters}
            onChange={(e) => onInputChange('whyMatters', e.target.value)}
            className="w-full min-h-[150px] p-3 border rounded-lg resize-none transition-all duration-200"
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
            placeholder="e.g. Taking the wrong medication could lead to serious health complications..."
          />
          <WordCountFeedback text={responses.whyMatters} minWords={10} />
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Timer 
          duration={120} 
          label="Timer: 2 minutes"
          onComplete={() => {}}
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
            color: isValid ? '#FFFFFF' : '#8A8A8A'
          }}
        >
          Continue to Partner Sharing
        </button>
      </div>
    </div>
  );
};