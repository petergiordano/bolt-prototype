import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { ActivityShell } from '../../../components/layout/ActivityShell';
import { IndividualReflection } from '../../../components/IndividualReflection';
import { PartnerSharing } from '../../../components/PartnerSharing';
import { ActivitySummary } from '../../../components/ActivitySummary';
import { UserCodeEntry } from '../../../components/UserCodeEntry';
import { getWordCount } from '../../../components/WordCountFeedback';

// Simple local storage functions to replace Supabase for now
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

const saveUserData = async (key: string, data: Record<string, unknown>) => {
  try {
    localStorage.setItem(`workshop_data_${key}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

export const ProblemOriginStory: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userKey, setUserKey] = useState<string>('');
  const [showUserCodeEntry, setShowUserCodeEntry] = useState(false);
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
        
        // Check if user key exists in localStorage
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
        
        if (userData?.workshop1?.activity1) {
          const activity1Data = userData.workshop1.activity1;
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
    if (!loading && userKey && !showUserCodeEntry) {
      const saveData = async () => {
        try {
          const userData = {
            version: "1.0",
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            workshop1: {
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
  }, [responses, currentStep, userKey, loading, showUserCodeEntry]);

  const handleUserCodeSubmit = async (code: string): Promise<boolean> => {
    try {
      console.log('🔍 Validating user code:', code);
      
      // Try to load data for this code
      const userData = await loadUserData(code);
      
      if (userData && userData.workshop1?.activity1) {
        console.log('✅ Valid user code found with activity data');
        
        // Set the user key and save to localStorage
        setUserKey(code);
        localStorage.setItem('workshop_user_key', code);
        
        // Load the responses
        const activity1Data = userData.workshop1.activity1;
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
        
        setShowUserCodeEntry(false);
        return true;
      } else {
        console.log('❌ Invalid user code or no activity data found');
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
    // Only reset the current activity's responses, not the user key
    setCurrentStep(1);
    setResponses({
      momentOfRealization: '',
      whoExperienced: '',
      whyMatters: '',
      whatSurprised: '',
      howRealProblem: ''
    });
    
    // Save the reset state
    if (userKey) {
      const userData = {
        version: "1.0",
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        workshop1: {
          activity1: {
            momentOfRealization: '',
            whoExperienced: '',
            whyMatters: '',
            whatSurprised: '',
            howRealProblem: ''
          }
        }
      };
      saveUserData(userKey, userData);
    }
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


  console.log('🎨 Rendering App - Step:', currentStep, 'Loading:', loading, 'Error:', error, 'ShowCodeEntry:', showUserCodeEntry, 'UserKey:', userKey);

  if (loading) {
    return <LoadingSpinner message="Loading your workshop data..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={() => {
          setError(null);
          window.location.reload();
        }} 
      />
    );
  }

  if (showUserCodeEntry) {
    return (
      <UserCodeEntry
        onCodeSubmit={handleUserCodeSubmit}
        onSkip={handleUserCodeSkip}
      />
    );
  }

  return (
    <ActivityShell
      title="Problem Origin Story"
      subtitle="Activity 1: Understanding the roots of your problem"
      currentStep={currentStep}
      totalSteps={3}
      userKey={userKey}
      onReset={resetActivity}
    >
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
          onBack={() => handleStepBack(1)}
          isValid={isStep2Valid()}
        />
      )}

      {currentStep === 3 && (
        <ActivitySummary
          responses={responses}
          onReset={resetActivity}
          onBack={() => handleStepBack(2)}
          userKey={userKey}
        />
      )}
    </ActivityShell>
  );
};