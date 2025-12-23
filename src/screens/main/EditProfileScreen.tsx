import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RootStackScreenProps } from '../../navigation/types';
import { Button, Input, Card, Avatar, LoadingSpinner } from '../../components';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../context/ToastContext';
import { useForm } from '../../hooks/useForm';
import api from '../../services/api';

type Props = RootStackScreenProps<'EditProfile'>;

interface ProfileFormData {
  full_name: string;
  email: string;
  age: string;
  height: string;
  weight: string;
  sex: 'M' | 'F' | '';
}

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const validateForm = (values: ProfileFormData) => {
    const errors: Record<string, string> = {};

    if (!values.full_name.trim()) {
      errors.full_name = 'El nombre es requerido';
    }

    if (!values.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email inválido';
    }

    if (values.age && (parseInt(values.age) < 1 || parseInt(values.age) > 120)) {
      errors.age = 'Edad inválida';
    }

    if (values.height && (parseFloat(values.height) < 50 || parseFloat(values.height) > 250)) {
      errors.height = 'Altura inválida (50-250 cm)';
    }

    if (values.weight && (parseFloat(values.weight) < 20 || parseFloat(values.weight) > 300)) {
      errors.weight = 'Peso inválido (20-300 kg)';
    }

    return errors;
  };

  const handleSubmit = async (values: ProfileFormData) => {
    try {
      setLoading(true);

      const profileData = {
        full_name: values.full_name,
        email: values.email,
        age: values.age ? parseInt(values.age) : undefined,
        height: values.height ? parseFloat(values.height) : undefined,
        weight: values.weight ? parseFloat(values.weight) : undefined,
        sex: values.sex || undefined,
      };

      const response = await api.patch('/users/me', profileData);
      setUser(response.data);
      showSuccess('Perfil actualizado correctamente');
      navigation.goBack();
    } catch (err: any) {
      const message = err.response?.data?.detail || 'No se pudo actualizar el perfil';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const { values, errors, handleChange, handleSubmit: onSubmit } = useForm<ProfileFormData>({
    initialValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      age: user?.age?.toString() || '',
      height: user?.height?.toString() || '',
      weight: user?.weight?.toString() || '',
      sex: user?.sex || '',
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <Avatar name={values.full_name} imageUrl={user?.avatar_url} size="xlarge" />
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>Cambiar Foto</Text>
        </TouchableOpacity>
      </View>

      {/* Personal Information */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        <Input
          label="Nombre Completo"
          value={values.full_name}
          onChangeText={(text) => handleChange('full_name', text)}
          error={errors.full_name}
          placeholder="Juan Pérez"
          autoCapitalize="words"
        />

        <Input
          label="Email"
          value={values.email}
          onChangeText={(text) => handleChange('email', text)}
          error={errors.email}
          placeholder="juan@empresa.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </Card>

      {/* Physical Data */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Datos Físicos</Text>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input
              label="Edad"
              value={values.age}
              onChangeText={(text) => handleChange('age', text)}
              error={errors.age}
              placeholder="30"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.halfInput}>
            <Text style={styles.label}>Sexo</Text>
            <View style={styles.sexButtons}>
              <TouchableOpacity
                style={[styles.sexButton, values.sex === 'M' && styles.sexButtonActive]}
                onPress={() => handleChange('sex', 'M')}
              >
                <Text
                  style={[styles.sexButtonText, values.sex === 'M' && styles.sexButtonTextActive]}
                >
                  M
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sexButton, values.sex === 'F' && styles.sexButtonActive]}
                onPress={() => handleChange('sex', 'F')}
              >
                <Text
                  style={[styles.sexButtonText, values.sex === 'F' && styles.sexButtonTextActive]}
                >
                  F
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input
              label="Altura (cm)"
              value={values.height}
              onChangeText={(text) => handleChange('height', text)}
              error={errors.height}
              placeholder="175"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.halfInput}>
            <Input
              label="Peso (kg)"
              value={values.weight}
              onChangeText={(text) => handleChange('weight', text)}
              error={errors.weight}
              placeholder="70"
              keyboardType="decimal-pad"
            />
          </View>
        </View>
      </Card>

      {/* Save Button */}
      <Button
        title={loading ? 'Guardando...' : 'Guardar Cambios'}
        onPress={onSubmit}
        disabled={loading}
        size="large"
        fullWidth
      />

      {/* Cancel Button */}
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  changePhotoButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  changePhotoText: {
    fontSize: Typography.size.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  card: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sexButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sexButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  sexButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sexButtonText: {
    fontSize: Typography.size.md,
    fontWeight: '600',
    color: Colors.text,
  },
  sexButtonTextActive: {
    color: Colors.white,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  cancelButtonText: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
