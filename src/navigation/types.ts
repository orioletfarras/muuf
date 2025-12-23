/**
 * Navigation types for TypeScript type safety
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OTPVerification: { email: string };
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

// Questionnaire Stack
export type QuestionnaireStackParamList = {
  QuestCover: undefined;
  QuestCoverPrimero: undefined;
  Question: { questionNumber: number };
  QuestionnaireSuccess: undefined;
};

export type QuestionnaireStackScreenProps<T extends keyof QuestionnaireStackParamList> =
  NativeStackScreenProps<QuestionnaireStackParamList, T>;

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Activities: undefined;
  Stats: undefined;
  Profile: undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

// Root Stack
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Questionnaire: undefined;
  Main: undefined;
  ActivityDetail: { activityId: number };
  CreateActivity: undefined;
  EditProfile: undefined;
  Badges: undefined;
  Settings: undefined;
  Team: undefined;
  Quests: undefined;
  Notifications: undefined;
  Ranking: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Composite types for nested navigators
export type MainTabCompositeProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
