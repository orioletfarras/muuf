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
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  ProgressBar,
} from '../../components';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

type Props = RootStackScreenProps<'Quests'>;

interface Quest {
  id: number;
  title: string;
  description: string;
  quest_type: 'daily' | 'weekly' | 'monthly' | 'special';
  target_value: number;
  current_value: number;
  reward_points: number;
  status: 'active' | 'completed' | 'expired';
  expires_at?: string;
  completed_at?: string;
}

const QuestsScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/quests');
      const quests: Quest[] = response.data;

      setActiveQuests(quests.filter((q) => q.status === 'active'));
      setCompletedQuests(quests.filter((q) => q.status === 'completed'));
    } catch (err: any) {
      setError('No se pudieron cargar los desafíos');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadQuests();
    setRefreshing(false);
  };

  const getQuestTypeColor = (type: string): string => {
    switch (type) {
      case 'daily':
        return Colors.info;
      case 'weekly':
        return Colors.primary;
      case 'monthly':
        return Colors.secondary;
      case 'special':
        return Colors.success;
      default:
        return Colors.primary;
    }
  };

  const getQuestTypeLabel = (type: string): string => {
    switch (type) {
      case 'daily':
        return 'Diario';
      case 'weekly':
        return 'Semanal';
      case 'monthly':
        return 'Mensual';
      case 'special':
        return 'Especial';
      default:
        return type;
    }
  };

  const getQuestIcon = (type: string): string => {
    switch (type) {
      case 'daily':
        return '📅';
      case 'weekly':
        return '📆';
      case 'monthly':
        return '🗓️';
      case 'special':
        return '⭐';
      default:
        return '🎯';
    }
  };

  const renderQuest = ({ item }: { item: Quest }) => {
    const progress = (item.current_value / item.target_value) * 100;
    const isCompleted = item.status === 'completed';
    const typeColor = getQuestTypeColor(item.quest_type);

    return (
      <Card style={[styles.questCard, isCompleted && styles.questCardCompleted]}>
        <View style={styles.questHeader}>
          <View style={styles.questTitleRow}>
            <Text style={styles.questIcon}>{getQuestIcon(item.quest_type)}</Text>
            <View style={styles.questTitleContainer}>
              <Text style={styles.questTitle}>{item.title}</Text>
              <View style={[styles.typeBadge, { backgroundColor: `${typeColor}20` }]}>
                <Text style={[styles.typeBadgeText, { color: typeColor }]}>
                  {getQuestTypeLabel(item.quest_type)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.rewardBadge}>
            <Text style={styles.rewardPoints}>+{item.reward_points}</Text>
            <Text style={styles.rewardLabel}>pts</Text>
          </View>
        </View>

        <Text style={styles.questDescription}>{item.description}</Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {item.current_value} / {item.target_value}
            </Text>
            <Text style={styles.progressPercent}>{progress.toFixed(0)}%</Text>
          </View>
          <ProgressBar progress={progress} color={typeColor} />
        </View>

        {isCompleted && item.completed_at && (
          <View style={styles.completedBanner}>
            <Text style={styles.completedText}>
              ✓ Completado el {formatDate(item.completed_at)}
            </Text>
          </View>
        )}

        {!isCompleted && item.expires_at && (
          <View style={styles.expiryInfo}>
            <Text style={styles.expiryText}>⏰ Expira: {formatDate(item.expires_at)}</Text>
          </View>
        )}
      </Card>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
          onPress={() => setSelectedTab('active')}
        >
          <Text style={[styles.tabText, selectedTab === 'active' && styles.tabTextActive]}>
            Activos ({activeQuests.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'completed' && styles.tabActive]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={[styles.tabText, selectedTab === 'completed' && styles.tabTextActive]}>
            Completados ({completedQuests.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => {
    if (selectedTab === 'active') {
      return (
        <EmptyState
          icon="🎯"
          title="No hay desafíos activos"
          message="Vuelve pronto para nuevos desafíos"
        />
      );
    }
    return (
      <EmptyState
        icon="🏆"
        title="No hay desafíos completados"
        message="Completa desafíos para verlos aquí"
      />
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={loadQuests} />
      </View>
    );
  }

  const displayedQuests = selectedTab === 'active' ? activeQuests : completedQuests;

  return (
    <View style={styles.container}>
      {renderHeader()}
      {displayedQuests.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={displayedQuests}
          renderItem={renderQuest}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabs: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.size.md,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    padding: Spacing.md,
  },
  questCard: {
    marginBottom: Spacing.md,
  },
  questCardCompleted: {
    opacity: 0.8,
    backgroundColor: Colors.backgroundSecondary,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  questTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  questIcon: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  questTitleContainer: {
    flex: 1,
  },
  questTitle: {
    fontSize: Typography.size.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  typeBadgeText: {
    fontSize: Typography.size.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rewardBadge: {
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  rewardPoints: {
    fontSize: Typography.size.lg,
    fontWeight: '700',
    color: Colors.white,
  },
  rewardLabel: {
    fontSize: Typography.size.xs,
    color: Colors.white,
  },
  questDescription: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  progressSection: {
    gap: Spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: Typography.size.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  completedBanner: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.sm,
  },
  completedText: {
    fontSize: Typography.size.sm,
    color: Colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  expiryInfo: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.warning + '20',
    borderRadius: BorderRadius.sm,
  },
  expiryText: {
    fontSize: Typography.size.sm,
    color: Colors.warning,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default QuestsScreen;
