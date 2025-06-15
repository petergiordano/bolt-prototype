import React, { useState } from 'react';
import { Key, AlertCircle, CheckCircle } from 'lucide-react';

interface UserCodeEntryProps {
  onCodeSubmit: (code: string) => Promise<boolean>;
  onSkip: () => void;
}

export const UserCodeEntry: React.FC<UserCodeEntryProps> = ({
  onCodeSubmit,
  onSkip
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a user code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const isValid = await onCodeSubmit(code.trim().toUpperCase());
      if (isValid) {
        setSuccess(true);
        setTimeout(() => {
          // Component will be hidden by parent
        }, 1000);
      } else {
        setError('Invalid user code. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to validate code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (success) {
    return (
      <div className="border rounded-xl p-6 mb-6" style={{
        background: 'linear-gradient(135deg, #E8F5E8 0%, #22C55E 20%)',
        borderColor: '#22C55E'
      }}>
        <div className="flex items-center justify-center">
          <CheckCircle style={{ color: '#22C55E' }} size={24} className="mr-2" />
          <span className="font-semibold" style={{ color: '#15803D' }}>
            Code validated! Loading your progress...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-6 mb-6" style={{
      background: 'linear-gradient(135deg, #E6F3FF 0%, #55BFFA 20%)',
      borderColor: '#55BFFA'
    }}>
      <div className="flex items-center mb-4">
        <Key style={{ color: '#55BFFA' }} size={24} className="mr-3" />
        <h3 className="text-xl font-semibold" style={{ color: '#6E9FBA' }}>
          Continue Your Workshop Journey
        </h3>
      </div>
      
      <p className="mb-4" style={{ color: '#6E9FBA' }}>
        Have a user code from previous activities? Enter it below to continue where you left off 
        and access all your saved workshop data.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#6E9FBA' }}>
            Enter your code to continue where you left off:
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(null);
            }}
            className="w-full px-4 py-3 border rounded-lg font-mono text-center tracking-wider transition-all duration-200"
            style={{
              borderColor: error ? '#DC2626' : '#d1d5db',
              backgroundColor: '#FFFFFF'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#55BFFA';
              e.target.style.boxShadow = '0 0 0 2px rgba(85, 191, 250, 0.2)';
            }}
            onBlur={(e) => {
              if (!error) {
                e.target.style.borderColor = '#d1d5db';
              }
              e.target.style.boxShadow = 'none';
            }}
            placeholder="e.g. ABC123DEF456"
            maxLength={12}
            disabled={loading}
          />
          {error && (
            <div className="flex items-center mt-2 text-sm" style={{ color: '#DC2626' }}>
              <AlertCircle size={16} className="mr-1" />
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              loading || !code.trim()
                ? 'cursor-not-allowed'
                : ''
            }`}
            style={{
              backgroundColor: (loading || !code.trim()) ? '#d1d5db' : '#55BFFA',
              color: (loading || !code.trim()) ? '#8A8A8A' : '#FFFFFF'
            }}
            onMouseEnter={(e) => {
              if (!loading && code.trim()) {
                e.currentTarget.style.backgroundColor = '#3B9AE1';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && code.trim()) {
                e.currentTarget.style.backgroundColor = '#55BFFA';
              }
            }}
          >
            {loading ? 'Validating...' : 'Continue with Code'}
          </button>
          
          <button
            type="button"
            onClick={handleSkip}
            disabled={loading}
            className="px-6 py-3 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: '#8A8A8A',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#666666';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#8A8A8A';
              }
            }}
          >
            Start Fresh
          </button>
        </div>
      </form>

      <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
        <p className="text-sm" style={{ color: '#6E9FBA' }}>
          <strong>Why enter a code?</strong> Your user code connects you to all your workshop progress 
          across multiple activities. Without it, you'll start fresh and won't have access to your 
          previous insights and responses.
        </p>
      </div>
    </div>
  );
};