import { Timestamp } from 'firebase/firestore';

export interface Club {
  id: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
  createdAt: Timestamp;
}

export interface Season {
  id: string;
  name: string;
  league: string;
  isActive: boolean;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  position: string;
  photoUrl: string;
  active: boolean;
}

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled';
export type HomeAway = 'home' | 'away';

export interface Match {
  id: string;
  seasonId: string;
  opponent: string;
  date: Timestamp;
  venue: string;
  venueMapsUrl?: string;
  category: string;
  homeAway: HomeAway;
  status: MatchStatus;
  scoreHome: number;
  scoreAway: number;
  rosterPlayerIds: string[];
  updatedAt: Timestamp;
  updatedBy: string;
}

export type NewsStatus = 'draft' | 'published';

export interface News {
  id: string;
  title: string;
  body: string;
  coverImageUrl: string;
  gallery: string[];
  publishedAt: Timestamp;
  authorId: string;
  status: NewsStatus;
}

export interface StandingRow {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Standings {
  table: StandingRow[];
  updatedAt: Timestamp;
}

export type UserRole = 'admin' | 'editor';

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  clubId: string;
  active: boolean;
}
