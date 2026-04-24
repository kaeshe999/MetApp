import { ScrollView, View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { db } from '@/lib/firebase';
import { Colors } from '@/lib/theme';
import type { News } from '@/types';

const CLUB_ID = 'methb';
const { width } = Dimensions.get('window');

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'clubs', CLUB_ID, 'news', id))
      .then((snap) => {
        if (snap.exists()) {
          setNews({ id: snap.id, ...snap.data() } as News);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.secondary} />
      </View>
    );
  }

  if (!news) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Noticia no encontrada.</Text>
      </View>
    );
  }

  const date = news.publishedAt?.toDate?.();
  const formattedDate = date
    ? format(date, "d 'de' MMMM yyyy", { locale: es })
    : '';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: '#fff',
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingLeft: 4 }}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      {/* Imagen de portada */}
      {news.coverImageUrl ? (
        <Image
          source={{ uri: news.coverImageUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.coverPlaceholderText}>MET</Text>
        </View>
      )}

      <View style={styles.content}>
        {/* Fecha */}
        <Text style={styles.date}>{formattedDate}</Text>

        {/* Titulo */}
        <Text style={styles.title}>{news.title}</Text>

        {/* Separador */}
        <View style={styles.divider} />

        {/* Cuerpo */}
        <Text style={styles.body}>{news.body}</Text>

        {/* Galeria */}
        {news.gallery && news.gallery.length > 0 && (
          <View style={styles.gallery}>
            <Text style={styles.galleryTitle}>Galeria</Text>
            {news.gallery.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: {
    width,
    height: 260,
  },
  coverPlaceholder: {
    width,
    height: 260,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPlaceholderText: {
    color: Colors.accent,
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  content: {
    padding: 20,
  },
  date: {
    color: Colors.secondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    lineHeight: 32,
    marginBottom: 16,
  },
  divider: {
    height: 3,
    width: 40,
    backgroundColor: Colors.secondary,
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
  },
  gallery: {
    marginTop: 28,
    gap: 12,
  },
  galleryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  galleryImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
  },
  error: {
    color: '#888',
  },
});
