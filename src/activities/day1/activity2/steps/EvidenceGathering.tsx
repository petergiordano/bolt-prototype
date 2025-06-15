import React, { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { WordCountFeedback } from '../../../../components/WordCountFeedback';
import { Timer } from '../../../../components/Timer';
import { BackButton } from '../../../../components/ui';
import { TextResponseStep, MultipleChoiceStep } from '../../../../types/WorkshopData';

interface EvidenceGatheringProps {
  stepData: {
    researchMethods: MultipleChoiceStep[];
    findings: TextResponseStep[];
  };
  onUpdateField: (field: string, value: any) => void;
  onContinue: () => void;
  onBack: () => void;
  isValid: boolean;
}

const RESEARCH_METHODS = [
  'Customer interviews',
  'Surveys',
  'Market research',
  'Competitor analysis',
  'User observation',
  'Focus groups',
  'Online forums/communities',
  'Industry reports',
  'Other'
];

export const EvidenceGathering: React.FC<EvidenceGatheringProps> = ({
  stepData,
  onUpdateField,
  onContinue,
  onBack,
  isValid
}) => {
  const [newFinding, setNewFinding] = useState('');

  const handleMethodToggle = (method: string) => {
    const currentMethods = stepData.researchMethods || [];
    const existingIndex = currentMethods.findIndex(m => m.selectedOption === method);
    
    if (existingIndex >= 0) {
      // Remove method
      const updatedMethods = currentMethods.filter((_, index) => index !== existingIndex);
      onUpdateField('researchMethods', updatedMethods);
    } else {
      // Add method
      const newMethod: MultipleChoiceStep = {
        selectedOption: method,
        isValid: true,
        lastModified: new Date().toISOString()
      };
      onUpdateField('researchMethods', [...currentMethods, newMethod]);
    }
  };

  const addFinding = () => {
    if (newFinding.trim()) {
      const currentFindings = stepData.findings || [];
      const newFindingObj: TextResponseStep = {
        response: newFinding.trim(),
        wordCount: newFinding.trim().split(/\s+/).length,
        isValid: newFinding.trim().split(/\s+/).length >= 10,
        lastModified: new Date().toISOString()
      };
      
      onUpdateField('findings', [...currentFindings, newFindingObj]);
      setNewFinding('');
    }
  };

  const removeFinding = (index: number) => {
    const currentFindings = stepData.findings || [];
    const updatedFindings = currentFindings.filter((_, i) => i !== index);
    onUpdateField('findings', updatedFindings);
  };

  const isMethodSelected = (method: string) => {
    return stepData.researchMethods?.some(m => m.selectedOption === method) || false;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2" style={{ color: '#666666' }}>
          Evidence Gathering (7 minutes)
        </h3>
        <p style={{ color: '#8A8A8A' }}>
          Document your research methods and key findings
        </p>
      </div>

      <div className="border-2 rounded-lg p-5 mb-4" style={{
        background: 'linear-gradient(135deg, #E6F3FF 0%, #55BFFA 20%)',
        borderColor: '#55BFFA'
      }}>
        <div className="flex items-center mb-3">
          <Search className="mr-2" size={24} style={{ color: '#FFFFFF' }} />
          <h4 className="text-lg font-semibold text-white">Research & Validation</h4>
        </div>
        <p className="mb-2 text-white">Gather evidence to support or refute your hypothesis:</p>
        <ol className="list-decimal list-inside space-y-1 ml-2 text-white">
          <li>What research methods did you use?</li>
          <li>What key findings emerged from your research?</li>
        </ol>
      </div>

      <div className="space-y-6">
        {/* Research Methods */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: '#666666' }}>
            Research Methods Used *
          </label>
          <p className="text-sm mb-4" style={{ color: '#8A8A8A' }}>
            Select all methods you used to validate your problem hypothesis
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RESEARCH_METHODS.map((method) => (
              <button
                key={method}
                onClick={() => handleMethodToggle(method)}
                className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                  isMethodSelected(method)
                    ? 'border-orange-500 bg-orange-50 text-orange-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                    isMethodSelected(method)
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-300'
                  }`}>
                    {isMethodSelected(method) && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">{method}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Key Findings */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: '#666666' }}>
            Key Findings *
          </label>
          <p className="text-sm mb-4" style={{ color: '#8A8A8A' }}>
            Document the most important insights from your research
          </p>

          {/* Add New Finding */}
          <div className="mb-4">
            <div className="flex gap-2">
              <textarea
                value={newFinding}
                onChange={(e) => setNewFinding(e.target.value)}
                className="flex-1 min-h-[100px] p-3 border rounded-lg resize-none transition-all duration-200"
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
                placeholder="e.g. 73% of survey respondents reported medication errors in the past year..."
              />
              <button
                onClick={addFinding}
                disabled={!newFinding.trim()}
                className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center ${
                  newFinding.trim()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Plus size={16} className="mr-1" />
                Add
              </button>
            </div>
            <WordCountFeedback text={newFinding} minWords={10} />
          </div>

          {/* Existing Findings */}
          {stepData.findings && stepData.findings.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-medium" style={{ color: '#666666' }}>
                Your Findings ({stepData.findings.length})
              </h5>
              {stepData.findings.map((finding, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 mb-2">{finding.response}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{finding.wordCount} words</span>
                        {finding.isValid && (
                          <span className="ml-2 text-green-600">✓ Valid</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFinding(index)}
                      className="ml-3 p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Timer 
          duration={420} 
          label="Timer: 7 minutes"
          onComplete={() => {}}
        />
        
        <div className="flex flex-col sm:flex-row gap-3">
          <BackButton
            onClick={onBack}
            label="Back to Step 1"
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
            Continue to Summary
          </button>
        </div>
      </div>
    </div>
  );
};