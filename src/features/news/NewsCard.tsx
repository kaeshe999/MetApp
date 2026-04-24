import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { router } from 'expo-router';
import type { News } from '@/types';
import { Colors } from '@/lib/theme';

interface Props {
  item: News;
}

export function NewsCard({ item }: Props) {
  const date = item.publishedAt?.toDate?.();
  const formattedDate = date
    ? format(date, "d 'de' MMMM yyyy", { locale: es })
    : '';

  return (
    <TouchableOpacity onPress={() => router.push(`/(public)/news/${item.id}`)}>
      <Surface style={styles.card} elevation={1}>
        {item.coverImageUrl ? (
          <Image source={{ uri: item.coverImageUrl }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.placeholderText}>MET</Text>
          </View>
        )}
        <View style={styles.content}>
          <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text variant="bodySmall" style={styles.body} numberOfLines={3}>
            {item.body}
          </Text>
          <Text variant="labelSmall" style={styles.date}>
            {formattedDate}
          </Text>
        </View>
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  cover: {
    width: '100%',
    height: 180,
  },
  coverPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: Colors.accent,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 6,
  },
  content: {
    padding: 14,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 6,
  },
  body: {
    color: '#555',
    lineHeight: 18,
    marginBottom: 8,
  },
  date: {
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
