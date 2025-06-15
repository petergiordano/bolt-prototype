import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { ActivityShell } from '../../../components/layout/ActivityShell';
import { getWordCount } from '../../../components/WordCountFeedback';

// Placeholder components - will be implemented based on reference HTML
const HypothesisFormation: React.FC<any> = () => <div>Step 1: Hypothesis Formation</div>;
const EvidenceGathering: React.FC<any> = () => <div>Step 2: Evidence Gathering</div>;
const ValidationSummary: React.FC<any> = () => <div>Step 3: Validation Summary</div>;

// Simple local storage functions (matching Activity 1 pattern)
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

export const ProblemValidation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userKey, setUserKey] = useState<string>('');
  const [responses, setResponses] = useState({
    // Will be defined based on reference HTML structure
    problemStatement: '',
    targetAudience: '',
    assumptions: '',
    researchMethods: '',
    findings: '',
    validation: ''
  });

  // Load user data on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing Problem Validation activity...');
        
        const existingKey = localStorage.getItem('workshop_user_key');
        
        if (!existingKey) {
          setError('No user key found. Please complete Activity 1 first.');
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
            problemStatement: activity2Data.problemStatement || '',
            targetAudience: activity2Data.targetAudience || '',
            assumptions: activity2Data.assumptions || '',
            researchMethods: activity2Data.researchMethods || '',
            findings: activity2Data.findings || '',
            validation: activity2Data.validation || ''
          });
          
          // Set appropriate step based on completed data
          if (activity2Data.completedAt) {
            setCurrentStep(3);
          } else if (activity2Data.findings || activity2Data.validation) {
            setCurrentStep(2);
          }
        }
        
        console.log('✅ Problem Validation activity initialized successfully');
      } catch (err) {
        console.error('❌ Error initializing activity:', err);
        setError('Failed to load your progress. Please try again.');
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
          const existingData = await loadUserData(userKey);
          const userData = {
            ...existingData,
            version: "1.0",
            lastUpdated: new Date().toISOString(),
            day1: {
              ...existingData?.day1,
              activity2: {
                ...responses,
                completedAt: currentStep === 3 ? new Date().toISOString() : undefined
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

  const handleStepBack = (step: number) => {
    setCurrentStep(step);
  };

  const resetActivity = () => {
    setCurrentStep(1);
    setResponses({
      problemStatement: '',
      targetAudience: '',
      assumptions: '',
      researchMethods: '',
      findings: '',
      validation: ''
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
              problemStatement: '',
              targetAudience: '',
              assumptions: '',
              researchMethods: '',
              findings: '',
              validation: ''
            }
          }
        };
        saveUserData(userKey, userData);
      };
      saveResetData();
    }
  };

  // Validation functions - will be refined based on reference HTML requirements
  const isStep1Valid = () => {
    return getWordCount(responses.problemStatement) >= 10 && 
           getWordCount(responses.targetAudience) >= 5;
  };

  const isStep2Valid = () => {
    return getWordCount(responses.findings) >= 10;
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
      subtitle="Activity 2: Validating your problem hypothesis"
      currentStep={currentStep}
      totalSteps={3}
      userKey={userKey}
      onReset={resetActivity}
    >
      {currentStep === 1 && (
        <HypothesisFormation
          responses={responses}
          onInputChange={handleInputChange}
          onContinue={() => handleStepComplete(1)}
          isValid={isStep1Valid()}
        />
      )}

      {currentStep === 2 && (
        <EvidenceGathering
          responses={responses}
          onInputChange={handleInputChange}
          onContinue={() => handleStepComplete(2)}
          onBack={() => handleStepBack(1)}
          isValid={isStep2Valid()}
        />
      )}

      {currentStep === 3 && (
        <ValidationSummary
          responses={responses}
          onReset={resetActivity}
          onBack={() => handleStepBack(2)}
          userKey={userKey}
        />
      )}
    </ActivityShell>
  );
};