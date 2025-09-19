'use client';

import { useEffect, useState } from 'react';
import SingleQuestion from '@/components/SingleQuestion';
import TestDialog from '@/components/TestDialog';
import SearchModal from '@/components/SearchModal';
import TestResultsModal from '@/components/TestResultsModal';
import { Search, Clock, Play } from 'lucide-react';
import { useTest } from '@/hooks/useTest';
import { useSearch } from '@/hooks/useSearch';
import { useCache } from '@/hooks/useCache';
import { useQuestions } from '@/hooks/useQuestions';
import { useNavigation } from '@/hooks/useNavigation';
import { useKeyboard } from '@/hooks/useKeyboard';

export default function Home() {
  const [showWarning, setShowWarning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState({ answeredCount: 0, correctCount: 0 });

  // Custom hooks
  const {
    questions,
    allQuestions,
    loading,
    error,
    fetchQuestions,
    setQuestions,
  } = useQuestions();

  const {
    currentQuestionIndex,
    selectedAnswer,
    showAnswer,
    answers,
    answeredCount,
    setCurrentQuestionIndex,
    setAnswers,
    handleNext,
    handlePrevious,
    handleAnswerSelect,
    handleGoToQuestion,
    resetNavigation,
  } = useNavigation();

  const {
    testMode,
    timeRemaining,
    showTestDialog,
    openTestDialog,
    startTest,
    endTest,
    closeTestDialog,
    formatTime,
  } = useTest();

  const {
    searchQuery,
    searchResults,
    showSearch,
    setShowSearch,
    handleSearch,
    handleGoToQuestion: searchGoToQuestion,
    clearSearch,
  } = useSearch();

  const {
    saveToCache,
    loadFromCache,
    clearProgress: clearCacheProgress,
    checkWarningShown,
    dismissWarning,
  } = useCache();

  // Initialize data
  useEffect(() => {
    fetchQuestions();
    loadInitialData();
    checkInitialWarning();
  }, []);

  // Auto end test when time runs out
  useEffect(() => {
    if (testMode && timeRemaining <= 0) {
      handleEndTest();
    }
  }, [testMode, timeRemaining]);

  const loadInitialData = () => {
    const { questionIndex, answers: cachedAnswers } = loadFromCache();
    setCurrentQuestionIndex(questionIndex);
    setAnswers(cachedAnswers);
  };

  const checkInitialWarning = () => {
    if (!checkWarningShown()) {
      setShowWarning(true);
    }
  };

  const handleStartTest = () => {
    startTest(allQuestions, (testQuestions) => {
      setQuestions(testQuestions);
      resetNavigation();
      setShowSearch(false);
      clearSearch();
    });
  };

  const handleEndTest = () => {
    const correctCount = Object.entries(answers).filter(([index, answer]) => {
      const q = questions[parseInt(index)];
      if (!q) return false;
      return q.correctAnswer === answer || 
             q.answers?.find(a => a.text === answer)?.isCorrect;
    }).length;
    
    setTestResults({
      answeredCount: Object.keys(answers).length,
      correctCount
    });
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    endTest(answers, questions, () => {
      setQuestions(allQuestions);
      resetNavigation();
      loadInitialData();
    });
  };

  const clearProgress = () => {
    clearCacheProgress();
    resetNavigation();
  };

  const handleGoToQuestionFromSearch = (index: number) => {
    searchGoToQuestion(index, answers, (newIndex) => {
      handleGoToQuestion(newIndex, saveToCache);
    });
  };

  const handleDismissWarning = () => {
    dismissWarning();
    setShowWarning(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Keyboard shortcuts
  useKeyboard({
    showSearch,
    showWarning,
    showAnswer,
    currentQuestion,
    testMode,
    onNext: () => handleNext(questions.length, saveToCache),
    onPrevious: () => handlePrevious(saveToCache),
    onAnswerSelect: (answer) => handleAnswerSelect(answer, saveToCache),
    onToggleSearch: () => setShowSearch(!showSearch),
    onOpenTest: openTestDialog,
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <header className="text-center mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mb-4">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
              Zodpovězeno: {answeredCount}/{questions.length}
            </div>
            <div className="flex gap-2 order-1 sm:order-2">
              {!testMode ? (
                <>
                  <button
                    onClick={openTestDialog}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors flex items-center gap-1"
                  >
                    <Play className="w-4 h-4" />
                    <span>Zkušební test</span>
                  </button>
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Search className="w-4 h-4" />
                    <span>Hledat</span>
                  </button>
                  <button
                    onClick={clearProgress}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Resetovat
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1 bg-yellow-500 dark:bg-yellow-600 text-white rounded">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(timeRemaining)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Autoškola
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Testové otázky pro řidičský průkaz
            {testMode && (
              <span className="ml-2 text-orange-500 font-semibold">
                (Testový režim)
              </span>
            )}
          </p>
          
          <SearchModal 
            isOpen={showSearch && !loading && !error && questions.length > 0 && !testMode}
            searchQuery={searchQuery}
            searchResults={searchResults}
            questions={questions}
            answers={answers}
            onSearch={(query) => handleSearch(query, questions)}
            onGoToQuestion={handleGoToQuestionFromSearch}
          />
        </header>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <div className="text-gray-600 dark:text-gray-300 text-lg text-center">
                Načítání otázek...
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl text-center shadow-lg">
              <h3 className="font-semibold mb-2">Chyba při načítání otázek</h3>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={fetchQuestions}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Zkusit znovu
              </button>
            </div>
          </div>
        )}

        {!loading && !error && questions.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">
                Žádné otázky nejsou k dispozici.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Ujistěte se, že soubor questions.json existuje v /public složce.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && questions.length > 0 && currentQuestion && (
          <SingleQuestion
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onNext={() => handleNext(questions.length, saveToCache)}
            onPrevious={() => handlePrevious(saveToCache)}
            onAnswerSelect={(answer) => handleAnswerSelect(answer, saveToCache)}
            selectedAnswer={selectedAnswer}
            showAnswer={showAnswer}
            onFinish={handleEndTest}
            isTestMode={testMode}
          />
        )}

        <TestDialog 
          isOpen={showTestDialog}
          onClose={closeTestDialog}
          onStart={handleStartTest}
        />

        <TestResultsModal
          isOpen={showResults}
          answeredCount={testResults.answeredCount}
          totalQuestions={25}
          correctCount={testResults.correctCount}
          onClose={handleCloseResults}
        />

        {/* Warning Modal */}
        {showWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Upozornění
                </h2>
              </div>
              
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm sm:text-base">
                  Tyto otázky obsahují <strong>všechny typy řidičských oprávnění</strong> (A, B, C, D, T, atd.).
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm sm:text-base">
                  Pokud si připravujete pouze <strong>řidičák skupiny B</strong>, budou vám zobrazeny i otázky pro ostatní skupiny (motocykly, nákladní auta, autobusy, atd.).
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                  Doporučujeme procvičovat všechny otázky pro lepší přípravu na teoretický test.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleDismissWarning}
                  className="px-4 sm:px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium text-sm sm:text-base touch-manipulation"
                >
                  Rozumím, pokračovat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}