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
import { Card, LoadingSpinner, ErrorMessage, EmptyState } from '../../components';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

type Props = RootStackScreenProps<'Notifications'>;

interface Notification {
  id: number;
  type: 'achievement' | 'challenge' | 'team' | 'activity' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  data?: any;
}

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (err: any) {
      setError('No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      // Silent fail
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      // Silent fail
    }
  };

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'achievement':
        return '🏆';
      case 'challenge':
        return '🎯';
      case 'team':
        return '👥';
      case 'activity':
        return '🏃';
      case 'system':
        return '⚙️';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'achievement':
        return Colors.success;
      case 'challenge':
        return Colors.primary;
      case 'team':
        return Colors.secondary;
      case 'activity':
        return Colors.info;
      case 'system':
        return Colors.textSecondary;
      default:
        return Colors.primary;
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.data?.activityId) {
      navigation.navigate('ActivityDetail', { activityId: notification.data.activityId });
    } else if (notification.data?.questId) {
      navigation.navigate('Quests');
    } else if (notification.data?.teamId) {
      navigation.navigate('Team');
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const iconColor = getNotificationColor(item.type);

    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <Card style={[styles.notificationCard, !item.is_read && styles.unreadCard]}>
          <View style={styles.notificationContent}>
            <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
              <Text style={styles.icon}>{getNotificationIcon(item.type)}</Text>
            </View>

            <View style={styles.notificationText}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.notificationDate}>{formatDate(item.created_at)}</Text>
            </View>

            {!item.is_read && <View style={styles.unreadDot} />}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
      <View style={styles.header}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'all' && styles.filterButtonTextActive,
              ]}
            >
              Todas ({notifications.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'unread' && styles.filterButtonActive]}
            onPress={() => setFilter('unread')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'unread' && styles.filterButtonTextActive,
              ]}
            >
              No leídas ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <Text style={styles.markAllButtonText}>Marcar todas como leídas</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={loadNotifications} />
      </View>
    );
  }

  const filteredNotifications =
    filter === 'all' ? notifications : notifications.filter((n) => !n.is_read);

  return (
    <View style={styles.container}>
      {filteredNotifications.length === 0 ? (
        <View>
          {renderHeader()}
          <EmptyState
            icon="🔔"
            title={filter === 'all' ? 'No hay notificaciones' : 'No hay notificaciones sin leer'}
            message={
              filter === 'all'
                ? 'Te notificaremos cuando haya novedades'
                : 'Todas las notificaciones están leídas'
            }
          />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
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
  content: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  markAllButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  markAllButtonText: {
    fontSize: Typography.size.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  notificationCard: {
    marginBottom: Spacing.sm,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: Typography.size.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: Spacing.xs,
    marginTop: 4,
  },
});

export default NotificationsScreen;
