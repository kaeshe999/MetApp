import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { router } from 'expo-router';
import { createMatch } from '@/features/matches/matchActions';
import { useAuth } from '@/lib/auth';
import { Colors } from '@/lib/theme';
import type { HomeAway } from '@/types';

const CATEGORIES = [
  'Adulto A Masculino',
  'Adulto A Femenino',
  'Adulto B Masculino',
  'Adulto B Femenino',
  'Juvenil Masculino',
  'Juvenil Femenino',
  'Cadete Masculino',
  'Cadete Femenino',
  'Infantil Masculino',
  'Infantil Femenino',
];

const schema = z.object({
  opponent: z.string().min(2, 'Minimo 2 caracteres'),
  venue: z.string().min(2, 'Minimo 2 caracteres'),
  venueMapsUrl: z.string().optional(),
  category: z.string().min(1, 'Selecciona una categoria'),
});

type FormData = z.infer<typeof schema>;

export default function CreateMatchScreen() {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [homeAway, setHomeAway] = useState<HomeAway>('home');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: '' },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setError('');
    setSubmitting(true);
    try {
      await createMatch({
        opponent: data.opponent,
        date,
        venue: data.venue,
        venueMapsUrl: data.venueMapsUrl ?? '',
        category: data.category,
        homeAway,
        seasonId: '2026',
        updatedBy: user.uid,
      });
      router.back();
    } catch {
      setError('Error al guardar el partido.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text variant="titleLarge" style={styles.heading}>Nuevo Partido</Text>

        {/* Rival */}
        <Controller
          control={control}
          name="opponent"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Rival"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.opponent}
              style={styles.input}
            />
          )}
        />
        {errors.opponent && <Text style={styles.fieldError}>{errors.opponent.message}</Text>}

        {/* Local / Visitante */}
        <Text style={styles.label}>Condicion</Text>
        <SegmentedButtons
          value={homeAway}
          onValueChange={(v) => setHomeAway(v as HomeAway)}
          buttons={[
            { value: 'home', label: 'Local' },
            { value: 'away', label: 'Visitante' },
          ]}
          style={styles.segmented}
        />

        {/* Fecha */}
        <Text style={styles.label}>Fecha y hora</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {format(date, "d MMM yyyy", { locale: es })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.dateText}>
              {format(date, "HH:mm")} hs
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(_, selected) => {
              setShowDatePicker(false);
              if (selected) setDate(selected);
            }}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={(_, selected) => {
              setShowTimePicker(false);
              if (selected) setDate(selected);
            }}
          />
        )}

        {/* Lugar */}
        <Controller
          control={control}
          name="venue"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Recinto / Gimnasio"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.venue}
              style={styles.input}
            />
          )}
        />
        {errors.venue && <Text style={styles.fieldError}>{errors.venue.message}</Text>}

        {/* Categoria */}
        <Text style={styles.label}>Categoria</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View style={styles.categoryList}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, value === cat && styles.categoryChipActive]}
                  onPress={() => onChange(cat)}
                >
                  <Text style={[styles.categoryText, value === cat && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
        {errors.category && <Text style={styles.fieldError}>{errors.category.message}</Text>}

        {error !== '' && <Text style={styles.serverError}>{error}</Text>}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={submitting}
          disabled={submitting}
          buttonColor={Colors.primary}
          style={styles.button}
        >
          Guardar Partido
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  content: { padding: 16, paddingBottom: 40 },
  heading: { color: Colors.primary, fontWeight: 'bold', marginBottom: 16 },
  input: { marginBottom: 4, backgroundColor: '#fff' },
  label: { fontSize: 13, color: '#666', marginTop: 12, marginBottom: 6 },
  segmented: { marginBottom: 4 },
  dateRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  dateButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
  },
  dateText: { color: Colors.primary, fontWeight: '500' },
  categoryList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: '#fff',
  },
  categoryChipActive: { backgroundColor: Colors.primary },
  categoryText: { fontSize: 13, color: Colors.primary },
  categoryTextActive: { color: '#fff' },
  fieldError: { color: Colors.secondary, fontSize: 12, marginBottom: 8, marginLeft: 4 },
  serverError: { color: Colors.secondary, textAlign: 'center', marginBottom: 12 },
  button: { marginTop: 24 },
});
