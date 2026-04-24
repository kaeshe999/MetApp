import { createContext, useContext, useEffect, useState, ReactNode, createElement } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export type UserRole = 'admin' | 'editor';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole | null;
  clubId: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Seteamos el usuario basico de Firebase Auth de inmediato
        const baseUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: null,
          clubId: null,
        };
        setUser(baseUser);
        setLoading(false);

        // Luego intentamos enriquecer con datos de Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              ...baseUser,
              role: data['role'] as UserRole,
              clubId: data['clubId'] as string,
            });
          }
        } catch {
          // Si falla Firestore, el usuario sigue autenticado con role null
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return createElement(AuthContext.Provider, { value: { user, loading } }, children);
}

export function useAuth() {
  return useContext(AuthContext);
}

export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}
