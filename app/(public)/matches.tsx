import { SectionList, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useMatches } from '@/features/matches/useMatches';
import { MatchCard } from '@/features/matches/MatchCard';
import { Colors } from '@/lib/theme';
import type { Match } from '@/types';

export default function MatchesScreen() {
  const { matches, loading, error } = useMatches();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.secondary} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const now = new Date();
  const upcoming = matches.filter(
    (m) => m.status === 'scheduled' || m.status === 'live'
  );
  const past = matches.filter(
    (m) => m.status === 'finished' || m.status === 'cancelled'
  ).reverse();

  const sections: { title: string; data: Match[] }[] = [];
  if (upcoming.length > 0) sections.push({ title: 'Proximos partidos', data: upcoming });
  if (past.length > 0) sections.push({ title: 'Resultados', data: past });

  if (sections.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>No hay partidos cargados.</Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MatchCard item={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundLight,
  },
  list: {
    paddingVertical: 16,
    backgroundColor: Colors.backgroundLight,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  error: {
    color: Colors.secondary,
    fontSize: 14,
  },
  empty: {
    color: '#888',
    fontSize: 14,
  },
});
