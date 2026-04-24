import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Match } from '@/types';

const CLUB_ID = 'methb';

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'clubs', CLUB_ID, 'matches'),
      orderBy('date', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Match[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Match, 'id'>),
        }));
        setMatches(items);
        setLoading(false);
      },
      () => {
        setError('No se pudieron cargar los partidos.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { matches, loading, error };
}
