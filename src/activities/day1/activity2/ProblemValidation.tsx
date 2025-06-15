import React, { useState, useEffect } from 'react';
import { ActivityShell } from '../../../components/layout/ActivityShell';
import { HypothesisFormation } from './steps/HypothesisFormation';
import { EvidenceGathering } from './steps/EvidenceGathering';
import { ValidationSummary } from './steps/ValidationSummary';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { UserCodeEntry } from '../../../components/UserCodeEntry';
import { ProblemValidationData, TextResponseStep, MultipleChoiceStep } from '../../../types/WorkshopData';
import { getWordCount } from '../../../components/WordCountFeedback';

// Simple local storage functions (will be replaced with Supabase)
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

const initializeActivityData = (): ProblemValidationData => ({
  startedAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  stepData: {
    hypothesisFormation: {
      problemStatement: {
        response: '',
        wordCount: 0,
        isValid: false,
        lastModified: new Date().toISOString()
      },
      targetAudience: {
        response: '',
        wordCount: 0,
        isValid: false,
        lastModified: new Date().toISOString()
      },
      assumptions: []
    },
    evidenceGathering: {
      researchMethods: [],
      findings: []
    },
    validation: {
      isValidated: false,
      confidence: 5,
      nextActions: []
    }
  },
  metadata: {
    timeSpent: 0,
    revisitCount: 0
  }
});

export const ProblemValidation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userKey, setUserKey] = useState<string>('');
  const [showUserCodeEntry, setShowUserCodeEntry] = useState(false);
  const [activityData, setActivityData] = useState<ProblemValidationData>(initializeActivityData());

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
          setActivityData(activity2Data);
          
          // Set appropriate step based on completed data
          if (activity2Data.completedAt) {
            setCurrentStep(3);
          } else if (activity2Data.stepData?.evidenceGathering?.researchMethods?.length > 0) {
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

  // Auto-save activity data when it changes
  useEffect(() => {
    if (!loading && userKey && !showUserCodeEntry) {
      const saveData = async () => {
        try {
          const existingUserData = await loadUserData(userKey) || {};
          const userData = {
            ...existingUserData,
            version: "1.0",
            lastUpdated: new Date().toISOString(),
            day1: {
              ...existingUserData.day1,
              activity2: {
                ...activityData,
                completedAt: currentStep === 3 ? new Date().toISOString() : undefined
              }
            }
          };
          
          await saveUserData(userKey, userData);
          console.log('💾 Activity 2 data saved successfully');
        } catch (err) {
          console.error('❌ Error saving activity data:', err);
        }
      };

      const timeoutId = setTimeout(saveData, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [activityData, currentStep, userKey, loading, showUserCodeEntry]);

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
          setActivityData(activity2Data);
          
          if (activity2Data.completedAt) {
            setCurrentStep(3);
          } else if (activity2Data.stepData?.evidenceGathering?.researchMethods?.length > 0) {
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

  const updateStepData = (stepKey: string, fieldKey: string, value: any) => {
    setActivityData(prev => ({
      ...prev,
      stepData: {
        ...prev.stepData,
        [stepKey]: {
          ...prev.stepData[stepKey],
          [fieldKey]: typeof value === 'string' ? {
            response: value,
            wordCount: getWordCount(value),
            isValid: getWordCount(value) >= 10, // Basic validation
            lastModified: new Date().toISOString()
          } : value
        }
      },
      lastModified: new Date().toISOString()
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
    setActivityData(initializeActivityData());
    
    if (userKey) {
      const saveResetData = async () => {
        const existingUserData = await loadUserData(userKey) || {};
        const userData = {
          ...existingUserData,
          day1: {
            ...existingUserData.day1,
            activity2: initializeActivityData()
          }
        };
        saveUserData(userKey, userData);
      };
      saveResetData();
    }
  };

  const isStep1Valid = () => {
    const { problemStatement, targetAudience } = activityData.stepData.hypothesisFormation;
    return problemStatement.isValid && targetAudience.isValid;
  };

  const isStep2Valid = () => {
    const { researchMethods, findings } = activityData.stepData.evidenceGathering;
    return researchMethods.length > 0 && findings.length > 0 && findings.every(f => f.isValid);
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

  if (showUserCodeEntry) {
    return (
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, #FFE599 0%, #FF9000 100%)'
      }}>
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Problem Validation
            </h1>
            <p className="text-gray-600">
              Activity 2: Testing your problem hypothesis
            </p>
          </div>
          
          <UserCodeEntry
            onCodeSubmit={handleUserCodeSubmit}
            onSkip={handleUserCodeSkip}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, #FFE599 0%, #FF9000 100%)'
      }}>
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
          <ErrorMessage 
            message={error} 
            onRetry={() => {
              setError(null);
              window.location.reload();
            }} 
          />
        </div>
      </div>
    );
  }

  return (
    <ActivityShell
      title="Problem Validation"
      subtitle="Activity 2: Testing your problem hypothesis"
      currentStep={currentStep}
      totalSteps={3}
      userKey={userKey}
      onReset={resetActivity}
    >
      {currentStep === 1 && (
        <HypothesisFormation
          stepData={activityData.stepData.hypothesisFormation}
          onUpdateField={(field, value) => updateStepData('hypothesisFormation', field, value)}
          onContinue={() => handleStepComplete(1)}
          isValid={isStep1Valid()}
        />
      )}

      {currentStep === 2 && (
        <EvidenceGathering
          stepData={activityData.stepData.evidenceGathering}
          onUpdateField={(field, value) => updateStepData('evidenceGathering', field, value)}
          onContinue={() => handleStepComplete(2)}
          onBack={() => handleStepBack(1)}
          isValid={isStep2Valid()}
        />
      )}

      {currentStep === 3 && (
        <ValidationSummary
          activityData={activityData}
          onReset={resetActivity}
          onBack={() => handleStepBack(2)}
          userKey={userKey}
        />
      )}
    </ActivityShell>
  );
};