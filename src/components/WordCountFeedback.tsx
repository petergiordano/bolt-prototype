import React from 'react';
import { CheckCircle } from 'lucide-react';

interface WordCountFeedbackProps {
  text: string;
  minWords: number;
  className?: string;
}

export const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};

export const WordCountFeedback: React.FC<WordCountFeedbackProps> = ({ 
  text, 
  minWords, 
  className = "" 
}) => {
  const wordCount = getWordCount(text);
  const isValid = wordCount >= minWords;
  
  return (
    <div className={`flex justify-between items-center mt-2 text-sm ${className}`}>
      <span style={{ color: '#8A8A8A' }}>
        (describe in {minWords}+ words)
      </span>
      {isValid ? (
        <div className="flex items-center" style={{ color: '#22C55E' }}>
          <CheckCircle size={16} className="mr-1" />
          <span>{wordCount} words</span>
        </div>
      ) : (
        <span style={{ color: '#8A8A8A' }}>
          {wordCount} words
        </span>
      )}
    </div>
  );
};