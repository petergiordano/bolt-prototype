import React, { useState } from 'react';
import { Target, Trash2 } from 'lucide-react';
import { Timer } from '../Timer';
import { MarkerData } from '../../activities/day1/activity2/ProblemValidation';

interface MapMarketLandscapeProps {
  competitorMarkers: MarkerData[];
  underservedMarkers: MarkerData[];
  onMarkersChange: (field: string, value: any) => void;
  onContinue: () => void;
  isValid: boolean;
}

export const MapMarketLandscape: React.FC<MapMarketLandscapeProps> = ({
  competitorMarkers,
  underservedMarkers,
  onMarkersChange,
  onContinue,
  isValid
}) => {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [showLabelModal, setShowLabelModal] = useState(false);

  const handleGridClick = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Determine marker type based on click position within Venn diagram zones
    let markerType: 'competitor' | 'underserved' = 'competitor';
    
    // Simple zone detection - can be refined based on actual circle overlaps
    if (x > 60) {
      markerType = 'underserved';
    }

    const newMarker: MarkerData = {
      id: `${markerType}-${Date.now()}`,
      type: markerType,
      x,
      y,
      label: ''
    };

    if (markerType === 'competitor') {
      onMarkersChange('competitorMarkers', [...competitorMarkers, newMarker]);
    } else {
      onMarkersChange('underservedMarkers', [...underservedMarkers, newMarker]);
    }

    setSelectedMarker(newMarker);
    setEditingLabel('');
    setShowLabelModal(true);
  };

  const handleMarkerClick = (marker: MarkerData, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedMarker(marker);
    setEditingLabel(marker.label);
    setShowLabelModal(true);
  };

  const handleSaveLabel = () => {
    if (selectedMarker) {
      const updatedMarker = { ...selectedMarker, label: editingLabel };
      
      if (selectedMarker.type === 'competitor') {
        const updatedMarkers = competitorMarkers.map(m => 
          m.id === selectedMarker.id ? updatedMarker : m
        );
        onMarkersChange('competitorMarkers', updatedMarkers);
      } else {
        const updatedMarkers = underservedMarkers.map(m => 
          m.id === selectedMarker.id ? updatedMarker : m
        );
        onMarkersChange('underservedMarkers', updatedMarkers);
      }
    }
    setShowLabelModal(false);
    setSelectedMarker(null);
  };

  const handleDeleteMarker = () => {
    if (selectedMarker) {
      if (selectedMarker.type === 'competitor') {
        const updatedMarkers = competitorMarkers.filter(m => m.id !== selectedMarker.id);
        onMarkersChange('competitorMarkers', updatedMarkers);
      } else {
        const updatedMarkers = underservedMarkers.filter(m => m.id !== selectedMarker.id);
        onMarkersChange('underservedMarkers', updatedMarkers);
      }
    }
    setShowLabelModal(false);
    setSelectedMarker(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">
          Step 1: Map Your Market Landscape (5 minutes)
        </h3>
        <p className="text-gray-700">
          Place markers to identify competitors and underserved segments
        </p>
      </div>

      <div className="border-2 rounded-lg p-5 mb-4" style={{
        background: 'linear-gradient(135deg, #FFE599 0%, #FF9000 20%)',
        borderColor: '#F1C232'
      }}>
        <div className="flex items-center mb-3">
          <Target className="mr-2 text-white" size={24} />
          <h4 className="text-lg font-semibold text-white">Market Mapping Instructions</h4>
        </div>
        <p className="mb-2 text-white">Click on the Venn diagram to place markers:</p>
        <ol className="list-decimal list-inside space-y-1 ml-2 text-white">
          <li>X markers = Competitor Focus (existing solutions)</li>
          <li>O markers = Underserved Segments (market gaps)</li>
          <li>Add optional labels to describe each marker</li>
        </ol>
      </div>

      {/* Three-Circle Venn Diagram - Matching Reference Image */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2 text-lg font-bold text-red-600">X</span>
              <span className="text-sm font-medium text-gray-800">
                Competitor Focus ({competitorMarkers.length})
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-lg font-bold text-blue-600">O</span>
              <span className="text-sm font-medium text-gray-800">
                Underserved Segments ({underservedMarkers.length})
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <svg
            width="100%"
            height="450"
            className="border border-gray-200 rounded cursor-crosshair"
            style={{ backgroundColor: '#f8f9fa' }}
            onClick={handleGridClick}
          >
            {/* Grid pattern */}
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Three overlapping circles - corrected geometry */}
            {/* Mainstream Market Circle (Top Left) */}
            <circle
              cx="40%"
              cy="42%"
              r="90"
              fill="rgba(156, 163, 175, 0.15)"
              stroke="#6B7280"
              strokeWidth="2"
              strokeDasharray="8,4"
            />

            {/* Low-end Market Circle (Top Right) */}
            <circle
              cx="60%"
              cy="42%"
              r="90"
              fill="rgba(156, 163, 175, 0.15)"
              stroke="#6B7280"
              strokeWidth="2"
              strokeDasharray="8,4"
            />

            {/* New/Overlooked Segments Circle (Bottom Center) */}
            <circle
              cx="50%"
              cy="59.3%"
              r="90"
              fill="rgba(156, 163, 175, 0.15)"
              stroke="#6B7280"
              strokeWidth="2"
              strokeDasharray="8,4"
            />

            {/* Strategic Market Landing Zone (True center intersection) */}
            <circle
              cx="50%"
              cy="47.8%"
              r="25"
              fill="rgba(34, 197, 94, 0.3)"
              stroke="#22C55E"
              strokeWidth="2.5"
            />
            
            {/* Circle labels - positioned exactly as in reference */}
            <text x="20%" y="35%" textAnchor="middle" className="text-sm font-medium" fill="#374151">
              Mainstream
            </text>
            <text x="20%" y="38%" textAnchor="middle" className="text-sm font-medium" fill="#374151">
              Market
            </text>
            
            <text x="80%" y="20%" textAnchor="middle" className="text-sm font-medium" fill="#374151">
              Low-end
            </text>
            <text x="80%" y="23%" textAnchor="middle" className="text-sm font-medium" fill="#374151">
              Market
            </text>
            
            <text x="80%" y="80%" textAnchor="middle" className="text-sm font-medium" fill="#374151">
              New/Overlooked
            </text>
            <text x="80%" y="83%" textAnchor="middle" className="text-sm font-medium" fill="#374151">
              Segments
            </text>
            
            {/* Strategic Landing Zone label */}
            <text x="50%" y="45%" textAnchor="middle" className="text-xs font-semibold" fill="#15803D">
              Strategic Market
            </text>
            <text x="50%" y="48%" textAnchor="middle" className="text-xs font-semibold" fill="#15803D">
              Landing Zone
            </text>
            
            {/* Competitor markers (X symbols) */}
            {competitorMarkers.map((marker) => (
              <g key={marker.id}>
                <text
                  x={`${marker.x}%`}
                  y={`${marker.y}%`}
                  textAnchor="middle"
                  className="text-xl font-bold cursor-pointer hover:opacity-80"
                  fill="#DC2626"
                  onClick={(e) => handleMarkerClick(marker, e)}
                >
                  X
                </text>
                {marker.label && (
                  <text
                    x={`${marker.x}%`}
                    y={`${marker.y + 8}%`}
                    textAnchor="middle"
                    className="text-xs font-medium pointer-events-none"
                    fill="#374151"
                  >
                    {marker.label.length > 15 ? `${marker.label.substring(0, 15)}...` : marker.label}
                  </text>
                )}
              </g>
            ))}
            
            {/* Underserved markers (O symbols) */}
            {underservedMarkers.map((marker) => (
              <g key={marker.id}>
                <text
                  x={`${marker.x}%`}
                  y={`${marker.y}%`}
                  textAnchor="middle"
                  className="text-xl font-bold cursor-pointer hover:opacity-80"
                  fill="#2563EB"
                  onClick={(e) => handleMarkerClick(marker, e)}
                >
                  O
                </text>
                {marker.label && (
                  <text
                    x={`${marker.x}%`}
                    y={`${marker.y + 8}%`}
                    textAnchor="middle"
                    className="text-xs font-medium pointer-events-none"
                    fill="#374151"
                  >
                    {marker.label.length > 15 ? `${marker.label.substring(0, 15)}...` : marker.label}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-4 text-sm text-gray-700">
          <p>Click anywhere on the Venn diagram to place markers. X = Competitor Focus, O = Underserved Segments. The green center zone represents the Strategic Market Landing Zone where all three circles overlap.</p>
        </div>
      </div>

      {/* Validation Status */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium mb-2 text-gray-800">Progress Status:</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${competitorMarkers.length >= 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm" style={{ color: competitorMarkers.length >= 1 ? '#22C55E' : '#6B7280' }}>
              At least 1 competitor marker placed ({competitorMarkers.length})
            </span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${underservedMarkers.length >= 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm" style={{ color: underservedMarkers.length >= 1 ? '#22C55E' : '#6B7280' }}>
              At least 1 underserved segment marker placed ({underservedMarkers.length})
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
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
            color: isValid ? '#FFFFFF' : '#6B7280'
          }}
        >
          Continue to Strategic Entry Point
        </button>
      </div>

      {/* Label Modal */}
      {showLabelModal && selectedMarker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {selectedMarker.type === 'competitor' ? 'Competitor Focus' : 'Underserved Segment'} Marker
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-800">
                Label (optional):
              </label>
              <input
                type="text"
                value={editingLabel}
                onChange={(e) => setEditingLabel(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-gray-900"
                style={{ borderColor: '#d1d5db' }}
                placeholder="e.g. Traditional monitoring tools, Manual processes..."
                maxLength={50}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSaveLabel}
                className="flex-1 px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: '#FF9000' }}
              >
                Save
              </button>
              <button
                onClick={handleDeleteMarker}
                className="px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: '#DC2626' }}
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setShowLabelModal(false)}
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