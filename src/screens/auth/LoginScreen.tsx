import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackScreenProps } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Spacing, Colors, Typography } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';

type Props = AuthStackScreenProps<'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor introduce tu email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor introduce un email válido');
      return;
    }

    setIsLoading(true);
    try {
      // Send OTP to email
      const { sendOTP } = useAuthStore.getState();
      await sendOTP(email);

      console.log('Login OTP sent successfully, navigating to OTPVerification...');

      // Navigate to OTP verification screen
      navigation.navigate('OTPVerification', { email });

      console.log('Navigation called from Login');
    } catch (error: any) {
      console.error('Send OTP error from login:', error);
      Alert.alert(
        'Error',
        error.message || 'No se pudo enviar el código. Intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (showLoginForm) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => setShowLoginForm(false)}>
              <Ionicons name="chevron-back" size={28} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <View style={styles.logoContainerSmall}>
              <Image
                source={require('../../../assets/logo-muuf.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Inicia sesión</Text>
            <Text style={styles.subtitle}>
              Introduce tu email para recibir un código de acceso
            </Text>

            <View style={styles.form}>
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
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.loginButtonForm}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/logo-muuf.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Image
            source={require('../../../assets/tagline-muuf.png')}
            style={styles.taglineImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="¡Únete al reto!"
            onPress={() => navigation.navigate('Register')}
            fullWidth
            style={styles.joinButton}
            textStyle={styles.joinButtonText}
          />

          <Button
            title="Ya tengo una cuenta"
            onPress={() => setShowLoginForm(true)}
            variant="outline"
            fullWidth
            style={styles.loginButton}
            textStyle={styles.loginButtonText}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warning, // Amarillo MUUF
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoImage: {
    width: 300,
    height: 140,
    marginBottom: 12,
  },
  taglineImage: {
    width: 220,
    height: 30,
  },
  buttonContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  joinButton: {
    backgroundColor: '#1A7F8E',
    borderRadius: 28,
    height: 56,
  },
  joinButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: Typography.fontFamily.semibold,
  },
  loginButton: {
    backgroundColor: Colors.warning,
    borderColor: '#1A7F8E',
    borderWidth: 2,
    borderRadius: 28,
    height: 56,
  },
  loginButtonText: {
    color: '#1A7F8E',
    fontSize: 18,
    fontFamily: Typography.fontFamily.semibold,
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
  logoContainerSmall: {
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
  loginButtonForm: {
    backgroundColor: '#1A7F8E',
    borderRadius: 28,
    height: 56,
  },
});

export default LoginScreen;
