import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { ActivityShell } from '../../../components/layout/ActivityShell';
import { MapMarketLandscape } from '../../../components/activity2/MapMarketLandscape';
import { IdentifyEntryPoint } from '../../../components/activity2/IdentifyEntryPoint';
import { JustifyChoice } from '../../../components/activity2/JustifyChoice';
import { ValidationSummary } from '../../../components/activity2/ValidationSummary';
import { UserCodeEntry } from '../../../components/UserCodeEntry';

// Simple local storage functions (matching Activity 1 pattern)
const generateUserKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const loadUserData = async (key: string) => {
  try {
    const data = localStorage.getItem(`workshop_data_${key}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
};

const saveUserData = async (key: string, data: any) => {
  try {
    localStorage.setItem(`workshop_data_${key}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

export interface MarkerData {
  id: string;
  type: 'competitor' | 'underserved' | 'strategic';
  x: number;
  y: number;
  label: string;
}

export const ProblemValidation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userKey, setUserKey] = useState<string>('');
  const [showUserCodeEntry, setShowUserCodeEntry] = useState(false);
  const [responses, setResponses] = useState({
    competitorMarkers: [] as MarkerData[],
    underservedMarkers: [] as MarkerData[],
    strategicMarker: null as MarkerData | null,
    strategicJustification: '',
    landingZoneChoice: '',
    evidenceSupport: ''
  });

  // Load user data on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing Problem Validation activity...');
        
        const existingKey = localStorage.getItem('workshop_user_key');
        console.log('🔍 Checking for existing key:', existingKey);
        
        if (!existingKey) {
          console.log('🔑 No existing user key found, showing code entry');
          setShowUserCodeEntry(true);
          setLoading(false);
          return;
        }

        console.log('🔑 Found existing user key:', existingKey);
        setUserKey(existingKey);
        
        const userData = await loadUserData(existingKey);
        console.log('📊 Loaded user data:', userData);
        
        if (userData?.day1?.activity2) {
          const activity2Data = userData.day1.activity2;
          setResponses({
            competitorMarkers: activity2Data.competitorMarkers || [],
            underservedMarkers: activity2Data.underservedMarkers || [],
            strategicMarker: activity2Data.strategicMarker || null,
            strategicJustification: activity2Data.strategicJustification || '',
            landingZoneChoice: activity2Data.landingZoneChoice || '',
            evidenceSupport: activity2Data.evidenceSupport || ''
          });
          
          // Set appropriate step based on completed data
          if (activity2Data.completedAt) {
            setCurrentStep(4);
          } else if (activity2Data.landingZoneChoice || activity2Data.evidenceSupport) {
            setCurrentStep(3);
          } else if (activity2Data.strategicMarker || activity2Data.strategicJustification) {
            setCurrentStep(2);
          }
        }
        
        console.log('✅ Problem Validation activity initialized successfully');
      } catch (err) {
        console.error('❌ Error initializing activity:', err);
        setError('Failed to load your progress. Starting fresh.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Auto-save responses when they change
  useEffect(() => {
    if (!loading && userKey && !showUserCodeEntry) {
      const saveData = async () => {
        try {
          const existingData = await loadUserData(userKey);
          const userData = {
            ...existingData,
            version: "1.0",
            lastUpdated: new Date().toISOString(),
            day1: {
              ...existingData?.day1,
              activity2: {
                ...responses,
                completedAt: currentStep === 4 ? new Date().toISOString() : undefined
              }
            }
          };
          
          await saveUserData(userKey, userData);
          console.log('💾 Activity 2 data saved successfully');
        } catch (err) {
          console.error('❌ Error saving Activity 2 data:', err);
        }
      };

      const timeoutId = setTimeout(saveData, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [responses, currentStep, userKey, loading, showUserCodeEntry]);

  const handleUserCodeSubmit = async (code: string): Promise<boolean> => {
    try {
      console.log('🔍 Validating user code:', code);
      
      const userData = await loadUserData(code);
      
      if (userData) {
        console.log('✅ Valid user code found');
        
        setUserKey(code);
        localStorage.setItem('workshop_user_key', code);
        
        if (userData.day1?.activity2) {
          const activity2Data = userData.day1.activity2;
          setResponses({
            competitorMarkers: activity2Data.competitorMarkers || [],
            underservedMarkers: activity2Data.underservedMarkers || [],
            strategicMarker: activity2Data.strategicMarker || null,
            strategicJustification: activity2Data.strategicJustification || '',
            landingZoneChoice: activity2Data.landingZoneChoice || '',
            evidenceSupport: activity2Data.evidenceSupport || ''
          });
          
          if (activity2Data.completedAt) {
            setCurrentStep(4);
          } else if (activity2Data.landingZoneChoice || activity2Data.evidenceSupport) {
            setCurrentStep(3);
          } else if (activity2Data.strategicMarker || activity2Data.strategicJustification) {
            setCurrentStep(2);
          }
        }
        
        setShowUserCodeEntry(false);
        return true;
      } else {
        console.log('❌ Invalid user code');
        return false;
      }
    } catch (error) {
      console.error('❌ Error validating user code:', error);
      return false;
    }
  };

  const handleUserCodeSkip = () => {
    console.log('⏭️ User chose to start fresh');
    const newKey = generateUserKey();
    setUserKey(newKey);
    localStorage.setItem('workshop_user_key', newKey);
    setShowUserCodeEntry(false);
  };

  const handleMarkersChange = (field: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepComplete = (step: number) => {
    setCurrentStep(step + 1);
  };

  const handleStepBack = (step: number) => {
    setCurrentStep(step);
  };

  const resetActivity = () => {
    setCurrentStep(1);
    setResponses({
      competitorMarkers: [],
      underservedMarkers: [],
      strategicMarker: null,
      strategicJustification: '',
      landingZoneChoice: '',
      evidenceSupport: ''
    });
    
    if (userKey) {
      const saveResetData = async () => {
        const existingData = await loadUserData(userKey);
        const userData = {
          ...existingData,
          version: "1.0",
          lastUpdated: new Date().toISOString(),
          day1: {
            ...existingData?.day1,
            activity2: {
              competitorMarkers: [],
              underservedMarkers: [],
              strategicMarker: null,
              strategicJustification: '',
              landingZoneChoice: '',
              evidenceSupport: ''
            }
          }
        };
        saveUserData(userKey, userData);
      };
      saveResetData();
    }
  };

  // Validation functions
  const isStep1Valid = () => {
    return responses.competitorMarkers.length >= 1 && responses.underservedMarkers.length >= 1;
  };

  const isStep2Valid = () => {
    return responses.strategicMarker !== null && responses.strategicJustification.trim().length > 0;
  };

  const isStep3Valid = () => {
    const wordCount = responses.evidenceSupport.trim().split(/\s+/).filter(w => w.length > 0).length;
    return responses.landingZoneChoice.trim().length > 0 && wordCount >= 20;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #FFE599 0%, #FF9000 100%)'
      }}>
        <LoadingSpinner message="Loading Problem Validation activity..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #FFE599 0%, #FF9000 100%)'
    }}>
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Problem Validation
              </h1>
              <p className="text-gray-600" style={{ color: '#666666' }}>
                Activity 2: Market Landing Zone Analysis
              </p>
            </div>
            {userKey && (
              <div className="text-sm bg-gray-50 px-3 py-2 rounded-lg" style={{ 
                color: '#8A8A8A',
                backgroundColor: '#f8f9fa'
              }}>
                User ID: {userKey.substring(0, 6)}...
              </div>
            )}
          </div>
        </div>

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={() => {
              setError(null);
              window.location.reload();
            }} 
          />
        )}

        {/* User Code Entry */}
        {showUserCodeEntry && (
          <UserCodeEntry
            onCodeSubmit={handleUserCodeSubmit}
            onSkip={handleUserCodeSkip}
          />
        )}

        {/* Main Content */}
        {!showUserCodeEntry && (
          <ActivityShell
            title="Problem Validation"
            subtitle="Activity 2: Market Landing Zone Analysis"
            currentStep={currentStep}
            totalSteps={4}
            userKey={userKey}
            onReset={resetActivity}
          >
            {currentStep === 1 && (
              <MapMarketLandscape
                competitorMarkers={responses.competitorMarkers}
                underservedMarkers={responses.underservedMarkers}
                onMarkersChange={handleMarkersChange}
                onContinue={() => handleStepComplete(1)}
                isValid={isStep1Valid()}
              />
            )}

            {currentStep === 2 && (
              <IdentifyEntryPoint
                competitorMarkers={responses.competitorMarkers}
                underservedMarkers={responses.underservedMarkers}
                strategicMarker={responses.strategicMarker}
                strategicJustification={responses.strategicJustification}
                onMarkersChange={handleMarkersChange}
                onInputChange={handleInputChange}
                onContinue={() => handleStepComplete(2)}
                onBack={() => handleStepBack(1)}
                isValid={isStep2Valid()}
              />
            )}

            {currentStep === 3 && (
              <JustifyChoice
                landingZoneChoice={responses.landingZoneChoice}
                evidenceSupport={responses.evidenceSupport}
                onInputChange={handleInputChange}
                onContinue={() => handleStepComplete(3)}
                onBack={() => handleStepBack(2)}
                isValid={isStep3Valid()}
              />
            )}

            {currentStep === 4 && (
              <ValidationSummary
                responses={responses}
                onReset={resetActivity}
                onBack={() => handleStepBack(3)}
                userKey={userKey}
              />
            )}
          </ActivityShell>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-30 rounded-full">
            <div className="w-6 h-6 border-2 border-white border-opacity-60 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};