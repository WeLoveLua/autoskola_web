'use client';

import { Question } from '@/types/question';

interface SearchModalProps {
  isOpen: boolean;
  searchQuery: string;
  searchResults: number[];
  questions: Question[];
  answers: Record<number, string>;
  onSearch: (query: string) => void;
  onGoToQuestion: (index: number) => void;
}

export default function SearchModal({ 
  isOpen, 
  searchQuery, 
  searchResults, 
  questions, 
  answers, 
  onSearch, 
  onGoToQuestion 
}: SearchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="mt-4 max-w-2xl mx-auto">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Hledat podle čísla, kódu, textu otázky nebo odpovědi..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        autoFocus
      />
      
      {searchQuery && searchResults.length > 0 && (
        <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.slice(0, 10).map((index) => {
            const q = questions[index];
            const questionText = q.question || q.questionText || '';
            const truncatedText = questionText.length > 60 
              ? questionText.substring(0, 60) + '...'
              : questionText;
            
            return (
              <button
                key={index}
                onClick={() => onGoToQuestion(index)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      #{index + 1}
                    </span>
                    {q.id && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        (ID: {q.id})
                      </span>
                    )}
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {truncatedText}
                    </div>
                  </div>
                  {answers[index] && (
                    <span className="text-green-500 dark:text-green-400">✓</span>
                  )}
                </div>
              </button>
            );
          })}
          {searchResults.length > 10 && (
            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
              ... a dalších {searchResults.length - 10} výsledků
            </div>
          )}
        </div>
      )}
      
      {searchQuery && searchResults.length === 0 && (
        <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Žádné výsledky nenalezeny
          </p>
        </div>
      )}
    </div>
  );
}