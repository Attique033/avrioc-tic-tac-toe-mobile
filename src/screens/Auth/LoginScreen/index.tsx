import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { REGEX } from '../../../utils/constants';
import { useAuthActions } from '../../../store/auth/useAuthActions';
import { colors } from '../../../theme/colors';
import BackgroundImage from '../../../components/BackgroundImage';
import { BlurView } from 'expo-blur';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const { loginUser } = useAuthActions();

  const handleLogin = () => {
    setErrors({ email: '', password: '' });
    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!REGEX.EMAIL.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email address' }));
      return;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      return;
    }

    loginUser({ email, password });
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BlurView tint={'light'} intensity={60} style={styles.card}>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome Back
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Sign in to continue
          </Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
            style={styles.input}
          />
          {errors.email ? (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.email}
            </Text>
          ) : null}

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={!!errors.password}
            style={styles.input}
          />
          {errors.password ? (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.password}
            </Text>
          ) : null}

          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Sign In
          </Button>

          <View style={styles.footer}>
            <Text variant="bodyMedium">Don't have an account? </Text>
            <Text
              variant="bodyMedium"
              style={styles.link}
              onPress={() => navigation.navigate('Register')}
            >
              Sign Up
            </Text>
          </View>
        </BlurView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.7,
  },
  input: {
    marginBottom: 8,
    backgroundColor: colors.transparent,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: colors.primary,
  },
});

export default LoginScreen;
