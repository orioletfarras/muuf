import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { QuestionnaireStackScreenProps } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Colors, Spacing, Typography } from '../../constants/theme';

type Props = QuestionnaireStackScreenProps<'QuestCoverPrimero'>;

const QuestCoverPrimeroScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Hola!</Text>
          <Text style={styles.message}>
            Queremos conocerte mejor para adaptar{' '}
            <Text style={styles.highlight}>tu experiencia Muuf.</Text>
          </Text>
        </View>

        <Button
          title="Siguiente"
          onPress={() => navigation.navigate('Question', { questionNumber: 1 })}
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
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
    fontFamily: Typography.fontFamily.bold,
  },
  message: {
    fontSize: 40,
    lineHeight: 52,
    color: Colors.text,
    fontFamily: Typography.fontFamily.regular,
  },
  highlight: {
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  button: {
    backgroundColor: '#1A7F8E',
    borderRadius: 28,
    height: 56,
  },
});

export default QuestCoverPrimeroScreen;
