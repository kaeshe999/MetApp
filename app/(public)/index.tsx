import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useNews } from '@/features/news/useNews';
import { NewsCard } from '@/features/news/NewsCard';
import { Colors } from '@/lib/theme';

export default function NewsScreen() {
  const { news, loading, error } = useNews();

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

  if (news.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>No hay noticias publicadas.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={news}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NewsCard item={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
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
  error: {
    color: Colors.secondary,
    fontSize: 14,
  },
  empty: {
    color: '#888',
    fontSize: 14,
  },
});
