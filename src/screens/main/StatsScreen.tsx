import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { MainTabCompositeProps } from '../../navigation/types';
import { useStatsStore } from '../../stores/statsStore';
import { useActivityStore } from '../../stores/activityStore';
import {
  Card,
  StatCard,
  StreakCard,
  TabSelector,
  Tab,
  ProgressBar,
} from '../../components';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { useRefreshOnFocus } from '../../hooks/useRefreshOnFocus';

type Props = MainTabCompositeProps<'Stats'>;

const StatsScreen: React.FC<Props> = () => {
  const { ranking, ritmo, balance, fetchRanking, fetchRitmo, fetchBalance, isLoading } = useStatsStore();
  const { activities } = useActivityStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const loadData = async () => {
    await Promise.all([
      fetchRanking('weekly', 10),
      fetchRitmo(),
      fetchBalance(),
    ]);
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

  const periodTabs: Tab[] = [
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mes' },
    { id: 'all', label: 'Total' },
  ];

  // Calculate streak (mock data - should come from API)
  const currentStreak = 7;
  const longestStreak = 14;

  // Calculate stats by period
  const getStatsByPeriod = () => {
    const now = new Date();
    let filteredActivities = activities;

    if (selectedPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredActivities = activities.filter(a => new Date(a.created_at) >= weekAgo);
    } else if (selectedPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredActivities = activities.filter(a => new Date(a.created_at) >= monthAgo);
    }

    const totalActivities = filteredActivities.length;
    const totalPoints = filteredActivities.reduce((sum, a) => sum + a.final_points, 0);
    const totalMinutes = filteredActivities.reduce((sum, a) => sum + a.duration_minutes, 0);
    const totalDistance = filteredActivities.reduce((sum, a) => sum + (a.distance_km || 0), 0);

    return {
      totalActivities,
      totalPoints: Math.round(totalPoints),
      totalMinutes,
      totalDistance: totalDistance.toFixed(1),
    };
  };

  const stats = getStatsByPeriod();

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}º`;
  };

  if (isLoading && !ranking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estadísticas</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Period Selector */}
        <TabSelector
          tabs={periodTabs}
          selectedTab={selectedPeriod}
          onSelectTab={(id) => setSelectedPeriod(id as 'week' | 'month' | 'all')}
          style={styles.tabSelector}
        />

        {/* Streak Card */}
        <StreakCard
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          style={styles.card}
        />

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Actividades"
            value={stats.totalActivities.toString()}
            icon="🏃"
            style={styles.statCard}
          />
          <StatCard
            label="Puntos"
            value={stats.totalPoints.toString()}
            icon="⭐"
            style={styles.statCard}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Minutos"
            value={stats.totalMinutes.toString()}
            icon="⏱️"
            style={styles.statCard}
          />
          <StatCard
            label="Distancia (km)"
            value={stats.totalDistance}
            icon="📍"
            style={styles.statCard}
          />
        </View>

        {/* Ritmo Progress */}
        {ritmo && (
          <Card title="Ritmo Semanal" elevated style={styles.card}>
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>
                  {ritmo.current_minutes_weekly} / {ritmo.target_minutes_weekly} min
                </Text>
                <Text style={styles.progressPercent}>
                  {ritmo.ritmo_percentage.toFixed(0)}%
                </Text>
              </View>
              <ProgressBar
                progress={ritmo.ritmo_percentage}
                height={12}
                color={ritmo.is_on_track ? Colors.success : Colors.warning}
                animated
              />
              <Text style={styles.progressSubtext}>
                {ritmo.is_on_track ? '¡Vas por buen camino!' : `Faltan ${ritmo.minutes_remaining} minutos`}
              </Text>
            </View>
          </Card>
        )}

        {/* Balance Progress */}
        {balance && (
          <Card title="Balance de Actividades" elevated style={styles.card}>
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>
                  {balance.total_minutes_last_30_days} min (30 días)
                </Text>
                <Text style={styles.progressPercent}>
                  {balance.balance_percentage.toFixed(0)}%
                </Text>
              </View>
              <ProgressBar
                progress={balance.balance_percentage}
                height={12}
                color={balance.is_balanced ? Colors.success : Colors.info}
                animated
              />
              <Text style={styles.progressSubtext}>
                {balance.is_balanced
                  ? 'Excelente distribución'
                  : 'Trabaja en equilibrar tus actividades'}
              </Text>
            </View>
          </Card>
        )}

        {/* Ranking Preview */}
        {ranking?.user_position && (
          <Card title="Tu Posición en el Ranking" elevated style={styles.card}>
            <View style={styles.userPosition}>
              <Text style={styles.rankEmoji}>
                {getRankEmoji(ranking.user_position.rank)}
              </Text>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {ranking.user_position.full_name}
                </Text>
                <Text style={styles.userLevel}>
                  {ranking.user_position.level}
                </Text>
              </View>
              <Text style={styles.userPoints}>
                {ranking.user_position.points} pts
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  tabSelector: {
    marginBottom: Spacing.md,
  },
  card: {
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
  },
  progressContainer: {
    gap: Spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  progressPercent: {
    fontSize: Typography.size.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressSubtext: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  userPosition: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  rankEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.size.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  userLevel: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  userPoints: {
    fontSize: Typography.size.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default StatsScreen;
