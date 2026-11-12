import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

const PDFJS_VERSION = '4.8.69';
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export async function pdfPageToImageBlob(
  pdfUrl: string,
  pageNumber: number,
  scale: number = 1.5
): Promise<Blob> {
  const loadingTask = getDocument({ url: pdfUrl });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const ctx = canvas.getContext('2d')!;
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob from canvas'));
      },
      'image/png',
      0.9
    );
  });
}

export async function uploadBlobToImgbb(blob: Blob, fileName: string): Promise<string> {
  const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY || '3601399f318b007db7c3a8fdf499d8d0';
  const form = new FormData();
  form.append('image', blob, fileName);
  form.append('key', IMGBB_KEY);

  const res = await fetch(`https://api.imgbb.com/1/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) throw new Error('imgbb upload failed');
  const json = await res.json();
  const url = json?.data?.image?.url || json?.data?.display_url || json?.data?.url;
  if (!url) throw new Error('imgbb no url');
  return url as string;
}

export async function convertPdfPagesToImgbbUrls(
  pdfUrl: string,
  totalPages: number
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 1; i <= totalPages; i++) {
    const blob = await pdfPageToImageBlob(pdfUrl, i);
    const url = await uploadBlobToImgbb(blob, `page-${i}.png`);
    urls.push(url);
  }
  return urls;
}
