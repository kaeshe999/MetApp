import { useState } from 'react';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { NewsForm, type NewsFormData, type NewsFormState } from '@/features/news/NewsForm';
import { createNews } from '@/features/news/newsActions';
import { useAuth } from '@/lib/auth';
import { Colors } from '@/lib/theme';

export default function CreateNewsScreen() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data: NewsFormData, state: NewsFormState, status: 'draft' | 'published') => {
    if (!user) return;
    setError('');
    setSubmitting(true);
    try {
      await createNews({
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
      console.error('[createNews]', err);
      setError('Error al guardar. Intenta de nuevo.');
      setSubmitting(false);
    }
  };

  return (
    <NewsForm
      submitting={submitting}
      error={error}
      onSubmit={onSubmit}
    />
  );
}
