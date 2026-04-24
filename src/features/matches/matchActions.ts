import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MatchStatus, HomeAway } from '@/types';

const CLUB_ID = 'methb';

export interface CreateMatchInput {
  opponent: string;
  date: Date;
  venue: string;
  venueMapsUrl: string;
  category: string;
  homeAway: HomeAway;
  seasonId: string;
  updatedBy: string;
}

export async function createMatch(input: CreateMatchInput): Promise<void> {
  await addDoc(collection(db, 'clubs', CLUB_ID, 'matches'), {
    ...input,
    date: Timestamp.fromDate(input.date),
    status: 'scheduled' as MatchStatus,
    scoreHome: 0,
    scoreAway: 0,
    rosterPlayerIds: [],
    updatedAt: Timestamp.now(),
  });
}

export async function deleteMatch(matchId: string): Promise<void> {
  await deleteDoc(doc(db, 'clubs', CLUB_ID, 'matches', matchId));
}

export async function updateMatchScore(
  matchId: string,
  scoreHome: number,
  scoreAway: number,
  status: MatchStatus,
  updatedBy: string
): Promise<void> {
  await updateDoc(doc(db, 'clubs', CLUB_ID, 'matches', matchId), {
    scoreHome,
    scoreAway,
    status,
    updatedAt: Timestamp.now(),
    updatedBy,
  });
}
