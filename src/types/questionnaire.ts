/**
 * Types for the questionnaire flow
 */

export type QuestionType =
  | 'multiple-choice'
  | 'text-input'
  | 'numeric-input'
  | 'photo-upload'
  | 'multi-select'
  | 'sport-search';

export interface QuestionOption {
  id: string;
  label: string;
  icon?: string;
}

export interface Question {
  id: string;
  questionNumber: number;
  type: QuestionType;
  question: string;
  subtitle?: string;
  options?: QuestionOption[];
  placeholder?: string;
  unit?: string; // Para inputs numéricos (kg, cm, etc.)
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
  };
}

export interface QuestionnaireAnswer {
  questionId: string;
  value: string | string[] | number;
}

export interface QuestionnaireData {
  answers: QuestionnaireAnswer[];
  completedAt?: Date;
  profilePhoto?: string;
}
