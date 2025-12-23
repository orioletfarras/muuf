import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MainTabCompositeProps } from '../../navigation/types';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Colors, Spacing, Typography } from '../../constants/theme';

type Props = MainTabCompositeProps<'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const calculateBMI = () => {
    if (user?.height && user?.weight) {
      const heightInMeters = user.height / 100;
      const bmi = user.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Bajo peso', color: Colors.warning };
    if (bmi < 25) return { text: 'Normal', color: Colors.success };
    if (bmi < 30) return { text: 'Sobrepeso', color: Colors.warning };
    return { text: 'Obesidad', color: Colors.error };
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* User Info Card */}
        <Card elevated>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.full_name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.full_name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </Card>

        {/* Personal Info */}
        <Card title="Información Personal" elevated>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha de nacimiento</Text>
            <Text style={styles.infoValue}>
              {user?.date_of_birth
                ? new Date(user.date_of_birth).toLocaleDateString('es-ES')
                : 'No especificada'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sexo</Text>
            <Text style={styles.infoValue}>
              {user?.sex === 'M' ? 'Masculino' : user?.sex === 'F' ? 'Femenino' : 'No especificado'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Altura</Text>
            <Text style={styles.infoValue}>
              {user?.height ? `${user.height} cm` : 'No especificada'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Peso</Text>
            <Text style={styles.infoValue}>
              {user?.weight ? `${user.weight} kg` : 'No especificado'}
            </Text>
          </View>
          {bmi && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>IMC</Text>
              <Text style={[styles.infoValue, { color: bmiCategory?.color }]}>
                {bmi} ({bmiCategory?.text})
              </Text>
            </View>
          )}
        </Card>

        {/* Account Info */}
        <Card title="Cuenta" elevated>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado</Text>
            <Text
              style={[
                styles.infoValue,
                { color: user?.is_active ? Colors.success : Colors.error },
              ]}
            >
              {user?.is_active ? 'Activa' : 'Inactiva'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Onboarding</Text>
            <Text style={styles.infoValue}>
              {user?.onboarding_completed ? 'Completado' : 'Pendiente'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Miembro desde</Text>
            <Text style={styles.infoValue}>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('es-ES')
                : 'Desconocido'}
            </Text>
          </View>
        </Card>

        {/* Actions */}
        <Card elevated>
          <Button
            title="Editar Perfil"
            onPress={() => navigation.navigate('EditProfile')}
            variant="secondary"
            fullWidth
            style={styles.actionButton}
          />
          <Button
            title="🏅 Ver Insignias"
            onPress={() => navigation.navigate('Badges')}
            variant="outline"
            fullWidth
            style={styles.actionButton}
          />
          <Button
            title="👥 Mi Equipo"
            onPress={() => navigation.navigate('Team')}
            variant="outline"
            fullWidth
            style={styles.actionButton}
          />
          <Button
            title="🎯 Desafíos"
            onPress={() => navigation.navigate('Quests')}
            variant="outline"
            fullWidth
            style={styles.actionButton}
          />
          <Button
            title="⚙️ Configuración"
            onPress={() => navigation.navigate('Settings')}
            variant="outline"
            fullWidth
            style={styles.actionButton}
          />
          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="danger"
            fullWidth
          />
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.white,
  },
  userName: {
    fontSize: Typography.size.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: Typography.size.md,
    fontWeight: '600',
    color: Colors.text,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
});

export default ProfileScreen;
