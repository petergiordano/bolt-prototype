import React, { useState } from 'react';
import { MapPin, Target } from 'lucide-react';
import { Timer } from '../Timer';
import { BackButton } from '../ui';
import { WordCountFeedback } from '../WordCountFeedback';
import { MarkerData } from '../../activities/day1/activity2/ProblemValidation';

interface IdentifyEntryPointProps {
  competitorMarkers: MarkerData[];
  underservedMarkers: MarkerData[];
  strategicMarker: MarkerData | null;
  strategicJustification: string;
  onMarkersChange: (field: string, value: any) => void;
  onInputChange: (field: string, value: string) => void;
  onContinue: () => void;
  onBack: () => void;
  isValid: boolean;
}

export const IdentifyEntryPoint: React.FC<IdentifyEntryPointProps> = ({
  competitorMarkers,
  underservedMarkers,
  strategicMarker,
  strategicJustification,
  onMarkersChange,
  onInputChange,
  onContinue,
  onBack,
  isValid
}) => {
  const [showJustificationModal, setShowJustificationModal] = useState(false);

  const handleGridClick = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const newStrategicMarker: MarkerData = {
      id: `strategic-${Date.now()}`,
      type: 'strategic',
      x,
      y,
      label: 'Strategic Entry Point'
    };

    onMarkersChange('strategicMarker', newStrategicMarker);
    setShowJustificationModal(true);
  };

  const handleStrategicMarkerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowJustificationModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">
          Step 2: Identify Your Strategic Entry Point (4 minutes)
        </h3>
        <p className="text-gray-700">
          Place your strategic marker and justify your landing zone choice
        </p>
      </div>

      <div className="border-2 rounded-lg p-5 mb-4" style={{
        background: 'linear-gradient(135deg, #E6F3FF 0%, #55BFFA 20%)',
        borderColor: '#55BFFA'
      }}>
        <div className="flex items-center mb-3">
          <MapPin className="mr-2 text-white" size={24} />
          <h4 className="text-lg font-semibold text-white">Strategic Positioning</h4>
        </div>
        <p className="mb-2 text-white">Based on your market landscape:</p>
        <ol className="list-decimal list-inside space-y-1 ml-2 text-white">
          <li>Click to place your strategic entry point marker</li>
          <li>Explain why this is the best landing zone for your solution</li>
        </ol>
      </div>

      {/* Interactive Grid with Previous Markers */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#DC2626' }}></div>
              <span className="text-sm font-medium text-gray-800">
                Competitors ({competitorMarkers.length})
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#2563EB' }}></div>
              <span className="text-sm font-medium text-gray-800">
                Underserved ({underservedMarkers.length})
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#22C55E' }}></div>
              <span className="text-sm font-medium text-gray-800">
                Strategic Entry ({strategicMarker ? 1 : 0})
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <svg
            width="100%"
            height="400"
            className="border border-gray-200 rounded cursor-crosshair"
            style={{ backgroundColor: '#f8f9fa' }}
            onClick={handleGridClick}
          >
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Zone divider */}
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#9ca3af" strokeWidth="2" strokeDasharray="5,5" />
            
            {/* Zone labels */}
            <text x="25%" y="30" textAnchor="middle" className="text-sm font-medium" fill="#374151">
              Competitor Focus Zone
            </text>
            <text x="75%" y="30" textAnchor="middle" className="text-sm font-medium" fill="#374151">
              Underserved Segments Zone
            </text>
            
            {/* Competitor markers (read-only) */}
            {competitorMarkers.map((marker) => (
              <g key={marker.id}>
                <circle
                  cx={`${marker.x}%`}
                  cy={`${marker.y}%`}
                  r="6"
                  fill="#DC2626"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  opacity="0.7"
                />
                {marker.label && (
                  <text
                    x={`${marker.x}%`}
                    y={`${marker.y + 6}%`}
                    textAnchor="middle"
                    className="text-xs pointer-events-none"
                    fill="#374151"
                    opacity="0.7"
                  >
                    {marker.label.length > 12 ? `${marker.label.substring(0, 12)}...` : marker.label}
                  </text>
                )}
              </g>
            ))}
            
            {/* Underserved markers (read-only) */}
            {underservedMarkers.map((marker) => (
              <g key={marker.id}>
                <circle
                  cx={`${marker.x}%`}
                  cy={`${marker.y}%`}
                  r="6"
                  fill="#2563EB"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  opacity="0.7"
                />
                {marker.label && (
                  <text
                    x={`${marker.x}%`}
                    y={`${marker.y + 6}%`}
                    textAnchor="middle"
                    className="text-xs pointer-events-none"
                    fill="#374151"
                    opacity="0.7"
                  >
                    {marker.label.length > 12 ? `${marker.label.substring(0, 12)}...` : marker.label}
                  </text>
                )}
              </g>
            ))}
            
            {/* Strategic marker */}
            {strategicMarker && (
              <g>
                <circle
                  cx={`${strategicMarker.x}%`}
                  cy={`${strategicMarker.y}%`}
                  r="10"
                  fill="#22C55E"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  className="cursor-pointer hover:opacity-80"
                  onClick={handleStrategicMarkerClick}
                />
                <text
                  x={`${strategicMarker.x}%`}
                  y={`${strategicMarker.y + 4}%`}
                  textAnchor="middle"
                  className="text-xs font-bold pointer-events-none"
                  fill="#FFFFFF"
                >
                  ★
                </text>
                <text
                  x={`${strategicMarker.x}%`}
                  y={`${strategicMarker.y + 15}%`}
                  textAnchor="middle"
                  className="text-xs font-medium pointer-events-none"
                  fill="#374151"
                >
                  Strategic Entry
                </text>
              </g>
            )}
          </svg>
        </div>

        <div className="mt-4 text-sm text-gray-700">
          <p>Click anywhere on the grid to place your strategic entry point marker. Click the marker to edit your justification.</p>
        </div>
      </div>

      {/* Strategic Justification */}
      {strategicMarker && (
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Why is this the best landing zone for your solution?
          </label>
          <textarea
            value={strategicJustification}
            onChange={(e) => onInputChange('strategicJustification', e.target.value)}
            className="w-full min-h-[120px] p-3 border rounded-lg resize-none transition-all duration-200 text-gray-900"
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
            placeholder="e.g. This position allows us to avoid direct competition while addressing a clear market gap..."
          />
          <WordCountFeedback text={strategicJustification} minWords={5} />
        </div>
      )}

      {/* Validation Status */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium mb-2 text-gray-800">Progress Status:</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${strategicMarker ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm" style={{ color: strategicMarker ? '#22C55E' : '#6B7280' }}>
              Strategic entry point placed
            </span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${strategicJustification.trim().length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm" style={{ color: strategicJustification.trim().length > 0 ? '#22C55E' : '#6B7280' }}>
              Strategic justification provided
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Timer 
          duration={240} 
          label="Timer: 4 minutes"
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
              color: isValid ? '#FFFFFF' : '#6B7280'
            }}
          >
            Continue to Justification
          </button>
        </div>
      </div>

      {/* Justification Modal */}
      {showJustificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Strategic Entry Point Justification
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-800">
                Why is this the best landing zone for your solution?
              </label>
              <textarea
                value={strategicJustification}
                onChange={(e) => onInputChange('strategicJustification', e.target.value)}
                className="w-full min-h-[120px] p-3 border rounded-lg resize-none text-gray-900"
                style={{ borderColor: '#d1d5db' }}
                placeholder="Explain your strategic reasoning..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowJustificationModal(false)}
                className="flex-1 px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: '#FF9000' }}
              >
                Save
              </button>
              <button
                onClick={() => setShowJustificationModal(false)}
                className="px-4 py-2 rounded-lg font-medium text-gray-800"
                style={{ backgroundColor: '#e5e7eb' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};