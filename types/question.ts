export interface AnswerOption {
  id?: number;
  text: string;
  isCorrect: boolean;
  mediaContent?: string | null;
}

export interface Question {
  id?: string | number;
  number?: number;
  question?: string;
  questionText?: string;
  answers?: AnswerOption[];
  options?: string[] | AnswerOption[];
  correctAnswer?: string;
  explanationNote?: string | null;
  mediaContent?: string | null;
  imageUrl?: string;
  videoUrl?: string;
  gifUrl?: string;
  category?: string;
  difficulty?: string;
  media?: {
    type: string;
    url: string;
  } | null;
}