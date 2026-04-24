import { View, StyleSheet } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Match } from '@/types';
import { Colors } from '@/lib/theme';

interface Props {
  item: Match;
}

const STATUS_LABEL: Record<Match['status'], string> = {
  scheduled: 'Programado',
  live: 'En vivo',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
};

const STATUS_COLOR: Record<Match['status'], string> = {
  scheduled: Colors.primary,
  live: Colors.secondary,
  finished: '#555',
  cancelled: '#aaa',
};

export function MatchCard({ item }: Props) {
  const date = item.date?.toDate?.();
  const formattedDate = date ? format(date, "EEEE d 'de' MMMM", { locale: es }) : '';
  const formattedTime = date ? format(date, 'HH:mm', { locale: es }) : '';
  const isHome = item.homeAway === 'home';
  const isFinished = item.status === 'finished';

  return (
    <Surface style={styles.card} elevation={1}>
      {/* Status badge */}
      <View style={styles.topRow}>
        <Text style={styles.category}>{item.category}</Text>
        <Chip
          style={[styles.chip, { backgroundColor: STATUS_COLOR[item.status] }]}
          textStyle={styles.chipText}
          compact
        >
          {STATUS_LABEL[item.status]}
        </Chip>
      </View>

      {/* Marcador / equipos */}
      <View style={styles.scoreRow}>
        <View style={styles.teamBlock}>
          <Text style={[styles.teamName, isHome && styles.teamBold]} numberOfLines={1}>
            {isHome ? 'Met HC' : item.opponent}
          </Text>
          <Text style={styles.homeAway}>{isHome ? 'Local' : 'Visitante'}</Text>
        </View>

        <View style={styles.scoreBlock}>
          {isFinished ? (
            <Text style={styles.score}>
              {item.scoreHome} - {item.scoreAway}
            </Text>
          ) : (
            <Text style={styles.vs}>VS</Text>
          )}
        </View>

        <View style={styles.teamBlock}>
          <Text style={[styles.teamName, !isHome && styles.teamBold]} numberOfLines={1}>
            {isHome ? item.opponent : 'Met HC'}
          </Text>
          <Text style={styles.homeAway}>{isHome ? 'Visitante' : 'Local'}</Text>
        </View>
      </View>

      {/* Fecha y lugar */}
      <View style={styles.bottomRow}>
        <Text style={styles.date}>{formattedDate} — {formattedTime} hs</Text>
        {item.venue ? <Text style={styles.venue}>{item.venue}</Text> : null}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#fff',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  category: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chip: {
    height: 24,
  },
  chipText: {
    color: '#fff',
    fontSize: 10,
    marginVertical: 0,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamBlock: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
  },
  teamBold: {
    fontWeight: 'bold',
  },
  homeAway: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 2,
  },
  scoreBlock: {
    paddingHorizontal: 16,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  vs: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  bottomRow: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    gap: 2,
  },
  date: {
    fontSize: 12,
    color: Colors.secondary,
    textTransform: 'capitalize',
  },
  venue: {
    fontSize: 12,
    color: '#888',
  },
});
