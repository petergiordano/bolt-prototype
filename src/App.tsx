import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ProgressIndicator } from './components/ProgressIndicator';
import { IndividualReflection } from './components/IndividualReflection';
import { PartnerSharing } from './components/PartnerSharing';
import { ActivitySummary } from './components/ActivitySummary';
import { getWordCount } from './components/WordCountFeedback';

// Simple local storage functions to replace Supabase for now
const generateUserKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const getUserKey = (): string => {
  let key = localStorage.getItem('workshop_user_key');
  if (!key) {
    key = generateUserKey();
    localStorage.setItem('workshop_user_key', key);
  }
  return key;
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

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userKey, setUserKey] = useState<string>('');
  const [responses, setResponses] = useState({
    momentOfRealization: '',
    whoExperienced: '',
    whyMatters: '',
    whatSurprised: '',
    howRealProblem: ''
  });

  // Load user data on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing app...');
        const key = getUserKey();
        console.log('🔑 User key:', key);
        setUserKey(key);
        
        const userData = await loadUserData(key);
        console.log('📊 Loaded user data:', userData);
        
        if (userData?.day1?.activity1) {
          const activity1Data = userData.day1.activity1;
          setResponses({
            momentOfRealization: activity1Data.momentOfRealization || '',
            whoExperienced: activity1Data.whoExperienced || '',
            whyMatters: activity1Data.whyMatters || '',
            whatSurprised: activity1Data.whatSurprised || '',
            howRealProblem: activity1Data.howRealProblem || ''
          });
          
          // Set appropriate step based on completed data
          if (activity1Data.completedAt) {
            setCurrentStep(3);
          } else if (activity1Data.whatSurprised || activity1Data.howRealProblem) {
            setCurrentStep(2);
          }
        }
        console.log('✅ App initialized successfully');
      } catch (err) {
        console.error('❌ Error initializing app:', err);
        setError('Failed to load your progress. Starting fresh.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Auto-save responses when they change
  useEffect(() => {
    if (!loading && userKey) {
      const saveData = async () => {
        try {
          const userData = {
            version: "1.0",
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            day1: {
              activity1: {
                ...responses,
                completedAt: currentStep === 3 ? new Date().toISOString() : undefined
              }
            }
          };
          
          await saveUserData(userKey, userData);
          console.log('💾 Data saved successfully');
        } catch (err) {
          console.error('❌ Error saving data:', err);
        }
      };

      // Debounce saves
      const timeoutId = setTimeout(saveData, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [responses, currentStep, userKey, loading]);

  const handleInputChange = (field: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepComplete = (step: number) => {
    setCurrentStep(step + 1);
  };

  const resetActivity = () => {
    setCurrentStep(1);
    setResponses({
      momentOfRealization: '',
      whoExperienced: '',
      whyMatters: '',
      whatSurprised: '',
      howRealProblem: ''
    });
  };

  const isStep1Valid = () => {
    return getWordCount(responses.momentOfRealization) >= 10 && 
           getWordCount(responses.whoExperienced) >= 5 && 
           getWordCount(responses.whyMatters) >= 10;
  };

  const isStep2Valid = () => {
    return getWordCount(responses.whatSurprised) >= 10 && 
           getWordCount(responses.howRealProblem) >= 10;
  };

  const steps = [
    { number: 1, label: 'Individual Reflection' },
    { number: 2, label: 'Partner Sharing' },
    { number: 3, label: 'Summary' }
  ];

  console.log('🎨 Rendering App - Step:', currentStep, 'Loading:', loading, 'Error:', error);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #FFE599 0%, #FF9000 100%)'
      }}>
        <LoadingSpinner message="Loading your workshop data..." />
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
                Problem Origin Story
              </h1>
              <p className="text-gray-600" style={{ color: '#666666' }}>
                Activity 1: Understanding the roots of your problem
              </p>
            </div>
            <div className="text-sm bg-gray-50 px-3 py-2 rounded-lg" style={{ 
              color: '#8A8A8A',
              backgroundColor: '#f8f9fa'
            }}>
              User ID: {userKey.substring(0, 6)}...
            </div>
          </div>
          
          <ProgressIndicator currentStep={currentStep} steps={steps} />
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

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 relative">
          {/* Reset Button */}
          <button
            onClick={resetActivity}
            className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center transition-all duration-200 group"
            style={{
              backgroundColor: '#f5f5f5',
              color: '#8A8A8A'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFE599';
              e.currentTarget.style.color = '#FF9000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.color = '#8A8A8A';
            }}
            title="Reset Activity"
          >
            <svg 
              className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {currentStep === 1 && (
            <IndividualReflection
              responses={responses}
              onInputChange={handleInputChange}
              onContinue={() => handleStepComplete(1)}
              isValid={isStep1Valid()}
            />
          )}

          {currentStep === 2 && (
            <PartnerSharing
              responses={responses}
              onInputChange={handleInputChange}
              onContinue={() => handleStepComplete(2)}
              isValid={isStep2Valid()}
            />
          )}

          {currentStep === 3 && (
            <ActivitySummary
              responses={responses}
              onReset={resetActivity}
              userKey={userKey}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-30 rounded-full">
            <div className="w-6 h-6 border-2 border-white border-opacity-60 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;