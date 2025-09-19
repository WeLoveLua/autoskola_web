'use client';

import { useState, useEffect } from 'react';

interface UseNavigationReturn {
  currentQuestionIndex: number;
  selectedAnswer: string | undefined;
  showAnswer: boolean;
  answers: Record<number, string>;
  answeredCount: number;
  setCurrentQuestionIndex: (index: number) => void;
  setSelectedAnswer: (answer: string | undefined) => void;
  setShowAnswer: (show: boolean) => void;
  setAnswers: (answers: Record<number, string>) => void;
  handleNext: (totalQuestions: number, saveToCache: (index: number, answers: Record<number, string>) => void) => void;
  handlePrevious: (saveToCache: (index: number, answers: Record<number, string>) => void) => void;
  handleAnswerSelect: (answer: string, saveToCache: (index: number, answers: Record<number, string>) => void) => void;
  handleGoToQuestion: (index: number, saveToCache: (index: number, answers: Record<number, string>) => void) => void;
  resetNavigation: () => void;
}

export function useNavigation(): UseNavigationReturn {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const answeredCount = Object.keys(answers).length;

  const handleNext = (totalQuestions: number, saveToCache: (index: number, answers: Record<number, string>) => void) => {
    if (currentQuestionIndex < totalQuestions - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      
      const cachedAnswer = answers[newIndex];
      setSelectedAnswer(cachedAnswer);
      setShowAnswer(!!cachedAnswer);
      
      saveToCache(newIndex, answers);
    }
  };

  const handlePrevious = (saveToCache: (index: number, answers: Record<number, string>) => void) => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      
      const cachedAnswer = answers[newIndex];
      setSelectedAnswer(cachedAnswer);
      setShowAnswer(!!cachedAnswer);
      
      saveToCache(newIndex, answers);
    }
  };

  const handleAnswerSelect = (answer: string, saveToCache: (index: number, answers: Record<number, string>) => void) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    const newAnswers = { ...answers, [currentQuestionIndex]: answer };
    setAnswers(newAnswers);
    saveToCache(currentQuestionIndex, newAnswers);
  };

  const handleGoToQuestion = (index: number, saveToCache: (index: number, answers: Record<number, string>) => void) => {
    setCurrentQuestionIndex(index);
    const cachedAnswer = answers[index];
    setSelectedAnswer(cachedAnswer);
    setShowAnswer(!!cachedAnswer);
    saveToCache(index, answers);
  };

  const resetNavigation = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(undefined);
    setShowAnswer(false);
    setAnswers({});
  };

  // Load cached answer when question index changes
  useEffect(() => {
    const cachedAnswer = answers[currentQuestionIndex];
    setSelectedAnswer(cachedAnswer);
    setShowAnswer(!!cachedAnswer);
  }, [currentQuestionIndex, answers]);

  return {
    currentQuestionIndex,
    selectedAnswer,
    showAnswer,
    answers,
    answeredCount,
    setCurrentQuestionIndex,
    setSelectedAnswer,
    setShowAnswer,
    setAnswers,
    handleNext,
    handlePrevious,
    handleAnswerSelect,
    handleGoToQuestion,
    resetNavigation,
  };
}