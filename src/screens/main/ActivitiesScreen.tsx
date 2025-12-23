import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MainTabCompositeProps } from '../../navigation/types';
import { useActivityStore } from '../../stores/activityStore';
import {
  Card,
  Button,
  LoadingSpinner,
  EmptyState,
  FloatingActionButton,
  SearchBar,
  FilterChip,
} from '../../components';
import { formatDate, getActivityEmoji } from '../../utils';
import { Colors, Spacing, Typography } from '../../constants/theme';
import type { Activity } from '../../types';
import { useRefreshOnFocus } from '../../hooks/useRefreshOnFocus';
import { useDebounce } from '../../hooks/useDebounce';

type Props = MainTabCompositeProps<'Activities'>;

const ActivitiesScreen: React.FC<Props> = ({ navigation }) => {
  const { activities, fetchActivities, deleteActivity, isLoading } =
    useActivityStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const activityFilters = [
    { id: 'all', label: 'Todas', icon: '📋' },
    { id: 'running', label: 'Correr', icon: '🏃' },
    { id: 'walking', label: 'Caminar', icon: '🚶' },
    { id: 'cycling', label: 'Ciclismo', icon: '🚴' },
    { id: 'gym', label: 'Gimnasio', icon: '💪' },
    { id: 'other', label: 'Otras', icon: '🎯' },
  ];

  const loadActivities = async () => {
    await fetchActivities({ limit: 50 });
  };

  useEffect(() => {
    loadActivities();
  }, []);

  useRefreshOnFocus(loadActivities);

  // Filter and search activities
  const filteredActivities = activities.filter((activity) => {
    // Filter by type
    if (selectedFilter !== 'all' && activity.activity_type !== selectedFilter) {
      return false;
    }

    // Filter by search query
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      const titleMatch = activity.title?.toLowerCase().includes(searchLower);
      const typeMatch = activity.activity_type.toLowerCase().includes(searchLower);
      return titleMatch || typeMatch;
    }

    return true;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActivities();
    setRefreshing(false);
  };

  const handleDelete = (activity: Activity) => {
    Alert.alert(
      'Eliminar Actividad',
      `¿Estás seguro de que quieres eliminar "${activity.title || activity.activity_type}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteActivity(activity.id);
              Alert.alert('Éxito', 'Actividad eliminada');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la actividad');
            }
          },
        },
      ]
    );
  };

  if (isLoading && activities.length === 0) {
    return <LoadingSpinner message="Cargando actividades..." fullScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Actividades</Text>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar actividades..."
          style={styles.searchBar}
        />

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {activityFilters.map((filter) => (
            <FilterChip
              key={filter.id}
              label={filter.label}
              icon={filter.icon}
              selected={selectedFilter === filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={styles.filterChip}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredActivities.length === 0 ? (
          <EmptyState
            emoji="🏃"
            title="No hay actividades"
            message="Registra tu primera actividad para comenzar tu viaje de bienestar"
            actionLabel="+ Nueva Actividad"
            onAction={() => navigation.navigate('CreateActivity')}
          />
        ) : (
          filteredActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              onPress={() => navigation.navigate('ActivityDetail', { activityId: activity.id })}
              activeOpacity={0.7}
            >
              <Card elevated>
                <View style={styles.activityHeader}>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityEmoji}>
                      {getActivityEmoji(activity.activity_type)}
                    </Text>
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityTitle}>
                        {activity.title || activity.activity_type}
                      </Text>
                      <Text style={styles.activityDate}>
                        {formatDate(activity.performed_at)}
                      </Text>
                    </View>
                  </View>
                  <Button
                    title="🗑️"
                    onPress={(e) => {
                      e?.stopPropagation?.();
                      handleDelete(activity);
                    }}
                    variant="danger"
                    size="small"
                  />
                </View>

                <View style={styles.activityStats}>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Duración</Text>
                    <Text style={styles.statValue}>
                      {activity.duration_minutes} min
                    </Text>
                  </View>
                  {activity.distance_km && (
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Distancia</Text>
                      <Text style={styles.statValue}>
                        {activity.distance_km} km
                      </Text>
                    </View>
                  )}
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Puntos</Text>
                    <Text style={[styles.statValue, { color: Colors.primary }]}>
                      {Math.round(activity.final_points)}
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <FloatingActionButton
        icon="+"
        onPress={() => navigation.navigate('CreateActivity')}
      />
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
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  searchBar: {
    marginBottom: Spacing.md,
  },
  filtersContainer: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  filtersContent: {
    gap: Spacing.sm,
  },
  filterChip: {
    marginBottom: Spacing.sm,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityEmoji: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: Typography.size.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  activityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: Typography.size.md,
    fontWeight: '700',
    color: Colors.text,
  },
});

export default ActivitiesScreen;
