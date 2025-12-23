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
  ProgressBar,
} from '../../components';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';

type Props = RootStackScreenProps<'Team'>;

interface TeamMember {
  id: number;
  full_name: string;
  email: string;
  avatar_url?: string;
  total_points: number;
  activities_count: number;
  ritmo_percentage: number;
  balance_percentage: number;
  rank?: number;
}

interface TeamStats {
  team_name: string;
  total_members: number;
  total_points: number;
  avg_ritmo: number;
  avg_balance: number;
  team_rank?: number;
}

const TeamScreen: React.FC<Props> = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, membersResponse] = await Promise.all([
        api.get('/teams/my-team/stats'),
        api.get('/teams/my-team/members'),
      ]);

      setTeamStats(statsResponse.data);
      setMembers(membersResponse.data);
    } catch (err: any) {
      setError('No se pudo cargar el equipo');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTeamData();
    setRefreshing(false);
  };

  const getMedalEmoji = (rank: number | undefined): string => {
    if (!rank) return '';
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

  const renderTeamHeader = () => {
    if (!teamStats) return null;

    return (
      <View style={styles.header}>
        <Card style={styles.teamCard}>
          <Text style={styles.teamName}>{teamStats.team_name}</Text>
          {teamStats.team_rank && (
            <Text style={styles.teamRank}>
              {getMedalEmoji(teamStats.team_rank)} Ranking #{teamStats.team_rank}
            </Text>
          )}

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{teamStats.total_members}</Text>
              <Text style={styles.statLabel}>Miembros</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{teamStats.total_points.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Puntos</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Ritmo Promedio</Text>
                <Text style={styles.progressValue}>{teamStats.avg_ritmo.toFixed(0)}%</Text>
              </View>
              <ProgressBar progress={teamStats.avg_ritmo} color={Colors.primary} />
            </View>

            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Balance Promedio</Text>
                <Text style={styles.progressValue}>{teamStats.avg_balance.toFixed(0)}%</Text>
              </View>
              <ProgressBar progress={teamStats.avg_balance} color={Colors.secondary} />
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Miembros del Equipo</Text>
      </View>
    );
  };

  const renderMember = ({ item, index }: { item: TeamMember; index: number }) => {
    const isCurrentUser = item.id === user?.id;
    const rank = index + 1;

    return (
      <TouchableOpacity
        style={[styles.memberCard, isCurrentUser && styles.memberCardHighlight]}
        activeOpacity={0.7}
      >
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{getMedalEmoji(rank) || `#${rank}`}</Text>
        </View>

        <Avatar name={item.full_name} imageUrl={item.avatar_url} size="medium" />

        <View style={styles.memberInfo}>
          <View style={styles.memberHeader}>
            <Text style={styles.memberName}>
              {item.full_name}
              {isCurrentUser && <Text style={styles.youBadge}> (Tú)</Text>}
            </Text>
          </View>

          <View style={styles.memberStats}>
            <View style={styles.memberStat}>
              <Text style={styles.memberStatValue}>{item.total_points.toFixed(0)}</Text>
              <Text style={styles.memberStatLabel}>pts</Text>
            </View>
            <View style={styles.memberStat}>
              <Text style={styles.memberStatValue}>{item.activities_count}</Text>
              <Text style={styles.memberStatLabel}>actividades</Text>
            </View>
          </View>

          <View style={styles.memberProgress}>
            <View style={styles.miniProgress}>
              <Text style={styles.miniProgressLabel}>
                R: {item.ritmo_percentage.toFixed(0)}%
              </Text>
              <View style={styles.miniProgressBar}>
                <View
                  style={[
                    styles.miniProgressFill,
                    {
                      width: `${item.ritmo_percentage}%`,
                      backgroundColor: Colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
            <View style={styles.miniProgress}>
              <Text style={styles.miniProgressLabel}>
                B: {item.balance_percentage.toFixed(0)}%
              </Text>
              <View style={styles.miniProgressBar}>
                <View
                  style={[
                    styles.miniProgressFill,
                    {
                      width: `${item.balance_percentage}%`,
                      backgroundColor: Colors.secondary,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={loadTeamData} />
      </View>
    );
  }

  if (members.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="👥"
          title="No hay miembros"
          message="Tu equipo aún no tiene miembros"
        />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={members}
      renderItem={renderMember}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderTeamHeader}
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
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
  },
  teamCard: {
    marginBottom: Spacing.lg,
  },
  teamName: {
    fontSize: Typography.size.xxl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  teamRank: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.size.xxl,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  progressSection: {
    gap: Spacing.md,
  },
  progressItem: {
    gap: Spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  progressValue: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  memberCardHighlight: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}05`,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  rankText: {
    fontSize: Typography.size.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  memberInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  memberName: {
    fontSize: Typography.size.md,
    fontWeight: '600',
    color: Colors.text,
  },
  youBadge: {
    color: Colors.primary,
    fontSize: Typography.size.sm,
  },
  memberStats: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  memberStat: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  memberStatValue: {
    fontSize: Typography.size.md,
    fontWeight: '700',
    color: Colors.text,
  },
  memberStatLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
  memberProgress: {
    gap: 4,
  },
  miniProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  miniProgressLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    width: 50,
  },
  miniProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default TeamScreen;
