'use client';

import { Question, AnswerOption } from '@/types/question';
import { useState, useEffect } from 'react';

interface SingleQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
  onPrevious: () => void;
  onAnswerSelect: (selectedAnswer: string) => void;
  selectedAnswer?: string;
  showAnswer: boolean;
  onFinish?: () => void;
  isTestMode?: boolean;
}

export default function SingleQuestion({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onNext, 
  onPrevious, 
  onAnswerSelect,
  selectedAnswer,
  showAnswer,
  onFinish,
  isTestMode = false
}: SingleQuestionProps) {
  const [imageError, setImageError] = useState(false);
  
  // Handle media from different sources
  const mediaUrl = question.mediaContent || 
                   question.videoUrl || 
                   question.gifUrl || 
                   question.imageUrl ||
                   (question.media?.mediaUrl);

  // Ensure mediaUrl is a string and make it absolute
  let mediaUrlString = typeof mediaUrl === 'string' ? mediaUrl : (mediaUrl?.mediaUrl || '');
  
  // Convert relative URLs to absolute URLs
  if (mediaUrlString && mediaUrlString.startsWith('/binary_content_storage/')) {
    mediaUrlString = `https://etesty2.mdcr.cz${mediaUrlString}`;
  }
                   
  const isVideo = mediaUrlString && (
    mediaUrlString.endsWith('.mp4') || 
    mediaUrlString.endsWith('.webm') || 
    mediaUrlString.endsWith('.ogg')
  );

  // Process options to handle both formats
  const baseOptions = question.answers || 
    (question.options ? 
      question.options.map(option => {
        if (typeof option === 'string') {
          return {
            text: option,
            isCorrect: option === question.correctAnswer
          };
        } else {
          return option;
        }
      }) : []);

  // Shuffle the options while maintaining correct answer tracking
  const [shuffledOptions, setShuffledOptions] = useState(() => {
    if (baseOptions.length === 0) return [];
    
    const shuffled = [...baseOptions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  const processedOptions = shuffledOptions;
  const correctAnswer = processedOptions.find(opt => opt.isCorrect)?.text || question.correctAnswer;
  const questionText = question.questionText || question.question;

  // Reset image error when media URL changes
  useEffect(() => {
    setImageError(false);
  }, [mediaUrlString]);

  // Reshuffle options when question changes
  useEffect(() => {
    if (baseOptions.length > 0) {
      const shuffled = [...baseOptions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledOptions(shuffled);
    }
  }, [question]);

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center text-white">
          <div className="text-xs sm:text-sm font-medium">
            Otázka {questionNumber} z {totalQuestions}
          </div>
          <div className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full">
            {question.id || questionNumber}
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        {/* Question Text */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
            {questionText}
          </h2>
        </div>

        {/* Media Content */}
        {mediaUrlString && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-center min-h-[150px] sm:min-h-[200px]">
              {isVideo ? (
                <video
                  key={mediaUrlString}
                  className="max-w-full max-h-64 sm:max-h-96 rounded-lg shadow-sm"
                  controls
                  muted
                  preload="metadata"
                >
                  <source src={mediaUrlString} />
                  Your browser does not support the video tag.
                </video>
              ) : !imageError ? (
                <img
                  key={mediaUrlString}
                  src={mediaUrlString}
                  alt="Question media"
                  className="max-w-full max-h-64 sm:max-h-96 object-contain rounded-lg shadow-sm"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="text-gray-400 dark:text-gray-500 text-sm">
                  Obrázek se nepodařilo načíst
                </div>
              )}
            </div>
          </div>
        )}

        {/* Answer Options */}
        {processedOptions && processedOptions.length > 0 ? (
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            {processedOptions.map((option, idx) => {
              const isSelected = selectedAnswer === option.text;
              const isCorrect = option.isCorrect;
              const showAsCorrect = showAnswer && isCorrect;
              const showAsWrong = showAnswer && isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => onAnswerSelect(option.text)}
                  disabled={showAnswer}
                  className={`w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                    showAsCorrect
                      ? 'border-green-500 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                      : showAsWrong
                      ? 'border-red-500 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      : isSelected && !showAnswer
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-gray-600'
                  } ${showAnswer ? 'cursor-default' : 'cursor-pointer'} touch-manipulation`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${
                      showAsCorrect
                        ? 'border-green-500 bg-green-500 text-white'
                        : showAsWrong
                        ? 'border-red-500 bg-red-500 text-white'
                        : isSelected && !showAnswer
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-gray-300 dark:border-gray-500'
                    }`}>
                      {showAsCorrect ? '✓' : showAsWrong ? '✗' : String.fromCharCode(65 + idx)}
                    </div>
                    <div className="flex-1 min-w-0">
                      {option.mediaContent?.mediaUrl ? (
                        <div className="flex flex-col items-center gap-1 sm:gap-2">
                          <img
                            src={`https://etesty2.mdcr.cz${option.mediaContent.mediaUrl}`}
                            alt={`Možnost ${String.fromCharCode(65 + idx)}`}
                            className="max-w-24 max-h-18 sm:max-w-32 sm:max-h-24 object-contain rounded"
                            loading="lazy"
                          />
                          {option.text && option.text !== '.' && (
                            <span className="text-xs sm:text-sm font-medium text-center">{option.text}</span>
                          )}
                        </div>
                      ) : (
                        <span className="font-medium text-sm sm:text-base">{option.text}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Free text answer */
          <div className="mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Správná odpověď:</p>
              <p className="text-gray-800 dark:text-gray-200 font-medium text-sm sm:text-base">{correctAnswer}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600 gap-2 sm:gap-4">
          <button
            onClick={onPrevious}
            disabled={questionNumber === 1}
            className="px-3 sm:px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base touch-manipulation"
          >
            <span className="hidden sm:inline">← Předchozí</span>
            <span className="sm:hidden">←</span>
          </button>

          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center flex-shrink-0">
            <div className="sm:hidden">{Math.round((questionNumber / totalQuestions) * 100)}%</div>
            <div className="hidden sm:block">{Math.round((questionNumber / totalQuestions) * 100)}% dokončeno</div>
          </div>

          {questionNumber === totalQuestions && isTestMode ? (
            <button
              onClick={onFinish}
              className="px-3 sm:px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors text-sm sm:text-base touch-manipulation"
            >
              <span className="hidden sm:inline">Dokončit</span>
              <span className="sm:hidden">✓</span>
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={questionNumber === totalQuestions && !isTestMode}
              className="px-3 sm:px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base touch-manipulation"
            >
              <span className="hidden sm:inline">{questionNumber === totalQuestions ? 'Dokončit' : 'Další →'}</span>
              <span className="sm:hidden">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}