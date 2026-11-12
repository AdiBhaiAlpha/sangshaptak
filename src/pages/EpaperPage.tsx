import React from 'react';
import { SEO } from '../components/SEO';
import EpaperView from '../components/EpaperView';

export default function EpaperPage() {
  return (
    <div>
      <SEO title="ই-পেপার" />
      <EpaperView onBackToHome={() => (window.location.href = '/')} />
    </div>
  );
}
