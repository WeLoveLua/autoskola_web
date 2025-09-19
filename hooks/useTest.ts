'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/types/question';
import { TEST_CONFIG } from '@/constants/test';

interface UseTestReturn {
  testMode: boolean;
  timeRemaining: number;
  testCompleted: boolean;
  showTestDialog: boolean;
  openTestDialog: () => void;
  startTest: (allQuestions: Question[], onTestStart: (questions: Question[]) => void) => void;
  endTest: (answers: Record<number, string>, questions: Question[], onTestEnd: () => void) => void;
  closeTestDialog: () => void;
  formatTime: (seconds: number) => string;
}

export function useTest(): UseTestReturn {
  const [testMode, setTestMode] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TEST_CONFIG.TIME_LIMIT_SECONDS);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);

  // Timer pro testový režim
  useEffect(() => {
    if (!testMode || testCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Nenastavujeme testCompleted zde, necháme to na page.tsx
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testMode, testCompleted]);

  const openTestDialog = () => {
    setShowTestDialog(true);
  };

  const closeTestDialog = () => {
    setShowTestDialog(false);
  };

  const startTest = (allQuestions: Question[], onTestStart: (questions: Question[]) => void) => {
    // Vybereme 25 náhodných otázek
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const testQuestions = shuffled.slice(0, TEST_CONFIG.QUESTION_COUNT);
    
    setTestMode(true);
    setTimeRemaining(TEST_CONFIG.TIME_LIMIT_SECONDS);
    setTestCompleted(false);
    setShowTestDialog(false);
    
    onTestStart(testQuestions);
  };

  const endTest = (answers: Record<number, string>, questions: Question[], onTestEnd: () => void) => {
    setTestCompleted(true);
    setTestMode(false);
    onTestEnd();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    testMode,
    timeRemaining,
    testCompleted,
    showTestDialog,
    openTestDialog,
    startTest,
    endTest,
    closeTestDialog,
    formatTime,
  };
}