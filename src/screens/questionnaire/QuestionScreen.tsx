import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { QuestionnaireStackScreenProps } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { QUESTIONS } from '../../data/questionnaireData';
import { SPORTS } from '../../data/sportsData';
import { Question, QuestionOption } from '../../types/questionnaire';
import { useQuestionnaireStore } from '../../stores/questionnaireStore';

type Props = QuestionnaireStackScreenProps<'Question'>;

const QuestionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { questionNumber } = route.params;
  const question = QUESTIONS.find((q) => q.questionNumber === questionNumber);
  const { setAnswer, setProfilePhoto: saveProfilePhoto } = useQuestionnaireStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [numericInput, setNumericInput] = useState('');
  const [weight, setWeight] = useState(70); // Peso inicial razonable: 70kg
  const [height, setHeight] = useState(170); // Altura inicial razonable: 170cm
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  // Reset all state when question changes
  useEffect(() => {
    setIsNavigating(false);
    setSelectedOption(null);
    setTextInput('');
    setNumericInput('');
    setWeight(70);
    setHeight(170);
    setSelectedOptions([]);
    setPhotoUri(null);
    setSearchQuery('');
    setSelectedSports([]);
  }, [questionNumber]);

  if (!question) {
    return null;
  }

  const progress = (questionNumber / QUESTIONS.length) * 100;

  const handleBack = () => {
    if (questionNumber === 1) {
      navigation.goBack();
    } else {
      navigation.navigate('Question', { questionNumber: questionNumber - 1 });
    }
  };

  const handleNext = () => {
    if (isNavigating) return; // Prevent double navigation
    if (!question) return;

    setIsNavigating(true);

    // Save answer based on question type
    switch (question.type) {
      case 'multiple-choice':
        if (selectedOption) setAnswer(question.id, selectedOption);
        break;
      case 'text-input':
        if (textInput) setAnswer(question.id, textInput);
        break;
      case 'numeric-input':
        if (question.id === 'q2') setAnswer(question.id, weight);
        if (question.id === 'q3') setAnswer(question.id, height);
        break;
      case 'photo-upload':
        if (photoUri) saveProfilePhoto(photoUri);
        break;
      case 'sport-search':
        if (selectedSports.length > 0) setAnswer(question.id, selectedSports);
        break;
      case 'multi-select':
        if (selectedOptions.length > 0) setAnswer(question.id, selectedOptions);
        break;
    }

    // Use setTimeout to allow state update and navigation
    setTimeout(() => {
      if (questionNumber < QUESTIONS.length) {
        navigation.navigate('Question', { questionNumber: questionNumber + 1 });
      } else {
        navigation.navigate('QuestionnaireSuccess');
      }
    }, 100);
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    // Removed auto-advance - user must click "Siguiente"
  };

  const handlePickImage = async () => {
    try {
      // Check current permission status
      const { status: currentStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();

      let finalStatus = currentStatus;

      // If not granted, request permission
      if (currentStatus !== 'granted') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitas habilitar el acceso a la galería en Configuración > MUUF > Fotos para poder subir una foto de perfil.',
          [{ text: 'Entendido' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Hubo un error al abrir la galería');
    }
  };

  const handleTakePhoto = async () => {
    try {
      // Check current permission status
      const { status: currentStatus } = await ImagePicker.getCameraPermissionsAsync();

      let finalStatus = currentStatus;

      // If not granted, request permission
      if (currentStatus !== 'granted') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitas habilitar el acceso a la cámara en Configuración > MUUF > Cámara para poder tomar una foto de perfil.',
          [{ text: 'Entendido' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Hubo un error al abrir la cámara');
    }
  };

  const toggleMultiSelect = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter((s) => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const filteredSports = SPORTS.filter((sport) =>
    sport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentValue = () => {
    if (question.id === 'q2') return weight;
    if (question.id === 'q3') return height;
    return 0;
  };

  const canProceed = () => {
    switch (question.type) {
      case 'multiple-choice':
        return selectedOption !== null;
      case 'text-input':
        return textInput.trim().length > 0;
      case 'numeric-input':
        return true; // Always true since we have default values
      case 'photo-upload':
        return true; // Photo is optional
      case 'multi-select':
        return selectedOptions.length > 0 || textInput.trim().length > 0;
      case 'sport-search':
        return selectedSports.length > 0;
      default:
        return false;
    }
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.option,
                  selectedOption === option.id && styles.optionSelected,
                ]}
                onPress={() => handleOptionSelect(option.id)}
                disabled={isNavigating}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === option.id && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'text-input':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={textInput}
              onChangeText={setTextInput}
              placeholder={question.placeholder || 'Escribe aquí...'}
              placeholderTextColor={Colors.textSecondary}
              autoFocus
            />
          </View>
        );

      case 'numeric-input':
        const isWeight = question.id === 'q2';
        const isHeight = question.id === 'q3';
        const currentValue = getCurrentValue();
        const minValue = isWeight ? 30 : 100;
        const maxValue = isWeight ? 200 : 250;

        return (
          <View style={styles.sliderContainer}>
            {/* Display Value */}
            <View style={styles.valueDisplay}>
              <Text style={styles.valueNumber}>{currentValue}</Text>
              {question.unit && (
                <Text style={styles.valueUnit}>{question.unit}</Text>
              )}
            </View>

            {/* Slider */}
            <View style={styles.sliderWrapper}>
              <Slider
                style={styles.slider}
                minimumValue={minValue}
                maximumValue={maxValue}
                step={1}
                value={currentValue}
                onValueChange={(value) => {
                  if (isWeight) setWeight(Math.round(value));
                  if (isHeight) setHeight(Math.round(value));
                }}
                minimumTrackTintColor={Colors.secondary}
                maximumTrackTintColor="rgba(255,255,255,0.3)"
                thumbTintColor={Colors.white}
              />
            </View>
          </View>
        );

      case 'photo-upload':
        return (
          <View style={styles.photoContainer}>
            {photoUri ? (
              <View style={styles.photoPreview}>
                <View style={styles.photoCircle}>
                  <Image source={{ uri: photoUri }} style={styles.photo} />
                </View>
                <TouchableOpacity
                  style={styles.changePhotoButton}
                  onPress={handlePickImage}
                >
                  <Ionicons name="refresh" size={20} color={Colors.text} />
                  <Text style={styles.changePhotoText}>Cambiar Foto</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoEmpty}>
                <TouchableOpacity
                  style={styles.photoPlaceholder}
                  onPress={handlePickImage}
                  activeOpacity={0.8}
                >
                  <View style={styles.photoCircleEmpty}>
                    <View style={styles.userIconContainer}>
                      <View style={styles.userIconHead} />
                      <View style={styles.userIconBody} />
                    </View>
                    <Text style={styles.photoPlaceholderText}>Subir Foto</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.photoActions}>
                  <TouchableOpacity
                    style={styles.photoActionButton}
                    onPress={handleTakePhoto}
                  >
                    <Ionicons name="camera" size={32} color={Colors.secondary} />
                    <Text style={styles.photoActionText}>Cámara</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.photoActionButton}
                    onPress={handlePickImage}
                  >
                    <Ionicons name="images" size={32} color={Colors.secondary} />
                    <Text style={styles.photoActionText}>Galería</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        );

      case 'multi-select':
        return (
          <View style={styles.multiSelectContainer}>
            {selectedOptions.map((sport, index) => (
              <View key={index} style={styles.selectedSport}>
                <Text style={styles.selectedSportIcon}>🚴</Text>
                <Text style={styles.selectedSportText}>{sport}</Text>
                <TouchableOpacity onPress={() => toggleMultiSelect(sport)}>
                  <Text style={styles.removeSport}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TextInput
              style={styles.textInput}
              value={textInput}
              onChangeText={setTextInput}
              placeholder={question.placeholder || 'Escribe tu deporte...'}
              placeholderTextColor={Colors.textSecondary}
              onSubmitEditing={() => {
                if (textInput.trim()) {
                  setSelectedOptions([...selectedOptions, textInput]);
                  setTextInput('');
                }
              }}
            />
          </View>
        );

      case 'sport-search':
        return (
          <View style={styles.sportSearchContainer}>
            {/* Selected Sports */}
            {selectedSports.length > 0 && (
              <View style={styles.selectedSportsContainer}>
                {selectedSports.map((sport, index) => (
                  <View key={index} style={styles.selectedSportChip}>
                    <Text style={styles.selectedSportChipText}>{sport}</Text>
                    <TouchableOpacity onPress={() => toggleSport(sport)}>
                      <Text style={styles.removeSportChip}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Search Input */}
            <View style={styles.searchInputContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={question.placeholder || 'Busca tu deporte...'}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            {/* Sports List */}
            <ScrollView style={styles.sportsList} nestedScrollEnabled>
              {filteredSports.map((sport, index) => {
                const isSelected = selectedSports.includes(sport);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.sportItem,
                      isSelected && styles.sportItemSelected,
                    ]}
                    onPress={() => toggleSport(sport)}
                  >
                    <Text
                      style={[
                        styles.sportItemText,
                        isSelected && styles.sportItemTextSelected,
                      ]}
                    >
                      {sport}
                    </Text>
                    {isSelected && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.question}>{question.question}</Text>
          {question.subtitle && (
            <Text style={styles.subtitle}>{question.subtitle}</Text>
          )}

          {renderQuestionContent()}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Siguiente"
            onPress={handleNext}
            disabled={!canProceed() || isNavigating}
            fullWidth
            style={styles.button}
          />
          <TouchableOpacity onPress={handleNext} disabled={isNavigating}>
            <Text style={styles.skipText}>Omitir</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warning,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: Colors.text,
    marginTop: -4,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.text,
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  question: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
    fontFamily: Typography.fontFamily.semibold,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: Spacing.xl,
    fontFamily: Typography.fontFamily.regular,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  option: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: Colors.secondary,
    backgroundColor: `${Colors.secondary}10`,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: Typography.fontFamily.regular,
  },
  optionTextSelected: {
    fontFamily: Typography.fontFamily.semibold,
  },
  inputContainer: {
    marginTop: Spacing.lg,
  },
  textInput: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 16,
    fontSize: 16,
    color: Colors.text,
    fontFamily: Typography.fontFamily.regular,
  },
  sliderContainer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  valueDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  valueNumber: {
    fontSize: 96,
    fontWeight: '900',
    color: Colors.text,
    fontFamily: Typography.fontFamily.extrabold,
  },
  valueUnit: {
    fontSize: 48,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: Spacing.sm,
    fontFamily: Typography.fontFamily.semibold,
  },
  sliderWrapper: {
    width: '100%',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  slider: {
    width: '100%',
    height: 60,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.xs,
  },
  rangeLabel: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: Typography.fontFamily.medium,
    opacity: 0.7,
  },
  photoContainer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  photoEmpty: {
    alignItems: 'center',
    width: '100%',
  },
  photoPlaceholder: {
    marginBottom: Spacing.xxl,
  },
  photoCircleEmpty: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 3,
    borderColor: Colors.white,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  userIconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  userIconHead: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 4,
  },
  userIconBody: {
    width: 60,
    height: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  photoPlaceholderText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: Typography.fontFamily.semibold,
  },
  photoActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  photoActionButton: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: 20,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  photoActionText: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: Typography.fontFamily.semibold,
    marginTop: 4,
  },
  photoPreview: {
    alignItems: 'center',
  },
  photoCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: Colors.white,
    marginBottom: Spacing.xl,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 20,
  },
  changePhotoText: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: Typography.fontFamily.semibold,
  },
  multiSelectContainer: {
    gap: Spacing.md,
  },
  selectedSport: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  selectedSportIcon: {
    fontSize: 20,
  },
  selectedSportText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontFamily: Typography.fontFamily.regular,
  },
  removeSport: {
    fontSize: 20,
    color: Colors.textSecondary,
    padding: Spacing.xs,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  button: {
    backgroundColor: '#1A7F8E',
    borderRadius: 28,
    height: 56,
  },
  skipText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontFamily: Typography.fontFamily.medium,
  },
  sportSearchContainer: {
    flex: 1,
  },
  selectedSportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  selectedSportChip: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  selectedSportChipText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Typography.fontFamily.medium,
  },
  removeSportChip: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInputContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    fontFamily: Typography.fontFamily.regular,
  },
  sportsList: {
    maxHeight: 400,
  },
  sportItem: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sportItemSelected: {
    backgroundColor: `${Colors.secondary}10`,
    borderColor: Colors.secondary,
  },
  sportItemText: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: Typography.fontFamily.regular,
  },
  sportItemTextSelected: {
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.secondary,
  },
  checkmark: {
    fontSize: 20,
    color: Colors.secondary,
    fontWeight: 'bold',
  },
});

export default QuestionScreen;
