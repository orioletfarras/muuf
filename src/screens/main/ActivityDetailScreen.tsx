import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { RootStackScreenProps } from '../../navigation/types';
import { Button, Card, LoadingSpinner, ErrorMessage } from '../../components';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Activity } from '../../types';
import api from '../../services/api';
import { formatDate, formatDuration } from '../../utils/formatters';
import { getActivityTypeName } from '../../utils/activity';

type Props = RootStackScreenProps<'ActivityDetail'>;

const ActivityDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { activityId } = route.params;
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadActivity();
  }, [activityId]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/activities/${activityId}`);
      setActivity(response.data);
    } catch (err) {
      setError('No se pudo cargar la actividad');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Actividad',
      '¿Estás seguro de que quieres eliminar esta actividad? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/activities/${activityId}`);
      showSuccess('Actividad eliminada correctamente');
      navigation.goBack();
    } catch (err) {
      showError('No se pudo eliminar la actividad');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !activity) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error || 'Actividad no encontrada'} onRetry={loadActivity} />
      </View>
    );
  }

  const getActivityEmoji = (type: string): string => {
    const emojiMap: Record<string, string> = {
      running: '🏃',
      walking: '🚶',
      cycling: '🚴',
      swimming: '🏊',
      gym: '💪',
      yoga: '🧘',
      sports: '⚽',
      hiking: '🥾',
      dancing: '💃',
      other: '🎯',
    };
    return emojiMap[type] || '🎯';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Activity Type Header */}
      <Card style={styles.headerCard}>
        <View style={styles.activityHeader}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{getActivityEmoji(activity.activity_type)}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.activityType}>{getActivityTypeName(activity.activity_type)}</Text>
            <Text style={styles.date}>{formatDate(activity.created_at)}</Text>
          </View>
        </View>
      </Card>

      {/* Points Card */}
      <Card style={styles.pointsCard}>
        <Text style={styles.pointsLabel}>Puntos Ganados</Text>
        <Text style={styles.points}>{activity.points.toFixed(1)}</Text>
      </Card>

      {/* Activity Details */}
      <Card style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Detalles</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duración</Text>
          <Text style={styles.detailValue}>{formatDuration(activity.duration)}</Text>
        </View>

        {activity.distance && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Distancia</Text>
            <Text style={styles.detailValue}>{activity.distance.toFixed(2)} km</Text>
          </View>
        )}

        {activity.intensity && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Intensidad</Text>
            <Text style={styles.detailValue}>
              {activity.intensity.charAt(0).toUpperCase() + activity.intensity.slice(1)}
            </Text>
          </View>
        )}

        {activity.calories && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Calorías</Text>
            <Text style={styles.detailValue}>{activity.calories} kcal</Text>
          </View>
        )}

        {activity.heart_rate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ritmo Cardíaco</Text>
            <Text style={styles.detailValue}>{activity.heart_rate} bpm</Text>
          </View>
        )}
      </Card>

      {/* Notes */}
      {activity.notes && (
        <Card style={styles.notesCard}>
          <Text style={styles.sectionTitle}>Notas</Text>
          <Text style={styles.notes}>{activity.notes}</Text>
        </Card>
      )}

      {/* Photos */}
      {activity.photo_url && (
        <Card style={styles.photoCard}>
          <Text style={styles.sectionTitle}>Foto</Text>
          <Image source={{ uri: activity.photo_url }} style={styles.photo} />
        </Card>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Eliminar Actividad</Text>
        </TouchableOpacity>
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
  headerCard: {
    marginBottom: Spacing.md,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  emoji: {
    fontSize: 32,
  },
  headerInfo: {
    flex: 1,
  },
  activityType: {
    fontSize: Typography.size.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  pointsCard: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    backgroundColor: Colors.primary,
  },
  pointsLabel: {
    fontSize: Typography.size.sm,
    color: Colors.white,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  points: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.white,
  },
  detailsCard: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: Typography.size.md,
    fontWeight: '600',
    color: Colors.text,
  },
  notesCard: {
    marginBottom: Spacing.md,
  },
  notes: {
    fontSize: Typography.size.md,
    color: Colors.text,
    lineHeight: 22,
  },
  photoCard: {
    marginBottom: Spacing.md,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
  },
  actions: {
    marginTop: Spacing.md,
  },
  deleteButton: {
    backgroundColor: Colors.error,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: Typography.size.md,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default ActivityDetailScreen;
