import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

const CLUB_ID = 'methb';

async function uploadImage(uri: string, path: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}

export interface NewsFormInput {
  title: string;
  body: string;
  coverImageUri: string | null;      // uri local o null si no cambio
  coverImageUrl: string;             // url existente (para edicion)
  galleryUris: string[];             // uris locales nuevas a subir
  galleryUrls: string[];             // urls existentes que se mantienen
  authorId: string;
  status: 'draft' | 'published';
}

export async function createNews(input: NewsFormInput): Promise<void> {
  let coverImageUrl = '';
  if (input.coverImageUri) {
    coverImageUrl = await uploadImage(
      input.coverImageUri,
      `clubs/${CLUB_ID}/news/cover_${Date.now()}.jpg`
    );
  }

  const gallery: string[] = [...input.galleryUrls];
  for (let i = 0; i < input.galleryUris.length; i++) {
    const url = await uploadImage(
      input.galleryUris[i],
      `clubs/${CLUB_ID}/news/gallery_${Date.now()}_${i}.jpg`
    );
    gallery.push(url);
  }

  await addDoc(collection(db, 'clubs', CLUB_ID, 'news'), {
    title: input.title,
    body: input.body,
    coverImageUrl,
    gallery,
    authorId: input.authorId,
    status: input.status,
    publishedAt: serverTimestamp(),
  });
}

export async function updateNews(newsId: string, input: NewsFormInput): Promise<void> {
  let coverImageUrl = input.coverImageUrl;
  if (input.coverImageUri) {
    coverImageUrl = await uploadImage(
      input.coverImageUri,
      `clubs/${CLUB_ID}/news/cover_${Date.now()}.jpg`
    );
  }

  const gallery: string[] = [...input.galleryUrls];
  for (let i = 0; i < input.galleryUris.length; i++) {
    const url = await uploadImage(
      input.galleryUris[i],
      `clubs/${CLUB_ID}/news/gallery_${Date.now()}_${i}.jpg`
    );
    gallery.push(url);
  }

  await updateDoc(doc(db, 'clubs', CLUB_ID, 'news', newsId), {
    title: input.title,
    body: input.body,
    coverImageUrl,
    gallery,
    status: input.status,
    publishedAt: input.status === 'published' ? serverTimestamp() : Timestamp.now(),
  });
}

export async function deleteNews(newsId: string): Promise<void> {
  await deleteDoc(doc(db, 'clubs', CLUB_ID, 'news', newsId));
}
