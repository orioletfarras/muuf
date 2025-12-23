import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { RootStackScreenProps } from '../../navigation/types';
import {
  Card,
  Avatar,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from '../../components';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';

type Props = RootStackScreenProps<'Ranking'>;

interface RankingUser {
  id: number;
  full_name: string;
  avatar_url?: string;
  total_points: number;
  activities_count: number;
  rank: number;
  rank_change?: number; // +1, -1, 0 for position change
}

type RankingPeriod = 'weekly' | 'monthly' | 'all_time';
type RankingScope = 'global' | 'team';

const RankingScreen: React.FC<Props> = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [period, setPeriod] = useState<RankingPeriod>('weekly');
  const [scope, setScope] = useState<RankingScope>('team');

  useEffect(() => {
    loadRankings();
  }, [period, scope]);

  const loadRankings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/rankings', {
        params: { period, scope },
      });
      setRankings(response.data);
    } catch (err: any) {
      setError('No se pudo cargar el ranking');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRankings();
    setRefreshing(false);
  };

  const getMedalEmoji = (rank: number): string => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  const getRankChangeIcon = (change?: number): string => {
    if (!change) return '—';
    if (change > 0) return '⬆️';
    if (change < 0) return '⬇️';
    return '—';
  };

  const renderPodium = () => {
    if (rankings.length < 3) return null;

    const top3 = rankings.slice(0, 3);
    const [gold, silver, bronze] = top3;

    return (
      <View style={styles.podium}>
        {/* Silver - 2nd place */}
        <View style={styles.podiumPosition}>
          <View style={[styles.podiumAvatar, styles.silverAvatar]}>
            <Avatar name={silver.full_name} imageUrl={silver.avatar_url} size="large" />
          </View>
          <Text style={styles.podiumMedal}>🥈</Text>
          <Text style={styles.podiumName} numberOfLines={1}>
            {silver.full_name}
          </Text>
          <Text style={styles.podiumPoints}>{silver.total_points.toFixed(0)} pts</Text>
          <View style={[styles.podiumBase, styles.silverBase]}>
            <Text style={styles.podiumRank}>2</Text>
          </View>
        </View>

        {/* Gold - 1st place */}
        <View style={styles.podiumPosition}>
          <View style={[styles.podiumAvatar, styles.goldAvatar]}>
            <Avatar name={gold.full_name} imageUrl={gold.avatar_url} size="xlarge" />
          </View>
          <Text style={styles.podiumMedal}>🥇</Text>
          <Text style={styles.podiumName} numberOfLines={1}>
            {gold.full_name}
          </Text>
          <Text style={styles.podiumPoints}>{gold.total_points.toFixed(0)} pts</Text>
          <View style={[styles.podiumBase, styles.goldBase]}>
            <Text style={styles.podiumRank}>1</Text>
          </View>
        </View>

        {/* Bronze - 3rd place */}
        <View style={styles.podiumPosition}>
          <View style={[styles.podiumAvatar, styles.bronzeAvatar]}>
            <Avatar name={bronze.full_name} imageUrl={bronze.avatar_url} size="medium" />
          </View>
          <Text style={styles.podiumMedal}>🥉</Text>
          <Text style={styles.podiumName} numberOfLines={1}>
            {bronze.full_name}
          </Text>
          <Text style={styles.podiumPoints}>{bronze.total_points.toFixed(0)} pts</Text>
          <View style={[styles.podiumBase, styles.bronzeBase]}>
            <Text style={styles.podiumRank}>3</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderRankingItem = ({ item }: { item: RankingUser }) => {
    const isCurrentUser = item.id === user?.id;
    const medal = getMedalEmoji(item.rank);

    // Skip top 3 as they're shown in podium
    if (item.rank <= 3) return null;

    return (
      <Card style={[styles.rankingCard, isCurrentUser && styles.currentUserCard]}>
        <View style={styles.rankingContent}>
          <View style={styles.rankSection}>
            <Text style={styles.rankNumber}>{item.rank}</Text>
            <Text style={styles.rankChange}>{getRankChangeIcon(item.rank_change)}</Text>
          </View>

          <Avatar name={item.full_name} imageUrl={item.avatar_url} size="medium" />

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {item.full_name}
              {isCurrentUser && <Text style={styles.youBadge}> (Tú)</Text>}
            </Text>
            <Text style={styles.activitiesCount}>{item.activities_count} actividades</Text>
          </View>

          <View style={styles.pointsSection}>
            <Text style={styles.points}>{item.total_points.toFixed(0)}</Text>
            <Text style={styles.pointsLabel}>pts</Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Period Selector */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Período</Text>
        <View style={styles.selector}>
          <TouchableOpacity
            style={[styles.selectorButton, period === 'weekly' && styles.selectorButtonActive]}
            onPress={() => setPeriod('weekly')}
          >
            <Text
              style={[
                styles.selectorButtonText,
                period === 'weekly' && styles.selectorButtonTextActive,
              ]}
            >
              Semanal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectorButton, period === 'monthly' && styles.selectorButtonActive]}
            onPress={() => setPeriod('monthly')}
          >
            <Text
              style={[
                styles.selectorButtonText,
                period === 'monthly' && styles.selectorButtonTextActive,
              ]}
            >
              Mensual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectorButton, period === 'all_time' && styles.selectorButtonActive]}
            onPress={() => setPeriod('all_time')}
          >
            <Text
              style={[
                styles.selectorButtonText,
                period === 'all_time' && styles.selectorButtonTextActive,
              ]}
            >
              Histórico
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scope Selector */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Alcance</Text>
        <View style={styles.selector}>
          <TouchableOpacity
            style={[styles.selectorButton, scope === 'team' && styles.selectorButtonActive]}
            onPress={() => setScope('team')}
          >
            <Text
              style={[
                styles.selectorButtonText,
                scope === 'team' && styles.selectorButtonTextActive,
              ]}
            >
              Mi Equipo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectorButton, scope === 'global' && styles.selectorButtonActive]}
            onPress={() => setScope('global')}
          >
            <Text
              style={[
                styles.selectorButtonText,
                scope === 'global' && styles.selectorButtonTextActive,
              ]}
            >
              Global
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderPodium()}

      {rankings.length > 3 && <Text style={styles.restTitle}>Resto del Ranking</Text>}
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={loadRankings} />
      </View>
    );
  }

  if (rankings.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="🏆"
          title="No hay datos de ranking"
          message="Completa actividades para aparecer en el ranking"
        />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={rankings}
      renderItem={renderRankingItem}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xl,
  },
  header: {
    padding: Spacing.md,
  },
  selectorContainer: {
    marginBottom: Spacing.md,
  },
  selectorLabel: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  selector: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: 4,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  selectorButtonActive: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorButtonText: {
    fontSize: Typography.size.sm,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  selectorButtonTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  podiumPosition: {
    alignItems: 'center',
    flex: 1,
  },
  podiumAvatar: {
    marginBottom: Spacing.xs,
  },
  goldAvatar: {
    transform: [{ scale: 1.1 }],
  },
  silverAvatar: {
    transform: [{ scale: 0.95 }],
  },
  bronzeAvatar: {
    transform: [{ scale: 0.9 }],
  },
  podiumMedal: {
    fontSize: 24,
    marginBottom: 4,
  },
  podiumName: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  podiumPoints: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  podiumBase: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
    alignItems: 'center',
  },
  goldBase: {
    backgroundColor: '#FFD700',
    height: 80,
  },
  silverBase: {
    backgroundColor: '#C0C0C0',
    height: 60,
  },
  bronzeBase: {
    backgroundColor: '#CD7F32',
    height: 40,
  },
  podiumRank: {
    fontSize: Typography.size.xl,
    fontWeight: '700',
    color: Colors.white,
  },
  restTitle: {
    fontSize: Typography.size.md,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  rankingCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  currentUserCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}05`,
  },
  rankingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rankSection: {
    width: 50,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: Typography.size.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  rankChange: {
    fontSize: Typography.size.xs,
    marginTop: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.size.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  youBadge: {
    color: Colors.primary,
    fontSize: Typography.size.sm,
  },
  activitiesCount: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  pointsSection: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: Typography.size.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  pointsLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
});

export default RankingScreen;
