import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  label: string;
  autoStart?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ 
  duration, 
  onComplete, 
  label, 
  autoStart = false 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [hasStarted, setHasStarted] = useState(autoStart);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && hasStarted) {
      setIsRunning(false);
      onComplete?.();
    }
  }, [timeLeft, isRunning, hasStarted, onComplete]);

  const startTimer = () => {
    setIsRunning(true);
    setHasStarted(true);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Clock className="mr-2 text-gray-600" size={20} />
        <span className="font-medium text-gray-800">
          {hasStarted ? `Time remaining: ${formatTime(timeLeft)}` : `${label}: ${formatTime(duration)}`}
        </span>
      </div>
      
      {!hasStarted && (
        <button
          onClick={startTimer}
          className="px-4 py-2 rounded-lg transition-colors text-white"
          style={{
            backgroundColor: '#6B7280'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4B5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6B7280';
          }}
        >
          Start Timer (Optional)
        </button>
      )}
    </div>
  );
};