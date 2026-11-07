import { useEffect, useState } from 'react';

export function useSiteUrl(): string {
  const [url, setUrl] = useState<string>(() => (typeof window !== 'undefined' ? window.location.href : ''));
  useEffect(() => {
    const update = () => setUrl(window.location.href);
    update();
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  return url;
}
