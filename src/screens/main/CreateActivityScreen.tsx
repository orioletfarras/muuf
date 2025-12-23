import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { RootStackScreenProps } from '../../navigation/types';
import { useActivityStore } from '../../stores/activityStore';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { ACTIVITY_TYPES, INTENSITY_LEVELS } from '../../constants/activities';
import { ActivityType, IntensityLevel } from '../../types';

type Props = RootStackScreenProps<'CreateActivity'>;

const CreateActivityScreen: React.FC<Props> = ({ navigation }) => {
  const { createActivity, isLoading } = useActivityStore();
  const { showSuccess, showError } = useToast();

  const [selectedType, setSelectedType] = useState<ActivityType | null>(null);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [intensity, setIntensity] = useState<IntensityLevel | null>(null);

  const handleCreate = async () => {
    // Validation
    if (!selectedType) {
      showError('Selecciona un tipo de actividad');
      return;
    }

    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
      showError('Ingresa una duración válida');
      return;
    }

    if (distance && (isNaN(Number(distance)) || Number(distance) <= 0)) {
      showError('Ingresa una distancia válida');
      return;
    }

    try {
      await createActivity({
        activity_type: selectedType,
        title: title || undefined,
        duration_minutes: Number(duration),
        distance_km: distance ? Number(distance) : undefined,
        intensity_level: intensity || undefined,
        performed_at: new Date().toISOString(),
      });

      showSuccess('¡Actividad registrada correctamente!');
      navigation.goBack();
    } catch (error) {
      showError('No se pudo crear la actividad');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>✕ Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nueva Actividad</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Activity Type Selection */}
        <Card title="Tipo de Actividad" elevated>
          <View style={styles.typeGrid}>
            {ACTIVITY_TYPES.map((activity) => (
              <TouchableOpacity
                key={activity.type}
                style={[
                  styles.typeButton,
                  selectedType === activity.type && styles.typeButtonSelected,
                ]}
                onPress={() => setSelectedType(activity.type)}
              >
                <Text style={styles.typeEmoji}>{activity.emoji}</Text>
                <Text
                  style={[
                    styles.typeLabel,
                    selectedType === activity.type && styles.typeLabelSelected,
                  ]}
                >
                  {activity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Activity Details */}
        <Card title="Detalles" elevated>
          <Input
            label="Título (opcional)"
            value={title}
            onChangeText={setTitle}
            placeholder="Ej: Carrera matutina"
          />

          <Input
            label="Duración (minutos) *"
            value={duration}
            onChangeText={setDuration}
            placeholder="30"
            keyboardType="numeric"
          />

          <Input
            label="Distancia (km)"
            value={distance}
            onChangeText={setDistance}
            placeholder="5.0"
            keyboardType="decimal-pad"
          />
        </Card>

        {/* Intensity Selection */}
        <Card title="Intensidad" elevated>
          <View style={styles.intensityContainer}>
            {INTENSITY_LEVELS.map((item) => (
              <TouchableOpacity
                key={item.level}
                style={[
                  styles.intensityButton,
                  { borderColor: item.color },
                  intensity === item.level && {
                    backgroundColor: item.color,
                  },
                ]}
                onPress={() => setIntensity(item.level)}
              >
                <Text
                  style={[
                    styles.intensityLabel,
                    intensity === item.level && styles.intensityLabelSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Submit Button */}
        <Button
          title="Registrar Actividad"
          onPress={handleCreate}
          loading={isLoading}
          fullWidth
          style={styles.submitButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl * 2 : Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cancelButton: {
    fontSize: Typography.size.md,
    color: Colors.error,
    width: 80,
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  typeButton: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  typeButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundSecondary,
  },
  typeEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  typeLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  typeLabelSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  intensityContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  intensityButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  intensityLabel: {
    fontSize: Typography.size.md,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  intensityLabelSelected: {
    color: Colors.white,
  },
  submitButton: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
});

export default CreateActivityScreen;
