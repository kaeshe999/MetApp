import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { db } from '@/lib/firebase';
import { updateMatchScore, deleteMatch } from '@/features/matches/matchActions';
import { useAuth } from '@/lib/auth';
import { Colors } from '@/lib/theme';
import type { Match, MatchStatus } from '@/types';

const CLUB_ID = 'methb';

const STATUS_OPTIONS: { value: MatchStatus; label: string }[] = [
  { value: 'scheduled', label: 'Programado' },
  { value: 'live', label: 'En vivo' },
  { value: 'finished', label: 'Finalizado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export default function EditMatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [status, setStatus] = useState<MatchStatus>('scheduled');
  const [scoreHome, setScoreHome] = useState('0');
  const [scoreAway, setScoreAway] = useState('0');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'clubs', CLUB_ID, 'matches', id), (snap) => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as Match;
        setMatch(data);
        setStatus(data.status);
        setScoreHome(String(data.scoreHome));
        setScoreAway(String(data.scoreAway));
      }
    });
    return unsubscribe;
  }, [id]);

  const onDelete = () => {
    Alert.alert(
      'Eliminar partido',
      'Esta accion no se puede deshacer. Confirmas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            setDeleting(true);
            try {
              await deleteMatch(id);
              router.back();
            } catch {
              setError('Error al eliminar el partido.');
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const onSave = async () => {
    if (!user || !id) return;
    setError('');
    setSubmitting(true);
    try {
      await updateMatchScore(
        id,
        parseInt(scoreHome) || 0,
        parseInt(scoreAway) || 0,
        status,
        user.uid
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Error al guardar.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!match) {
    return (
      <View style={styles.centered}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const date = match.date?.toDate?.();
  const isHome = match.homeAway === 'home';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="titleLarge" style={styles.heading}>Actualizar Partido</Text>

      {/* Info del partido */}
      <View style={styles.matchInfo}>
        <Text style={styles.teams}>
          {isHome ? 'Met HC' : match.opponent}  vs  {isHome ? match.opponent : 'Met HC'}
        </Text>
        {date && (
          <Text style={styles.date}>
            {format(date, "d 'de' MMMM — HH:mm 'hs'", { locale: es })}
          </Text>
        )}
        <Text style={styles.venue}>{match.venue} • {match.category}</Text>
      </View>

      {/* Estado */}
      <Text style={styles.label}>Estado</Text>
      <SegmentedButtons
        value={status}
        onValueChange={(v) => setStatus(v as MatchStatus)}
        buttons={STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        style={styles.segmented}
      />

      {/* Marcador */}
      {(status === 'live' || status === 'finished') && (
        <>
          <Text style={styles.label}>Marcador</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreBlock}>
              <Text style={styles.scoreLabel}>
                {isHome ? 'Met HC' : match.opponent}
              </Text>
              <TextInput
                mode="outlined"
                keyboardType="number-pad"
                value={scoreHome}
                onChangeText={setScoreHome}
                style={styles.scoreInput}
              />
            </View>
            <Text style={styles.scoreDash}>-</Text>
            <View style={styles.scoreBlock}>
              <Text style={styles.scoreLabel}>
                {isHome ? match.opponent : 'Met HC'}
              </Text>
              <TextInput
                mode="outlined"
                keyboardType="number-pad"
                value={scoreAway}
                onChangeText={setScoreAway}
                style={styles.scoreInput}
              />
            </View>
          </View>
        </>
      )}

      {error !== '' && <Text style={styles.serverError}>{error}</Text>}

      <Button
        mode="contained"
        onPress={onSave}
        loading={submitting}
        disabled={submitting || deleting}
        buttonColor={saved ? '#2e7d32' : Colors.secondary}
        style={styles.button}
      >
        {saved ? 'Guardado' : 'Guardar cambios'}
      </Button>

      <Button
        mode="outlined"
        onPress={onDelete}
        loading={deleting}
        disabled={submitting || deleting}
        textColor={Colors.secondary}
        style={styles.deleteButton}
      >
        Eliminar partido
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  content: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heading: { color: Colors.primary, fontWeight: 'bold', marginBottom: 16 },
  matchInfo: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    gap: 4,
  },
  teams: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  date: { color: Colors.accent, fontSize: 13, textAlign: 'center', textTransform: 'capitalize' },
  venue: { color: '#aac4e8', fontSize: 12, textAlign: 'center' },
  label: { fontSize: 13, color: '#666', marginBottom: 8, marginTop: 12 },
  segmented: { marginBottom: 4 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  scoreBlock: { alignItems: 'center', flex: 1 },
  scoreLabel: { fontSize: 12, color: '#555', marginBottom: 6, textAlign: 'center' },
  scoreInput: { width: '100%', backgroundColor: '#fff', fontSize: 24, textAlign: 'center' },
  scoreDash: { fontSize: 28, fontWeight: 'bold', color: Colors.primary, marginTop: 20 },
  serverError: { color: Colors.secondary, textAlign: 'center', marginVertical: 8 },
  button: { marginTop: 24 },
  deleteButton: { marginTop: 12, borderColor: Colors.secondary },
});
