import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { RootStackScreenProps } from '../../navigation/types';
import { Card } from '../../components';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../context/ToastContext';

type Props = RootStackScreenProps<'Settings'>;

interface SettingsOption {
  id: string;
  title: string;
  description?: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  icon?: string;
  destructive?: boolean;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { showSuccess, showError } = useToast();

  const [notifications, setNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: () => {
          logout();
          showSuccess('Sesión cerrada correctamente');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      'Esta acción eliminará permanentemente tu cuenta y todos tus datos. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion
            showError('Función no disponible aún');
          },
        },
      ]
    );
  };

  const notificationSettings: SettingsOption[] = [
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Activar o desactivar todas las notificaciones',
      type: 'toggle',
      value: notifications,
      onToggle: setNotifications,
    },
    {
      id: 'push',
      title: 'Notificaciones Push',
      description: 'Recibir notificaciones en el dispositivo',
      type: 'toggle',
      value: pushNotifications,
      onToggle: setPushNotifications,
    },
    {
      id: 'email',
      title: 'Notificaciones por Email',
      description: 'Recibir notificaciones por correo electrónico',
      type: 'toggle',
      value: emailNotifications,
      onToggle: setEmailNotifications,
    },
    {
      id: 'weekly',
      title: 'Reporte Semanal',
      description: 'Recibir resumen semanal de actividades',
      type: 'toggle',
      value: weeklyReport,
      onToggle: setWeeklyReport,
    },
  ];

  const accountSettings: SettingsOption[] = [
    {
      id: 'edit-profile',
      title: 'Editar Perfil',
      description: 'Actualizar información personal',
      type: 'navigation',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'change-password',
      title: 'Cambiar Contraseña',
      type: 'navigation',
      onPress: () => {
        // TODO: Implement change password
        showError('Función no disponible aún');
      },
    },
  ];

  const appSettings: SettingsOption[] = [
    {
      id: 'privacy',
      title: 'Privacidad',
      description: 'Configuración de privacidad de datos',
      type: 'navigation',
      onPress: () => {
        // TODO: Implement privacy settings
        showError('Función no disponible aún');
      },
    },
    {
      id: 'about',
      title: 'Acerca de',
      description: 'Versión 1.0.0',
      type: 'navigation',
      onPress: () => {
        Alert.alert('MUUF', 'Versión 1.0.0\n\n© 2024 MUUF Team');
      },
    },
    {
      id: 'terms',
      title: 'Términos y Condiciones',
      type: 'navigation',
      onPress: () => {
        // TODO: Implement terms screen
        showError('Función no disponible aún');
      },
    },
  ];

  const dangerZone: SettingsOption[] = [
    {
      id: 'logout',
      title: 'Cerrar Sesión',
      type: 'action',
      onPress: handleLogout,
    },
    {
      id: 'delete',
      title: 'Eliminar Cuenta',
      type: 'action',
      destructive: true,
      onPress: handleDeleteAccount,
    },
  ];

  const renderSettingItem = (item: SettingsOption) => {
    if (item.type === 'toggle') {
      return (
        <View key={item.id} style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            {item.description && <Text style={styles.settingDescription}>{item.description}</Text>}
          </View>
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingInfo}>
          <Text
            style={[
              styles.settingTitle,
              item.destructive && styles.settingTitleDestructive,
            ]}
          >
            {item.title}
          </Text>
          {item.description && <Text style={styles.settingDescription}>{item.description}</Text>}
        </View>
        {item.type === 'navigation' && <Text style={styles.chevron}>›</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Info */}
      <Card style={styles.userCard}>
        <Text style={styles.userName}>{user?.full_name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </Card>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        <Card style={styles.card}>
          {notificationSettings.map((item, index) => (
            <View key={item.id}>
              {renderSettingItem(item)}
              {index < notificationSettings.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <Card style={styles.card}>
          {accountSettings.map((item, index) => (
            <View key={item.id}>
              {renderSettingItem(item)}
              {index < accountSettings.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aplicación</Text>
        <Card style={styles.card}>
          {appSettings.map((item, index) => (
            <View key={item.id}>
              {renderSettingItem(item)}
              {index < appSettings.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zona Peligrosa</Text>
        <Card style={styles.card}>
          {dangerZone.map((item, index) => (
            <View key={item.id}>
              {renderSettingItem(item)}
              {index < dangerZone.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>
      </View>
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
  userCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
  },
  userName: {
    fontSize: Typography.size.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontSize: Typography.size.md,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  settingTitleDestructive: {
    color: Colors.error,
  },
  settingDescription: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.md,
  },
});

export default SettingsScreen;
