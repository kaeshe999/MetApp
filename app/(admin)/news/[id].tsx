import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NewsForm, type NewsFormData, type NewsFormState } from '@/features/news/NewsForm';
import { updateNews } from '@/features/news/newsActions';
import { useAuth } from '@/lib/auth';
import { Colors } from '@/lib/theme';
import type { News } from '@/types';

const CLUB_ID = 'methb';

export default function EditNewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'clubs', CLUB_ID, 'news', id))
      .then((snap) => {
        if (snap.exists()) setNews({ id: snap.id, ...snap.data() } as News);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (data: NewsFormData, state: NewsFormState, status: 'draft' | 'published') => {
    if (!user || !id) return;
    setError('');
    setSubmitting(true);
    try {
      await updateNews(id, {
        title: data.title,
        body: data.body,
        coverImageUri: state.coverImageUri,
        coverImageUrl: state.coverImageUrl,
        galleryUris: state.galleryUris,
        galleryUrls: state.galleryUrls,
        authorId: user.uid,
        status,
      });
      router.back();
    } catch (err) {
      console.error('[updateNews]', err);
      setError('Error al guardar. Intenta de nuevo.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.secondary} />
      </View>
    );
  }

  if (!news) return null;

  return (
    <NewsForm
      defaultValues={{ title: news.title, body: news.body }}
      initialState={{
        coverImageUrl: news.coverImageUrl,
        galleryUrls: news.gallery ?? [],
      }}
      submitting={submitting}
      error={error}
      onSubmit={onSubmit}
      submitLabel="Guardar cambios"
    />
  );
}
