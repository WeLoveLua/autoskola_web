export const TEST_CONFIG = {
  QUESTION_COUNT: 25,
  TIME_LIMIT_MINUTES: 30,
  TIME_LIMIT_SECONDS: 30 * 60,
} as const;

export const STORAGE_KEYS = {
  CURRENT_QUESTION_INDEX: 'currentQuestionIndex',
  USER_ANSWERS: 'userAnswers',
  WARNING_SHOWN: 'warningShown',
} as const;