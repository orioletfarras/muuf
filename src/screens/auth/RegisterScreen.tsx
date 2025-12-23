import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackScreenProps } from '../../navigation/types';
import { useAuthStore } from '../../stores/authStore';
import { useQuestionnaireStore } from '../../stores/questionnaireStore';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Colors, Spacing, Typography } from '../../constants/theme';

type Props = AuthStackScreenProps<'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const { isLoading, error, clearError } = useAuthStore();
  const { setRegistrationData } = useQuestionnaireStore();

  const handleRegister = async () => {
    if (!email || !fullName) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor introduce un email válido');
      return;
    }

    // Save registration data
    setRegistrationData({ email, password: '', full_name: fullName });

    try {
      // Send OTP to email
      const { sendOTP } = useAuthStore.getState();
      await sendOTP(email);

      // Navigate to OTP verification screen
      navigation.navigate('OTPVerification', { email });
    } catch (error: any) {
      console.error('Send OTP error:', error);
      Alert.alert(
        'Error',
        error.message || 'No se pudo enviar el código. Intenta de nuevo.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logo-muuf.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Únete al reto</Text>
          <Text style={styles.subtitle}>
            Crea tu cuenta para empezar tu viaje de bienestar
          </Text>

          <View style={styles.form}>
            <Input
              label="Nombre completo"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                clearError();
              }}
              placeholder="Juan Pérez"
              autoCapitalize="words"
              autoComplete="name"
            />

            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError();
              }}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Text style={styles.otpNote}>
              Recibirás un código de verificación en tu email
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Continuar"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            style={styles.registerButton}
          />
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  logo: {
    width: 200,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
    fontFamily: Typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: Spacing.xl,
    fontFamily: Typography.fontFamily.regular,
    opacity: 0.7,
    lineHeight: 22,
  },
  form: {
    gap: Spacing.md,
  },
  error: {
    color: Colors.error,
    fontSize: Typography.size.sm,
    textAlign: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.sm,
    borderRadius: 8,
  },
  otpNote: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    fontFamily: Typography.fontFamily.regular,
    opacity: 0.7,
    marginTop: Spacing.sm,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  registerButton: {
    backgroundColor: '#1A7F8E',
    borderRadius: 28,
    height: 56,
  },
});

export default RegisterScreen;
