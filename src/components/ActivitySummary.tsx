import React, { useState } from 'react';
import { CheckCircle, Download, Copy, ExternalLink } from 'lucide-react';

interface ActivitySummaryProps {
  responses: {
    momentOfRealization: string;
    whoExperienced: string;
    whyMatters: string;
    whatSurprised: string;
    howRealProblem: string;
  };
  onReset: () => void;
  userKey: string;
}

export const ActivitySummary: React.FC<ActivitySummaryProps> = ({
  responses,
  onReset,
  userKey
}) => {
  const [copied, setCopied] = useState(false);
  const [showResetTooltip, setShowResetTooltip] = useState(false);

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
    // Navigate to next activity (placeholder for now)
    alert('Next activity coming soon! Your progress has been saved.');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
          backgroundColor: '#E8F5E8'
        }}>
          <CheckCircle style={{ color: '#22C55E' }} size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: '#666666' }}>
          Activity Complete!
        </h3>
        <p className="max-w-2xl mx-auto" style={{ color: '#8A8A8A' }}>
          You've successfully mapped your problem origin story. Here's a summary of your insights 
          that will help guide your product development journey.
        </p>
      </div>

      {/* Problem Discovery Section */}
      <div className="border rounded-xl p-6 mb-6" style={{
        background: 'linear-gradient(135deg, #FFE599 0%, #FF9000 20%)',
        borderColor: '#F1C232'
      }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center" style={{ color: '#A58E6F' }}>
          <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#FF9000' }}></div>
          Problem Discovery
        </h4>
        
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#F1C232' }}>
            <h5 className="font-medium mb-2" style={{ color: '#A58E6F' }}>Moment of Realization</h5>
            <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>{responses.momentOfRealization}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#F1C232' }}>
              <h5 className="font-medium mb-2" style={{ color: '#A58E6F' }}>Who Experienced It</h5>
              <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>{responses.whoExperienced}</p>
            </div>
            
            <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#F1C232' }}>
              <h5 className="font-medium mb-2" style={{ color: '#A58E6F' }}>Why It Mattered</h5>
              <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>{responses.whyMatters}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Validation Section */}
      <div className="border rounded-xl p-6 mb-6" style={{
        background: 'linear-gradient(135deg, #E6F3FF 0%, #55BFFA 20%)',
        borderColor: '#55BFFA'
      }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center" style={{ color: '#6E9FBA' }}>
          <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#55BFFA' }}></div>
          Problem Validation
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#55BFFA' }}>
            <h5 className="font-medium mb-2" style={{ color: '#6E9FBA' }}>What Surprised You</h5>
            <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>{responses.whatSurprised}</p>
          </div>
          
          <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#55BFFA' }}>
            <h5 className="font-medium mb-2" style={{ color: '#6E9FBA' }}>How You Know It's Real</h5>
            <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>{responses.howRealProblem}</p>
          </div>
        </div>
      </div>

      {/* Key Takeaway */}
      <div className="border-l-4 p-6 rounded-lg" style={{
        backgroundColor: '#F0FDF4',
        borderColor: '#22C55E'
      }}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <CheckCircle style={{ color: '#22C55E' }} size={20} />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#15803D' }}>Key Takeaway</h3>
            <p className="leading-relaxed" style={{ color: '#166534' }}>
              Great products start with well-understood problems. By documenting your problem origin story, 
              you've taken an important step toward ensuring you're building something people truly need. 
              Use these insights to guide your next steps in the product development process.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Sharing */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium mb-3 flex items-center" style={{ color: '#666666' }}>
          <Download className="mr-2" size={18} />
          Save Your Progress
        </h4>
        <p className="text-sm mb-3" style={{ color: '#8A8A8A' }}>
          Your unique user key allows you to continue with the next activities. Keep it safe!
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 font-mono text-sm">
            {userKey}
          </div>
          <button
            onClick={handleCopyKey}
            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center font-medium`}
            style={{
              backgroundColor: copied ? '#22C55E' : '#e5e7eb',
              color: copied ? '#FFFFFF' : '#666666'
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
        <div className="relative">
          <button
            onClick={onReset}
            className="px-6 py-3 rounded-lg transition-colors font-medium"
            style={{
              backgroundColor: '#8A8A8A',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#666666';
              setShowResetTooltip(true);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8A8A8A';
              setShowResetTooltip(false);
            }}
            title="Reset Activity - This will restart the activity and clear your responses. Your user ID will stay the same so your progress across other activities won't be lost."
            aria-describedby="reset-activity-tooltip"
          >
            Reset Activity
          </button>
          
          {/* Custom Tooltip */}
          {showResetTooltip && (
            <div
              id="reset-activity-tooltip"
              className="absolute bottom-full left-0 mb-2 w-64 p-3 text-sm rounded-lg shadow-lg z-10 pointer-events-none"
              style={{
                backgroundColor: '#1f2937',
                color: '#ffffff'
              }}
            >
              <div className="relative">
                This will restart the activity and clear your responses. Your user ID will stay the same so your progress across other activities won't be lost.
                {/* Tooltip arrow */}
                <div
                  className="absolute top-full left-4 w-0 h-0"
                  style={{
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #1f2937'
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1"></div>
        
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