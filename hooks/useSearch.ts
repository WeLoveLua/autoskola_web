'use client';

import { useState } from 'react';
import { Question } from '@/types/question';

interface UseSearchReturn {
  searchQuery: string;
  searchResults: number[];
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  handleSearch: (query: string, questions: Question[]) => void;
  handleGoToQuestion: (index: number, answers: Record<number, string>, onGoTo: (index: number) => void) => void;
  clearSearch: () => void;
}

export function useSearch(): UseSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (query: string, questions: Question[]) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: number[] = [];

    questions.forEach((q, index) => {
      // Vyhledávání podle čísla otázky
      if ((index + 1).toString() === normalizedQuery) {
        results.push(index);
        return;
      }

      // Vyhledávání podle ID/kódu otázky
      if (q.id && q.id.toString().toLowerCase().includes(normalizedQuery)) {
        results.push(index);
        return;
      }

      // Vyhledávání v textu otázky
      const questionText = (q.question || q.questionText || '').toLowerCase();
      if (questionText.includes(normalizedQuery)) {
        results.push(index);
        return;
      }

      // Vyhledávání v odpovědích
      if (q.options) {
        const hasMatchInOptions = q.options.some(opt => {
          if (typeof opt === 'string') {
            return opt.toLowerCase().includes(normalizedQuery);
          } else if (opt && typeof opt === 'object' && 'text' in opt) {
            return opt.text.toLowerCase().includes(normalizedQuery);
          }
          return false;
        });
        if (hasMatchInOptions) {
          results.push(index);
          return;
        }
      }

      // Vyhledávání v answers
      if (q.answers) {
        const hasMatchInAnswers = q.answers.some(ans => 
          ans.text.toLowerCase().includes(normalizedQuery)
        );
        if (hasMatchInAnswers) {
          results.push(index);
          return;
        }
      }

      // Vyhledávání ve správné odpovědi
      if (q.correctAnswer && q.correctAnswer.toLowerCase().includes(normalizedQuery)) {
        results.push(index);
        return;
      }
    });

    setSearchResults(results);
  };

  const handleGoToQuestion = (index: number, answers: Record<number, string>, onGoTo: (index: number) => void) => {
    onGoTo(index);
    setShowSearch(false);
    clearSearch();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return {
    searchQuery,
    searchResults,
    showSearch,
    setShowSearch,
    handleSearch,
    handleGoToQuestion,
    clearSearch,
  };
}