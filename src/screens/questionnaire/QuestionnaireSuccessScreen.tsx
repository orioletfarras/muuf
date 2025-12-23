import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { QuestionnaireStackScreenProps } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { Image } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useQuestionnaireStore } from '../../stores/questionnaireStore';
import { supabase } from '../../lib/supabase';

type Props = QuestionnaireStackScreenProps<'QuestionnaireSuccess'>;

const QuestionnaireSuccessScreen: React.FC<Props> = ({ navigation }) => {
  const { user, updateUser, setQuestionnaireCompleted } = useAuthStore();
  const { getQuestionnaireData, clearQuestionnaire, profilePhoto } = useQuestionnaireStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Get questionnaire data
      const questionnaireData = getQuestionnaireData();
      console.log('Questionnaire data:', questionnaireData);

      // Step 2: Update user profile with avatar if provided
      if (profilePhoto) {
        updateUser({ avatar_url: profilePhoto });
      }

      // Step 3: Save questionnaire data to Supabase (optional - depends on your backend setup)
      // TODO: Create a profiles table in Supabase and save questionnaire data
      // const { error } = await supabase.from('questionnaire_responses').insert({
      //   user_id: user.id,
      //   answers: questionnaireData.answers,
      //   profile_photo: questionnaireData.profilePhoto,
      // });
      // if (error) throw error;

      // Step 4: Mark questionnaire as completed
      setQuestionnaireCompleted(true);

      // Step 5: Clear questionnaire store
      clearQuestionnaire();

      // Navigation will happen automatically via RootNavigator
      // RootNavigator will detect hasCompletedQuestionnaire=true and show Main
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error saving questionnaire:', error);

      Alert.alert(
        'Error',
        error.message || 'Hubo un error al guardar tus respuestas. Por favor intenta de nuevo.',
        [
          {
            text: 'OK',
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.messageContainer}>
          <Text style={styles.icon}>✌️</Text>
          <Text style={styles.title}>¡Felicidades!</Text>
          <Text style={styles.subtitle}>Has completado nuestro cuestionario.</Text>

          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logo-muuf.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.ready}>ready</Text>
          </View>
        </View>

        <Button
          title={isLoading ? 'Iniciando...' : 'Empezar'}
          onPress={handleStart}
          loading={isLoading}
          disabled={isLoading}
          fullWidth
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warning,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: Colors.white,
    marginBottom: Spacing.xxl,
    fontFamily: Typography.fontFamily.regular,
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: Spacing.sm,
  },
  ready: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: Typography.fontFamily.semibold,
  },
  button: {
    backgroundColor: '#1A7F8E',
    borderRadius: 28,
    height: 56,
  },
});

export default QuestionnaireSuccessScreen;
