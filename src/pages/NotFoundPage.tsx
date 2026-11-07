import React from 'react';
import { SEO } from '../components/SEO';

export default function NotFoundPage() {
  return (
    <div className="bg-white p-6 rounded border border-gray-200 shadow-xs">
      <SEO title="NotFound" />
      <h1 className="font-serif text-2xl font-bold text-gray-950 mb-2">NotFound</h1>
      <p className="text-gray-600 text-sm">এই পৃষ্ঠাটি শীঘ্রই সম্পূর্ণ হবে।</p>
    </div>
  );
}
