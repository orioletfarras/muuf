import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { MainTabCompositeProps } from '../../navigation/types';
import { useAuthStore } from '../../stores/authStore';
import { useStatsStore } from '../../stores/statsStore';
import {
  Card,
  Button,
  LoadingSpinner,
  ProgressBar,
  Avatar,
  StatCard,
  BadgeComponent,
} from '../../components';
import { useRefreshOnFocus } from '../../hooks/useRefreshOnFocus';
import { Colors, Spacing, Typography } from '../../constants/theme';

type Props = MainTabCompositeProps<'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { ritmo, balance, fetchRitmo, fetchBalance, isLoading } =
    useStatsStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const loadData = async () => {
    await Promise.all([fetchRitmo(), fetchBalance()]);
  };

  useEffect(() => {
    loadData();
  }, []);

  useRefreshOnFocus(loadData);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getRitmoColor = (percentage: number) => {
    if (percentage >= 100) return Colors.success;
    if (percentage >= 75) return Colors.primary;
    if (percentage >= 50) return Colors.warning;
    return Colors.error;
  };

  const getBalanceColor = (percentage: number) => {
    if (percentage >= 80) return Colors.success;
    if (percentage >= 60) return Colors.primary;
    if (percentage >= 40) return Colors.warning;
    return Colors.error;
  };

  if (isLoading && !ritmo && !balance) {
    return <LoadingSpinner message="Cargando tu dashboard..." fullScreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            name={user?.full_name}
            imageUrl={user?.avatar_url}
            size="large"
          />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Hola, {user?.full_name || 'Usuario'}!</Text>
            <Text style={styles.subtitle}>¿Listo para moverte hoy?</Text>
          </View>
        </View>
      </View>

      {/* Ritmo Card */}
      {ritmo && (
        <Card title="Tu Ritmo Semanal" elevated>
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                {ritmo.current_minutes_weekly} / {ritmo.target_minutes_weekly} minutos
              </Text>
              <BadgeComponent
                label={ritmo.is_on_track ? 'En camino' : 'Mejora'}
                variant={ritmo.is_on_track ? 'success' : 'warning'}
                size="small"
              />
            </View>
            <ProgressBar
              progress={ritmo.ritmo_percentage}
              height={12}
              color={getRitmoColor(ritmo.ritmo_percentage)}
              animated
            />
            <Text style={styles.progressSubtext}>
              {ritmo.is_on_track
                ? '¡Vas por buen camino!'
                : `Faltan ${ritmo.minutes_remaining} minutos`}
            </Text>
          </View>
          {ritmo.incentive && (
            <View style={styles.incentive}>
              <Text style={styles.incentiveText}>{ritmo.incentive.message}</Text>
            </View>
          )}
        </Card>
      )}

      {/* Balance Card */}
      {balance && (
        <Card title="Balance de Actividades" elevated>
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                {balance.total_minutes_last_30_days} min en 30 días
              </Text>
              <BadgeComponent
                label={balance.is_balanced ? 'Equilibrado' : 'Mejorable'}
                variant={balance.is_balanced ? 'success' : 'info'}
                size="small"
              />
            </View>
            <ProgressBar
              progress={balance.balance_percentage}
              height={12}
              color={getBalanceColor(balance.balance_percentage)}
              animated
            />
            <Text style={styles.progressSubtext}>
              {balance.is_balanced
                ? 'Excelente distribución de actividades'
                : 'Trabaja en equilibrar tus actividades'}
            </Text>
          </View>
          {balance.recommendations.length > 0 && (
            <View style={styles.incentive}>
              <Text style={styles.incentiveText}>
                💡 {balance.recommendations[0].message}
              </Text>
            </View>
          )}
        </Card>
      )}

      {/* Quick Actions */}
      <Card title="Acciones Rápidas" elevated>
        <View style={styles.actionsContainer}>
          <Button
            title="➕ Nueva Actividad"
            onPress={() => navigation.navigate('CreateActivity')}
            fullWidth
            style={styles.actionButton}
          />
          <View style={styles.buttonRow}>
            <Button
              title="🏆 Ranking"
              onPress={() => navigation.navigate('Ranking')}
              variant="outline"
              style={styles.halfButton}
            />
            <Button
              title="🔔 Notificaciones"
              onPress={() => navigation.navigate('Notifications')}
              variant="outline"
              style={styles.halfButton}
            />
          </View>
          <View style={styles.buttonRow}>
            <Button
              title="🎯 Desafíos"
              onPress={() => navigation.navigate('Quests')}
              variant="secondary"
              style={styles.halfButton}
            />
            <Button
              title="👥 Equipo"
              onPress={() => navigation.navigate('Team')}
              variant="secondary"
              style={styles.halfButton}
            />
          </View>
        </View>
      </Card>
    </ScrollView>
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  greeting: {
    fontSize: Typography.size.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
  },
  progressSection: {
    marginBottom: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: Typography.size.md,
    fontWeight: '600',
    color: Colors.text,
  },
  progressSubtext: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  incentive: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
  },
  incentiveText: {
    fontSize: Typography.size.sm,
    color: Colors.text,
    textAlign: 'center',
  },
  actionsContainer: {
    gap: Spacing.sm,
  },
  actionButton: {
    marginBottom: Spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  halfButton: {
    flex: 1,
  },
});

export default HomeScreen;
