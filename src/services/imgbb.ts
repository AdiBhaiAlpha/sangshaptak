const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY as string;

export async function uploadImageToImgbb(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error('imgbb upload failed');
  const json = await res.json();
  if (!json?.data?.url) throw new Error('imgbb no url');
  return json.data.url as string;
}
