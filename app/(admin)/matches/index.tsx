import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMatches } from '@/features/matches/useMatches';
import { Colors } from '@/lib/theme';
import type { Match } from '@/types';

const STATUS_COLOR: Record<Match['status'], string> = {
  scheduled: Colors.primary,
  live: Colors.secondary,
  finished: '#555',
  cancelled: '#aaa',
};

const STATUS_LABEL: Record<Match['status'], string> = {
  scheduled: 'Programado',
  live: 'En vivo',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
};

export default function AdminMatchesScreen() {
  const { matches, loading } = useMatches();

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          loading ? null : (
            <Text style={styles.empty}>No hay partidos cargados.</Text>
          )
        }
        renderItem={({ item }) => {
          const date = item.date?.toDate?.();
          const isHome = item.homeAway === 'home';
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/(admin)/matches/${item.id}`)}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.teams} numberOfLines={1}>
                  {isHome ? 'Met HC' : item.opponent}  vs  {isHome ? item.opponent : 'Met HC'}
                </Text>
                {date && (
                  <Text style={styles.date}>
                    {format(date, "d MMM yyyy — HH:mm 'hs'", { locale: es })}
                  </Text>
                )}
                <Text style={styles.venue}>{item.category}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[item.status] }]}>
                <Text style={styles.statusText}>{STATUS_LABEL[item.status]}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
        onPress={() => router.push('/(admin)/matches/create')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  list: { padding: 16, paddingBottom: 80 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardLeft: { flex: 1 },
  teams: { fontWeight: 'bold', color: Colors.primary, fontSize: 14 },
  date: { color: '#666', fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
  venue: { color: '#aaa', fontSize: 11, marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: Colors.secondary },
});
