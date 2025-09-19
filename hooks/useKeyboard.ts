'use client';

import { useEffect } from 'react';
import { Question } from '@/types/question';

interface UseKeyboardProps {
  showSearch: boolean;
  showWarning: boolean;
  showAnswer: boolean;
  currentQuestion: Question | undefined;
  testMode: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onAnswerSelect: (answer: string) => void;
  onToggleSearch: () => void;
  onOpenTest: () => void;
}

export function useKeyboard({
  showSearch,
  showWarning,
  showAnswer,
  currentQuestion,
  testMode,
  onNext,
  onPrevious,
  onAnswerSelect,
  onToggleSearch,
  onOpenTest,
}: UseKeyboardProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showSearch || showWarning) return;
      
      if (e.key === 'ArrowRight' || (e.key === 'Enter' && showAnswer)) {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrevious();
      } else if (!showAnswer && currentQuestion && /^[1-9]$/.test(e.key)) {
        const index = parseInt(e.key) - 1;
        const options = currentQuestion.options || currentQuestion.answers?.map(a => a.text);
        if (options && index < options.length) {
          const answer = typeof options[index] === 'string' 
            ? options[index] 
            : options[index].text;
          onAnswerSelect(answer);
        }
      } else if (e.key === 's' && e.ctrlKey && !testMode) {
        e.preventDefault();
        onToggleSearch();
      } else if (e.key === 't' && !testMode) {
        onOpenTest();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    showSearch, 
    showWarning, 
    showAnswer, 
    currentQuestion, 
    testMode,
    onNext,
    onPrevious,
    onAnswerSelect,
    onToggleSearch,
    onOpenTest
  ]);
}