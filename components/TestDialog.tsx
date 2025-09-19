'use client';

import { Play } from 'lucide-react';

interface TestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export default function TestDialog({ isOpen, onClose, onStart }: TestDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2 mr-3 flex-shrink-0">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            Zkušební test
          </h2>
        </div>
        
        <div className="mb-4 sm:mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm sm:text-base">
            Připravujete se spustit <strong>zkušební test</strong>.
          </p>
          <ul className="space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Test obsahuje <strong>25 náhodných otázek</strong></span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Časový limit je <strong>30 minut</strong></span>
            </li>
          </ul>
        </div>
        
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium text-sm sm:text-base"
          >
            Zrušit
          </button>
          <button
            onClick={onStart}
            className="px-4 sm:px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm sm:text-base flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Spustit test
          </button>
        </div>
      </div>
    </div>
  );
}