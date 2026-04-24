import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

// Lee el .env manualmente
const env = readFileSync('.env', 'utf-8');
const vars = Object.fromEntries(
  env.split('\n')
    .filter(l => l.includes('='))
    .map(l => l.split('=').map(s => s.trim()))
);

const app = initializeApp({
  apiKey: vars['EXPO_PUBLIC_FIREBASE_API_KEY'],
  authDomain: vars['EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'],
  projectId: vars['EXPO_PUBLIC_FIREBASE_PROJECT_ID'],
  storageBucket: vars['EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: vars['EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'],
  appId: vars['EXPO_PUBLIC_FIREBASE_APP_ID'],
});

const db = getFirestore(app);
const auth = getAuth(app);
const CLUB_ID = 'methb';

const ADMIN_EMAIL = vars['SEED_EMAIL'];
const ADMIN_PASSWORD = vars['SEED_PASSWORD'];

async function seed() {
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('Autenticado como', ADMIN_EMAIL);
  // 1. Club
  await setDoc(doc(db, 'clubs', CLUB_ID), {
    name: 'Met Handball Club',
    logoUrl: '',
    primaryColor: '#0A1E3C',
    createdAt: Timestamp.now(),
  }, { merge: true });
  console.log('Club creado');

  // 2. Temporada
  await setDoc(doc(db, 'clubs', CLUB_ID, 'seasons', '2026'), {
    name: '2026',
    league: 'Liga Nacional',
    isActive: true,
  }, { merge: true });
  console.log('Temporada 2026 creada');

  // 3. Partidos de prueba
  const matches = [
    {
      seasonId: '2026',
      opponent: 'Club Deportivo Norte',
      date: Timestamp.fromDate(new Date('2026-05-10T16:00:00')),
      venue: 'Gimnasio Met',
      venueMapsUrl: '',
      category: 'Adulto Masculino',
      homeAway: 'home',
      status: 'scheduled',
      scoreHome: 0,
      scoreAway: 0,
      rosterPlayerIds: [],
      updatedAt: Timestamp.now(),
      updatedBy: 'seed',
    },
    {
      seasonId: '2026',
      opponent: 'Handball Sur',
      date: Timestamp.fromDate(new Date('2026-05-17T18:00:00')),
      venue: 'Polideportivo Sur',
      venueMapsUrl: '',
      category: 'Adulto Masculino',
      homeAway: 'away',
      status: 'scheduled',
      scoreHome: 0,
      scoreAway: 0,
      rosterPlayerIds: [],
      updatedAt: Timestamp.now(),
      updatedBy: 'seed',
    },
    {
      seasonId: '2026',
      opponent: 'Academia Central',
      date: Timestamp.fromDate(new Date('2026-04-20T15:00:00')),
      venue: 'Gimnasio Met',
      venueMapsUrl: '',
      category: 'Adulto Masculino',
      homeAway: 'home',
      status: 'finished',
      scoreHome: 28,
      scoreAway: 21,
      rosterPlayerIds: [],
      updatedAt: Timestamp.now(),
      updatedBy: 'seed',
    },
  ];

  for (const match of matches) {
    await addDoc(collection(db, 'clubs', CLUB_ID, 'matches'), match);
  }
  console.log('3 partidos creados');

  // 4. Jugadores de prueba
  const players = [
    { firstName: 'Carlos', lastName: 'Mendoza', jerseyNumber: 7, position: 'Extremo', photoUrl: '', active: true },
    { firstName: 'Diego', lastName: 'Rojas', jerseyNumber: 10, position: 'Central', photoUrl: '', active: true },
    { firstName: 'Felipe', lastName: 'Soto', jerseyNumber: 1, position: 'Portero', photoUrl: '', active: true },
  ];

  for (const player of players) {
    await addDoc(collection(db, 'clubs', CLUB_ID, 'players'), player);
  }
  console.log('3 jugadores creados');

  console.log('\nSeed completado.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
