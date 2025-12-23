import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { AuthStackScreenProps } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Spacing, Colors, Typography } from '../../constants/theme';

type Props = AuthStackScreenProps<'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
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
            onPress={() => {
              // TODO: Implement actual login screen
              navigation.navigate('Register');
            }}
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
});

export default LoginScreen;
