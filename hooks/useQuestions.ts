'use client';

import { useState } from 'react';
import { Question } from '@/types/question';

interface UseQuestionsReturn {
  questions: Question[];
  allQuestions: Question[];
  loading: boolean;
  error: string | null;
  fetchQuestions: () => Promise<void>;
  setQuestions: (questions: Question[]) => void;
  setAllQuestions: (questions: Question[]) => void;
}

export function useQuestions(): UseQuestionsReturn {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/questions?' + new Date().getTime(), {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setQuestions(data);
      setAllQuestions(data);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  return {
    questions,
    allQuestions,
    loading,
    error,
    fetchQuestions,
    setQuestions,
    setAllQuestions,
  };
}