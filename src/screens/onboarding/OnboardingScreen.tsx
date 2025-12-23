import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { RootStackScreenProps } from '../../navigation/types';
import { Button } from '../../components';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

type Props = RootStackScreenProps<'Onboarding'>;

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Bienvenido a MUUF',
    description: 'Tu compañero personal de bienestar. Registra actividades, gana puntos y alcanza tus metas de salud.',
    emoji: '🏃',
    color: Colors.primary,
  },
  {
    id: '2',
    title: 'Seguimiento Personalizado',
    description: 'Ritmo y Balance adaptados a ti. Recibe objetivos personalizados según tu edad, nivel y disponibilidad.',
    emoji: '📊',
    color: Colors.secondary,
  },
  {
    id: '3',
    title: 'Compite y Gana',
    description: 'Rankings semanales, insignias y desafíos. Compite con tu equipo y desbloquea logros únicos.',
    emoji: '🏆',
    color: Colors.success,
  },
  {
    id: '4',
    title: '¡Comencemos!',
    description: 'Registra tu primera actividad hoy y empieza tu viaje hacia una vida más activa y saludable.',
    emoji: '🎯',
    color: Colors.info,
  },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    // TODO: Mark onboarding as completed in storage
    navigation.replace('Auth');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { backgroundColor: `${item.color}10` }]}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentIndex ? Colors.primary : Colors.border,
              width: index === currentIndex ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {renderPagination()}

      <View style={styles.footer}>
        {currentIndex < slides.length - 1 ? (
          <View style={styles.footerButtons}>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Saltar</Text>
            </TouchableOpacity>
            <Button
              title="Siguiente"
              onPress={handleNext}
              size="large"
              style={styles.nextButton}
            />
          </View>
        ) : (
          <Button
            title="Empezar"
            onPress={handleFinish}
            size="large"
            fullWidth
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    width,
    height: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    transition: 'all 0.3s',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  nextButton: {
    minWidth: 120,
  },
});

export default OnboardingScreen;
