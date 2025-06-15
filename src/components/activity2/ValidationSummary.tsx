import React, { useState } from 'react';
import { CheckCircle, Download, Copy, ExternalLink, Target } from 'lucide-react';
import { BackButton, ResetButton } from '../ui';
import { MarkerData } from '../../activities/day1/activity2/ProblemValidation';

interface ValidationSummaryProps {
  responses: {
    competitorMarkers: MarkerData[];
    underservedMarkers: MarkerData[];
    strategicMarker: MarkerData | null;
    strategicJustification: string;
    landingZoneChoice: string;
    evidenceSupport: string;
  };
  onReset: () => void;
  onBack: () => void;
  userKey: string;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  responses,
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
    // Navigate to next activity (placeholder for now)
    alert('Next activity coming soon! Your progress has been saved.');
  };

  const getLandingZoneLabel = (value: string) => {
    const options = {
      'mainstream-market': 'Mainstream Market',
      'low-end-market': 'Low-end Market',
      'new-overlooked-segments': 'New/Overlooked Segments',
      'overlap-between-segments': 'Overlap Between Segments'
    };
    return options[value as keyof typeof options] || value;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
          backgroundColor: '#E8F5E8'
        }}>
          <CheckCircle style={{ color: '#22C55E' }} size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-gray-800">
          Market Analysis Complete!
        </h3>
        <p className="max-w-2xl mx-auto text-gray-700">
          You've successfully mapped your market landscape and identified your strategic entry point. 
          Here's a summary of your market positioning analysis.
        </p>
      </div>

      {/* Market Landscape Visualization */}
      <div className="border rounded-xl p-6 mb-6" style={{
        background: 'linear-gradient(135deg, #FFE599 0%, #FF9000 20%)',
        borderColor: '#F1C232'
      }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center text-white">
          <Target className="mr-2" size={20} />
          Market Landscape Analysis
        </h4>
        
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="relative">
            <svg
              width="100%"
              height="300"
              className="border border-gray-200 rounded"
              style={{ backgroundColor: '#f8f9fa' }}
            >
              {/* Grid lines */}
              <defs>
                <pattern id="summary-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#summary-grid)" />
              
              {/* Zone divider */}
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#9ca3af" strokeWidth="2" strokeDasharray="5,5" />
              
              {/* Zone labels */}
              <text x="25%" y="25" textAnchor="middle" className="text-sm font-medium" fill="#374151">
                Competitors
              </text>
              <text x="75%" y="25" textAnchor="middle" className="text-sm font-medium" fill="#374151">
                Underserved Segments
              </text>
              
              {/* Competitor markers */}
              {responses.competitorMarkers.map((marker) => (
                <g key={marker.id}>
                  <circle
                    cx={`${marker.x}%`}
                    cy={`${marker.y}%`}
                    r="6"
                    fill="#DC2626"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  {marker.label && (
                    <text
                      x={`${marker.x}%`}
                      y={`${marker.y + 8}%`}
                      textAnchor="middle"
                      className="text-xs font-medium"
                      fill="#374151"
                    >
                      {marker.label.length > 12 ? `${marker.label.substring(0, 12)}...` : marker.label}
                    </text>
                  )}
                </g>
              ))}
              
              {/* Underserved markers */}
              {responses.underservedMarkers.map((marker) => (
                <g key={marker.id}>
                  <circle
                    cx={`${marker.x}%`}
                    cy={`${marker.y}%`}
                    r="6"
                    fill="#2563EB"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  {marker.label && (
                    <text
                      x={`${marker.x}%`}
                      y={`${marker.y + 8}%`}
                      textAnchor="middle"
                      className="text-xs font-medium"
                      fill="#374151"
                    >
                      {marker.label.length > 12 ? `${marker.label.substring(0, 12)}...` : marker.label}
                    </text>
                  )}
                </g>
              ))}
              
              {/* Strategic marker */}
              {responses.strategicMarker && (
                <g>
                  <circle
                    cx={`${responses.strategicMarker.x}%`}
                    cy={`${responses.strategicMarker.y}%`}
                    r="10"
                    fill="#22C55E"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                  />
                  <text
                    x={`${responses.strategicMarker.x}%`}
                    y={`${responses.strategicMarker.y + 4}%`}
                    textAnchor="middle"
                    className="text-xs font-bold"
                    fill="#FFFFFF"
                  >
                    ★
                  </text>
                  <text
                    x={`${responses.strategicMarker.x}%`}
                    y={`${responses.strategicMarker.y + 18}%`}
                    textAnchor="middle"
                    className="text-xs font-medium"
                    fill="#374151"
                  >
                    Strategic Entry
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-white">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <h5 className="font-semibold mb-1">Competitors</h5>
            <p className="text-sm">{responses.competitorMarkers.length} markers placed</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <h5 className="font-semibold mb-1">Underserved Segments</h5>
            <p className="text-sm">{responses.underservedMarkers.length} markers placed</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <h5 className="font-semibold mb-1">Strategic Entry</h5>
            <p className="text-sm">{responses.strategicMarker ? '1 marker placed' : 'Not placed'}</p>
          </div>
        </div>
      </div>

      {/* Strategic Analysis Section */}
      <div className="border rounded-xl p-6 mb-6" style={{
        background: 'linear-gradient(135deg, #E6F3FF 0%, #55BFFA 20%)',
        borderColor: '#55BFFA'
      }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center text-white">
          <div className="w-2 h-2 rounded-full mr-3 bg-white"></div>
          Strategic Analysis
        </h4>
        
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#55BFFA' }}>
            <h5 className="font-semibold mb-2 text-gray-800">Strategic Entry Point Justification</h5>
            <p className="text-sm leading-relaxed text-gray-700">{responses.strategicJustification}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#55BFFA' }}>
              <h5 className="font-semibold mb-2 text-gray-800">Landing Zone Choice</h5>
              <p className="text-sm leading-relaxed text-gray-700">{getLandingZoneLabel(responses.landingZoneChoice)}</p>
            </div>
            
            <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#55BFFA' }}>
              <h5 className="font-semibold mb-2 text-gray-800">Supporting Evidence</h5>
              <p className="text-sm leading-relaxed text-gray-700">{responses.evidenceSupport}</p>
            </div>
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
            <h3 className="text-lg font-semibold mb-2 text-green-800">Key Takeaway</h3>
            <p className="leading-relaxed text-green-700">
              You've successfully mapped your competitive landscape and identified your strategic market entry point. 
              This analysis provides a clear foundation for positioning your solution and avoiding direct competition 
              while maximizing market opportunity. Use these insights to guide your go-to-market strategy.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Sharing */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold mb-3 flex items-center text-gray-800">
          <Download className="mr-2" size={18} />
          Save Your Progress
        </h4>
        <p className="text-sm mb-3 text-gray-700">
          Your unique user key allows you to continue with the next activities. Keep it safe!
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
          label="Back to Step 3"
        />
        
        <div className="flex-1"></div>
        
        <ResetButton
          onClick={onReset}
          variant="full"
        />
        
        <button
          onClick={() => window.open('https://github.com/your-repo', '_blank')}
          className="px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center text-white"
          style={{
            backgroundColor: '#55BFFA'
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
          className="px-8 py-3 rounded-lg transition-colors font-medium flex items-center justify-center text-white"
          style={{
            backgroundColor: '#FF9000'
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