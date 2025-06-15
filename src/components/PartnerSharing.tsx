import React from 'react';
import { Share, ArrowLeft } from 'lucide-react';
import { WordCountFeedback } from './WordCountFeedback';
import { Timer } from './Timer';

interface PartnerSharingProps {
  responses: {
    momentOfRealization: string;
    whoExperienced: string;
    whyMatters: string;
    whatSurprised: string;
    howRealProblem: string;
  };
  onInputChange: (field: string, value: string) => void;
  onContinue: () => void;
  onBack: () => void;
  isValid: boolean;
}

export const PartnerSharing: React.FC<PartnerSharingProps> = ({
  responses,
  onInputChange,
  onContinue,
  onBack,
  isValid
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2" style={{ color: '#666666' }}>
          Partner Sharing (3 minutes)
        </h3>
        <p style={{ color: '#8A8A8A' }}>
          Share your reflections with a partner
        </p>
      </div>

      <div className="border-2 rounded-lg p-5 mb-4" style={{
        backgroundColor: '#E6F3FF',
        borderColor: '#55BFFA'
      }}>
        <div className="flex items-center mb-3">
          <Share className="mr-2" size={24} style={{ color: '#55BFFA' }} />
          <h4 className="text-lg font-semibold" style={{ color: '#55BFFA' }}>Sharing Prompts</h4>
        </div>
        <p className="mb-2" style={{ color: '#6E9FBA' }}>Discuss these questions with your partner (90 seconds each):</p>
        <ol className="list-decimal list-inside space-y-1 ml-2" style={{ color: '#6E9FBA' }}>
          <li>What surprised you about the problem?</li>
          <li>How do you know it's real?</li>
        </ol>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium mb-3" style={{ color: '#666666' }}>Your Problem Summary:</h4>
        <div className="bg-white border border-gray-300 rounded-lg p-4 space-y-3">
          <p className="text-sm" style={{ color: '#8A8A8A' }}>
            <span className="font-semibold" style={{ color: '#666666' }}>Moment of realization:</span> {responses.momentOfRealization}
          </p>
          <p className="text-sm" style={{ color: '#8A8A8A' }}>
            <span className="font-semibold" style={{ color: '#666666' }}>Who experienced it:</span> {responses.whoExperienced}
          </p>
          <p className="text-sm" style={{ color: '#8A8A8A' }}>
            <span className="font-semibold" style={{ color: '#666666' }}>Why it mattered:</span> {responses.whyMatters}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
            What surprised you about the problem?
          </label>
          <textarea
            value={responses.whatSurprised}
            onChange={(e) => onInputChange('whatSurprised', e.target.value)}
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
            placeholder="e.g. I was surprised to learn that 60% of medication errors happen at home..."
          />
          <WordCountFeedback text={responses.whatSurprised} minWords={10} />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
            How do you know it's real?
          </label>
          <textarea
            value={responses.howRealProblem}
            onChange={(e) => onInputChange('howRealProblem', e.target.value)}
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
            placeholder="e.g. Studies show that medication non-adherence leads to 125,000 deaths annually..."
          />
          <WordCountFeedback text={responses.howRealProblem} minWords={10} />
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Timer 
          duration={180} 
          label="Timer: 3 minutes"
          onComplete={() => {}}
        />
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2 rounded-lg transition-colors font-medium min-h-[44px] flex items-center justify-center"
            style={{
              backgroundColor: '#8A8A8A',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#666666';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8A8A8A';
            }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Step 1
          </button>
          
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
            Continue to Summary
          </button>
        </div>
      </div>
    </div>
  );
};