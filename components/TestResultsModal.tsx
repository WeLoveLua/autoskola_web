'use client';

import { CheckCircle } from 'lucide-react';

interface TestResultsModalProps {
  isOpen: boolean;
  answeredCount: number;
  totalQuestions: number;
  correctCount: number;
  onClose: () => void;
}

export default function TestResultsModal({ 
  isOpen, 
  answeredCount, 
  totalQuestions, 
  correctCount, 
  onClose 
}: TestResultsModalProps) {
  if (!isOpen) return null;

  const percentage = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const isPassed = percentage >= 80; // Předpokládáme 80% jako hranici pro úspěch

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <div className={`rounded-full p-2 mr-3 flex-shrink-0 ${
            isPassed 
              ? 'bg-green-100 dark:bg-green-900/30' 
              : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            <CheckCircle className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isPassed 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`} />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            Test ukončen!
          </h2>
        </div>
        
        <div className="mb-4 sm:mb-6 space-y-3">
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              isPassed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {percentage}%
            </div>
            <p className={`text-sm font-medium ${
              isPassed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}>
              {isPassed ? 'Úspěšně splněno!' : 'Bohužel, neprošel jste'}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Zodpovězeno:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Správně:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {correctCount}/{answeredCount}
              </span>
            </div>
          </div>
          
          {!isPassed && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Pro úspěšné složení je potřeba alespoň 80% správných odpovědí
            </p>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}