'use client';

import { STORAGE_KEYS } from '@/constants/test';

interface UseCacheReturn {
  saveToCache: (questionIndex: number, userAnswers: Record<number, string>) => void;
  loadFromCache: () => { questionIndex: number; answers: Record<number, string> };
  clearProgress: () => void;
  checkWarningShown: () => boolean;
  dismissWarning: () => void;
}

export function useCache(): UseCacheReturn {
  const saveToCache = (questionIndex: number, userAnswers: Record<number, string>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_QUESTION_INDEX, questionIndex.toString());
      localStorage.setItem(STORAGE_KEYS.USER_ANSWERS, JSON.stringify(userAnswers));
    }
  };

  const loadFromCache = () => {
    let questionIndex = 0;
    let answers: Record<number, string> = {};

    if (typeof window !== 'undefined') {
      const cachedQuestionIndex = localStorage.getItem(STORAGE_KEYS.CURRENT_QUESTION_INDEX);
      const cachedAnswers = localStorage.getItem(STORAGE_KEYS.USER_ANSWERS);
      
      if (cachedQuestionIndex) {
        questionIndex = parseInt(cachedQuestionIndex, 10);
      }
      
      if (cachedAnswers) {
        answers = JSON.parse(cachedAnswers);
      }
    }

    return { questionIndex, answers };
  };

  const clearProgress = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_QUESTION_INDEX);
      localStorage.removeItem(STORAGE_KEYS.USER_ANSWERS);
    }
  };

  const checkWarningShown = () => {
    if (typeof window !== 'undefined') {
      const warningShown = localStorage.getItem(STORAGE_KEYS.WARNING_SHOWN);
      return !!warningShown;
    }
    return false;
  };

  const dismissWarning = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.WARNING_SHOWN, 'true');
    }
  };

  return {
    saveToCache,
    loadFromCache,
    clearProgress,
    checkWarningShown,
    dismissWarning,
  };
}