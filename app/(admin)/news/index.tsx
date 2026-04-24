import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, FAB, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNews } from '@/features/news/useNews';
import { deleteNews } from '@/features/news/newsActions';
import { Colors } from '@/lib/theme';

export default function AdminNewsScreen() {
  const { news, loading } = useNews(true);

  const onDelete = (id: string, title: string) => {
    Alert.alert(
      'Eliminar noticia',
      `Eliminar "${title}"? Esta accion no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteNews(id);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          loading ? null : (
            <Text style={styles.empty}>No hay noticias.</Text>
          )
        }
        renderItem={({ item }) => {
          const date = item.publishedAt?.toDate?.();
          return (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/(admin)/news/${item.id}`)}>
              <View style={styles.cardLeft}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <View style={styles.meta}>
                  <Chip
                    compact
                    style={[
                      styles.chip,
                      { backgroundColor: item.status === 'published' ? Colors.primary : '#888' },
                    ]}
                    textStyle={styles.chipText}
                  >
                    {item.status === 'published' ? 'Publicada' : 'Borrador'}
                  </Chip>
                  {date && (
                    <Text style={styles.date}>
                      {format(date, "d MMM yyyy", { locale: es })}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => onDelete(item.id, item.title)}
                style={styles.deleteBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={22} color={Colors.secondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
        onPress={() => router.push('/(admin)/news/create')}
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
  title: { fontWeight: 'bold', color: Colors.primary, fontSize: 14, marginBottom: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chip: { height: 22 },
  chipText: { color: '#fff', fontSize: 10, marginVertical: 0 },
  date: { color: '#aaa', fontSize: 11 },
  deleteBtn: { paddingLeft: 12 },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: Colors.secondary },
});
