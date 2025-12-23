import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RootStackScreenProps } from '../../navigation/types';
import { useBadgeStore } from '../../stores/badgeStore';
import { Card } from '../../components/Card';
import { Colors, Spacing, Typography } from '../../constants/theme';
import type { UserBadge, BadgeProgress } from '../../types';

type Props = RootStackScreenProps<'Badges'>;

const BadgesScreen: React.FC<Props> = ({ navigation }) => {
  const { badges, fetchBadges, featureBadge, isLoading } = useBadgeStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    await fetchBadges();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBadges();
    setRefreshing(false);
  };

  const handleFeatureBadge = async (badgeId: number) => {
    try {
      await featureBadge(badgeId);
      Alert.alert('Éxito', 'Insignia destacada actualizada');
    } catch (error) {
      Alert.alert('Error', 'No se pudo destacar la insignia');
    }
  };

  const getBadgeEmoji = (badgeType: string): string => {
    const emojiMap: Record<string, string> = {
      voluntad_hierro: '🔥',
      centurion: '💯',
      maratonista: '🏃',
      equilibrista: '⚖️',
      explorador: '🗺️',
      social_butterfly: '🦋',
      early_bird: '🌅',
      night_owl: '🦉',
      streak_master: '⚡',
      points_legend: '👑',
      first_activity: '🎯',
      cardio_king: '❤️',
      strength_champion: '💪',
      zen_master: '🧘',
    };
    return emojiMap[badgeType] || '🏅';
  };

  if (isLoading && !badges) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Insignias</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Summary */}
        {badges && (
          <Card elevated>
            <View style={styles.summary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{badges.unlocked_count}</Text>
                <Text style={styles.summaryLabel}>Desbloqueadas</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{badges.total_badges}</Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {Math.round((badges.unlocked_count / badges.total_badges) * 100)}%
                </Text>
                <Text style={styles.summaryLabel}>Completado</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Unlocked Badges */}
        {badges && badges.unlocked.length > 0 && (
          <Card title="Desbloqueadas" elevated>
            {badges.unlocked.map((userBadge: UserBadge) => (
              <TouchableOpacity
                key={userBadge.badge.id}
                style={[
                  styles.badgeItem,
                  userBadge.is_featured && styles.badgeItemFeatured,
                ]}
                onPress={() => handleFeatureBadge(userBadge.badge.id)}
              >
                <Text style={styles.badgeEmoji}>
                  {getBadgeEmoji(userBadge.badge.badge_type)}
                </Text>
                <View style={styles.badgeInfo}>
                  <View style={styles.badgeHeader}>
                    <Text style={styles.badgeName}>{userBadge.badge.name}</Text>
                    {userBadge.is_featured && (
                      <Text style={styles.featuredBadge}>⭐ Destacada</Text>
                    )}
                  </View>
                  <Text style={styles.badgeDescription}>
                    {userBadge.badge.description}
                  </Text>
                  <Text style={styles.badgeDate}>
                    Desbloqueada:{' '}
                    {new Date(userBadge.unlocked_at).toLocaleDateString('es-ES')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {/* Locked Badges */}
        {badges && badges.locked.length > 0 && (
          <Card
            title="Por desbloquear"
            subtitle={`${badges.locked_count} insignias`}
            elevated
          >
            {badges.locked.map((badgeProgress: BadgeProgress) => (
              <View key={badgeProgress.badge.id} style={styles.lockedBadgeItem}>
                <Text style={styles.lockedBadgeEmoji}>🔒</Text>
                <View style={styles.badgeInfo}>
                  <Text style={styles.badgeName}>{badgeProgress.badge.name}</Text>
                  <Text style={styles.badgeDescription}>
                    {badgeProgress.unlock_condition_description}
                  </Text>
                  {badgeProgress.progress_percentage !== undefined && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${badgeProgress.progress_percentage}%`,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {Math.round(badgeProgress.progress_percentage)}%
                      </Text>
                    </View>
                  )}
                  {badgeProgress.progress_text && (
                    <Text style={styles.progressTextInfo}>
                      {badgeProgress.progress_text}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </Card>
        )}

        {!badges && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🏅</Text>
            <Text style={styles.emptyText}>
              No hay insignias disponibles
            </Text>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    fontSize: Typography.size.md,
    color: Colors.primary,
    width: 60,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: Typography.size.xxl,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  badgeItem: {
    flexDirection: 'row',
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
  },
  badgeItemFeatured: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  badgeEmoji: {
    fontSize: 40,
    marginRight: Spacing.md,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  badgeName: {
    fontSize: Typography.size.md,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  featuredBadge: {
    fontSize: Typography.size.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  badgeDescription: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  badgeDate: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  lockedBadgeItem: {
    flexDirection: 'row',
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
    opacity: 0.7,
  },
  lockedBadgeEmoji: {
    fontSize: 40,
    marginRight: Spacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginRight: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 40,
  },
  progressTextInfo: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default BadgesScreen;
