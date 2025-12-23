import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QuestionnaireStackParamList } from './types';

// Screens - will be created next
import QuestCoverScreen from '../screens/questionnaire/QuestCoverScreen';
import QuestCoverPrimeroScreen from '../screens/questionnaire/QuestCoverPrimeroScreen';
import QuestionScreen from '../screens/questionnaire/QuestionScreen';
import QuestionnaireSuccessScreen from '../screens/questionnaire/QuestionnaireSuccessScreen';

const Stack = createNativeStackNavigator<QuestionnaireStackParamList>();

export const QuestionnaireNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="QuestCover" component={QuestCoverScreen} />
      <Stack.Screen name="QuestCoverPrimero" component={QuestCoverPrimeroScreen} />
      <Stack.Screen name="Question" component={QuestionScreen} />
      <Stack.Screen name="QuestionnaireSuccess" component={QuestionnaireSuccessScreen} />
    </Stack.Navigator>
  );
};
