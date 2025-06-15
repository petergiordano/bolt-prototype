import React from 'react';
import { Lightbulb } from 'lucide-react';
import { WordCountFeedback, getWordCount } from '../../../../components/WordCountFeedback';
import { Timer } from '../../../../components/Timer';
import { TextResponseStep } from '../../../../types/WorkshopData';

interface HypothesisFormationProps {
  stepData: {
    problemStatement: TextResponseStep;
    targetAudience: TextResponseStep;
    assumptions: TextResponseStep[];
  };
  onUpdateField: (field: string, value: string) => void;
  onContinue: () => void;
  isValid: boolean;
}

export const HypothesisFormation: React.FC<HypothesisFormationProps> = ({
  stepData,
  onUpdateField,
  onContinue,
  isValid
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2" style={{ color: '#666666' }}>
          Hypothesis Formation (5 minutes)
        </h3>
        <p style={{ color: '#8A8A8A' }}>
          Define your problem hypothesis clearly and identify your target audience
        </p>
      </div>

      <div className="border-2 rounded-lg p-5 mb-4" style={{
        background: 'linear-gradient(135deg, #FFE599 0%, #FF9000 20%)',
        borderColor: '#F1C232'
      }}>
        <div className="flex items-center mb-3">
          <Lightbulb className="mr-2" size={24} style={{ color: '#FFFFFF' }} />
          <h4 className="text-lg font-semibold text-white">Hypothesis Framework</h4>
        </div>
        <p className="mb-2 text-white">Create a testable problem statement:</p>
        <ol className="list-decimal list-inside space-y-1 ml-2 text-white">
          <li>What specific problem are you solving?</li>
          <li>Who experiences this problem most acutely?</li>
          <li>What assumptions are you making?</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
            Problem Statement *
          </label>
          <p className="text-sm mb-2" style={{ color: '#8A8A8A' }}>
            Write a clear, specific statement of the problem you're solving
          </p>
          <textarea
            value={stepData.problemStatement.response}
            onChange={(e) => onUpdateField('problemStatement', e.target.value)}
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
            placeholder="e.g. Elderly patients struggle to manage complex medication schedules, leading to dangerous errors and health complications..."
          />
          <WordCountFeedback text={stepData.problemStatement.response} minWords={10} />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
            Target Audience *
          </label>
          <p className="text-sm mb-2" style={{ color: '#8A8A8A' }}>
            Describe who experiences this problem most intensely
          </p>
          <textarea
            value={stepData.targetAudience.response}
            onChange={(e) => onUpdateField('targetAudience', e.target.value)}
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
            placeholder="e.g. Adults aged 65+ living independently, managing 3+ daily medications, with limited tech experience..."
          />
          <WordCountFeedback text={stepData.targetAudience.response} minWords={10} />
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Timer 
          duration={300} 
          label="Timer: 5 minutes"
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
          Continue to Evidence Gathering
        </button>
      </div>
    </div>
  );
};