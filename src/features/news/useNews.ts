import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { News } from '@/types';

const CLUB_ID = 'methb';

export function useNews(allStatuses = false) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = allStatuses
      ? query(collection(db, 'clubs', CLUB_ID, 'news'), orderBy('publishedAt', 'desc'))
      : query(
          collection(db, 'clubs', CLUB_ID, 'news'),
          where('status', '==', 'published'),
          orderBy('publishedAt', 'desc')
        );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: News[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<News, 'id'>),
        }));
        setNews(items);
        setLoading(false);
      },
      () => {
        setError('No se pudieron cargar las noticias.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { news, loading, error };
}
