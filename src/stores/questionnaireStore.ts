import { create } from 'zustand';
import { QuestionnaireAnswer, QuestionnaireData } from '../types/questionnaire';

interface QuestionnaireState {
  answers: QuestionnaireAnswer[];
  profilePhoto: string | null;
  registrationData: {
    email?: string;
    password?: string;
    full_name?: string;
  } | null;

  // Actions
  setAnswer: (questionId: string, value: string | string[] | number) => void;
  setProfilePhoto: (uri: string) => void;
  setRegistrationData: (data: { email: string; password: string; full_name: string }) => void;
  getQuestionnaireData: () => QuestionnaireData;
  clearQuestionnaire: () => void;
}

export const useQuestionnaireStore = create<QuestionnaireState>((set, get) => ({
  answers: [],
  profilePhoto: null,
  registrationData: null,

  setAnswer: (questionId, value) => {
    set((state) => {
      const existingIndex = state.answers.findIndex((a) => a.questionId === questionId);

      if (existingIndex >= 0) {
        // Update existing answer
        const newAnswers = [...state.answers];
        newAnswers[existingIndex] = { questionId, value };
        return { answers: newAnswers };
      } else {
        // Add new answer
        return { answers: [...state.answers, { questionId, value }] };
      }
    });
  },

  setProfilePhoto: (uri) => set({ profilePhoto: uri }),

  setRegistrationData: (data) => set({ registrationData: data }),

  getQuestionnaireData: () => {
    const state = get();
    return {
      answers: state.answers,
      profilePhoto: state.profilePhoto || undefined,
      completedAt: new Date(),
    };
  },

  clearQuestionnaire: () => set({
    answers: [],
    profilePhoto: null,
    registrationData: null,
  }),
}));
