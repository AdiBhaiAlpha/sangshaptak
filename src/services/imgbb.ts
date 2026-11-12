const IMGBB_KEY = (import.meta.env.VITE_IMGBB_API_KEY as string) || '3601399f318b007db7c3a8fdf499d8d0';

export async function uploadImageToImgbb(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error('imgbb upload failed');
  const json = await res.json();
  const url = json?.data?.image?.url || json?.data?.display_url || json?.data?.url;
  if (!url) throw new Error('imgbb no url');
  return url as string;
}
