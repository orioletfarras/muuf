import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackScreenProps } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useQuestionnaireStore } from '../../stores/questionnaireStore';

type Props = AuthStackScreenProps<'OTPVerification'>;

const OTPVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email } = route.params;
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { registrationData } = useQuestionnaireStore();

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    // Handle iOS autofill - when full code is pasted
    if (value.length === OTP_LENGTH) {
      const digits = value.split('');
      setOtp(digits);
      // Focus last input
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== OTP_LENGTH) {
      Alert.alert('Error', `Por favor introduce el código de ${OTP_LENGTH} dígitos`);
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'email',
      });

      if (error) throw error;

      if (data.user) {
        // Update user metadata with full name
        if (registrationData?.full_name) {
          await supabase.auth.updateUser({
            data: { full_name: registrationData.full_name },
          });
        }

        // Navigation will happen automatically via RootNavigator
        // When isAuthenticated becomes true, RootNavigator will show Questionnaire
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      Alert.alert(
        'Error',
        error.message === 'Invalid token'
          ? 'Código incorrecto. Por favor verifica e intenta de nuevo.'
          : 'Hubo un error al verificar el código. Intenta de nuevo.'
      );
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      Alert.alert('Éxito', 'Se ha enviado un nuevo código a tu email');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'No se pudo enviar el código. Intenta de nuevo.');
    } finally {
      setIsResending(false);
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

        <View style={styles.content}>
          <View style={styles.messageContainer}>
            <Text style={styles.icon}>📧</Text>
            <Text style={styles.title}>Verifica tu email</Text>
            <Text style={styles.subtitle}>
              Hemos enviado un código de 6 dígitos a{'\n'}
              <Text style={styles.email}>{email}</Text>
            </Text>

            {/* OTP Input */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[styles.otpInput, digit && styles.otpInputFilled]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoFocus={index === 0}
                  textContentType={index === 0 ? "oneTimeCode" : "none"}
                  autoComplete={index === 0 ? "sms-otp" : "off"}
                />
              ))}
            </View>

            {/* Resend Code */}
            <TouchableOpacity onPress={handleResendOtp} disabled={isResending} style={styles.resendContainer}>
              {isResending ? (
                <ActivityIndicator size="small" color={Colors.secondary} />
              ) : (
                <Text style={styles.resendText}>¿No recibiste el código? Reenviar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          <Button
            title="Verificar"
            onPress={handleVerifyOtp}
            loading={isVerifying}
            disabled={isVerifying || otp.join('').length !== OTP_LENGTH}
            fullWidth
            style={styles.verifyButton}
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
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: Spacing.xxl,
    fontFamily: Typography.fontFamily.regular,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  email: {
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.text,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    fontSize: 24,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#1A7F8E',
    backgroundColor: Colors.white,
  },
  resendContainer: {
    marginTop: Spacing.lg,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 15,
    color: '#1A7F8E',
    fontFamily: Typography.fontFamily.semibold,
  },
  verifyButton: {
    backgroundColor: '#1A7F8E',
    borderRadius: 28,
    height: 56,
  },
});

export default OTPVerificationScreen;
