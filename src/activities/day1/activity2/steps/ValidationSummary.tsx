import React, { useState } from 'react';
import { CheckCircle, TrendingUp, Users, Search, Copy, ExternalLink } from 'lucide-react';
import { BackButton, ResetButton } from '../../../../components/ui';
import { ProblemValidationData } from '../../../../types/WorkshopData';

interface ValidationSummaryProps {
  activityData: ProblemValidationData;
  onReset: () => void;
  onBack: () => void;
  userKey: string;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  activityData,
  onReset,
  onBack,
  userKey
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(userKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNextActivity = () => {
    alert('Next activity coming soon! Your progress has been saved.');
  };

  const { hypothesisFormation, evidenceGathering } = activityData.stepData;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
          backgroundColor: '#E8F5E8'
        }}>
          <CheckCircle style={{ color: '#22C55E' }} size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: '#666666' }}>
          Problem Validation Complete!
        </h3>
        <p className="max-w-2xl mx-auto" style={{ color: '#8A8A8A' }}>
          You've successfully validated your problem hypothesis with research and evidence. 
          Here's a summary of your validation findings.
        </p>
      </div>

      {/* Problem Hypothesis Section */}
      <div className="border rounded-xl p-6 mb-6" style={{
        background: 'linear-gradient(135deg, #FFE599 0%, #FF9000 20%)',
        borderColor: '#F1C232'
      }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center text-white">
          <TrendingUp className="mr-3" size={24} />
          Problem Hypothesis
        </h4>
        
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#F1C232' }}>
            <h5 className="font-semibold mb-2 text-gray-800">Problem Statement</h5>
            <p className="text-sm leading-relaxed text-gray-700">{hypothesisFormation.problemStatement.response}</p>
          </div>
          
          <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#F1C232' }}>
            <h5 className="font-semibold mb-2 text-gray-800">Target Audience</h5>
            <p className="text-sm leading-relaxed text-gray-700">{hypothesisFormation.targetAudience.response}</p>
          </div>
        </div>
      </div>

      {/* Research Evidence Section */}
      <div className="border rounded-xl p-6 mb-6" style={{
        background: 'linear-gradient(135deg, #E6F3FF 0%, #55BFFA 20%)',
        borderColor: '#55BFFA'
      }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center text-white">
          <Search className="mr-3" size={24} />
          Research Evidence
        </h4>
        
        <div className="space-y-4">
          {/* Research Methods */}
          <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#55BFFA' }}>
            <h5 className="font-semibold mb-3 text-gray-800">Research Methods Used</h5>
            <div className="flex flex-wrap gap-2">
              {evidenceGathering.researchMethods.map((method, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {method.selectedOption}
                </span>
              ))}
            </div>
          </div>
          
          {/* Key Findings */}
          <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#55BFFA' }}>
            <h5 className="font-semibold mb-3 text-gray-800">Key Findings</h5>
            <div className="space-y-3">
              {evidenceGathering.findings.map((finding, index) => (
                <div key={index} className="border-l-4 border-blue-300 pl-4 py-2">
                  <p className="text-sm leading-relaxed text-gray-700">{finding.response}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="border-l-4 p-6 rounded-lg" style={{
        backgroundColor: '#F0FDF4',
        borderColor: '#22C55E'
      }}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <CheckCircle style={{ color: '#22C55E' }} size={20} />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#15803D' }}>Validation Status</h3>
            <p className="leading-relaxed mb-3" style={{ color: '#166534' }}>
              Based on your research methods and findings, you have gathered substantial evidence 
              to validate your problem hypothesis. This foundation will be crucial as you move 
              forward with solution development and customer discovery.
            </p>
            <div className="flex items-center">
              <Users className="mr-2" size={16} style={{ color: '#15803D' }} />
              <span className="text-sm font-medium" style={{ color: '#15803D' }}>
                Research Methods: {evidenceGathering.researchMethods.length} | 
                Key Findings: {evidenceGathering.findings.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Sharing */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold mb-3 flex items-center text-gray-800">
          <Copy className="mr-2" size={18} />
          Continue Your Journey
        </h4>
        <p className="text-sm mb-3 text-gray-700">
          Your unique user key connects all your workshop activities. Keep it safe to access your progress!
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 font-mono text-sm text-gray-800">
            {userKey}
          </div>
          <button
            onClick={handleCopyKey}
            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center font-medium`}
            style={{
              backgroundColor: copied ? '#22C55E' : '#e5e7eb',
              color: copied ? '#FFFFFF' : '#374151'
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.currentTarget.style.backgroundColor = '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
          >
            <Copy size={16} className="mr-1" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <BackButton
          onClick={onBack}
          label="Back to Step 2"
        />
        
        <div className="flex-1"></div>
        
        <ResetButton
          onClick={onReset}
          variant="full"
        />
        
        <button
          onClick={() => window.open('https://github.com/your-repo', '_blank')}
          className="px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center"
          style={{
            backgroundColor: '#55BFFA',
            color: '#FFFFFF'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3B9AE1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#55BFFA';
          }}
        >
          <ExternalLink size={18} className="mr-2" />
          Back to Workshop
        </button>
        
        <button
          onClick={handleNextActivity}
          className="px-8 py-3 rounded-lg transition-colors font-medium flex items-center justify-center"
          style={{
            backgroundColor: '#FF9000',
            color: '#FFFFFF'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E6800A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FF9000';
          }}
        >
          Continue to Next Activity
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};