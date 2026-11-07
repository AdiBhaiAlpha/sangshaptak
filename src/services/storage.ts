import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export async function uploadPdfToFirebase(file: File, path: string): Promise<string> {
  const r = ref(storage, path);
  await uploadBytes(r, file, { contentType: 'application/pdf' });
  return getDownloadURL(r);
}
