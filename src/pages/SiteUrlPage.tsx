import React, { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { useSiteUrl } from '../hooks/useSiteUrl';

export default function SiteUrlPage() {
  const url = useSiteUrl();
  const [fetched, setFetched] = useState<string>('');
  useEffect(() => {
    setFetched(window.location.href);
    const id = setInterval(() => setFetched(window.location.href), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="bg-white p-6 rounded border border-gray-200 shadow-xs">
      <SEO title="Site URL" />
      <h1 className="font-serif text-2xl font-bold text-gray-950 mb-4">বর্তমান সাইট URL</h1>
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">window.location.href:</span> {url}</p>
        <p><span className="font-semibold">Fetched every second:</span> {fetched}</p>
        <p><span className="font-semibold">Origin:</span> {typeof window !== 'undefined' ? window.location.origin : ''}</p>
        <p><span className="font-semibold">Pathname:</span> {typeof window !== 'undefined' ? window.location.pathname : ''}</p>
      </div>
    </div>
  );
}
