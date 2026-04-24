import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

const CLUB_ID = 'methb';

interface CreateNewsInput {
  title: string;
  body: string;
  imageUri: string | null;
  authorId: string;
  status: 'draft' | 'published';
}

export async function createNews(input: CreateNewsInput): Promise<void> {
  let coverImageUrl = '';

  if (input.imageUri) {
    const response = await fetch(input.imageUri);
    const blob = await response.blob();
    const filename = `cover_${Date.now()}.jpg`;
    const storageRef = ref(storage, `clubs/${CLUB_ID}/news/${filename}`);
    await uploadBytes(storageRef, blob);
    coverImageUrl = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, 'clubs', CLUB_ID, 'news'), {
    title: input.title,
    body: input.body,
    coverImageUrl,
    gallery: [],
    authorId: input.authorId,
    status: input.status,
    publishedAt: serverTimestamp(),
  });
}
