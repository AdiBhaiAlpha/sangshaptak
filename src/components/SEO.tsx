import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
}

export function SEO({ title, description, canonical, image }: SEOProps) {
  const siteName = import.meta.env.VITE_APP_NAME || 'সংশপ্তক';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const desc = description || 'সংশপ্তক: শিল্প, সাহিত্য, সংস্কৃতি ও বুদ্ধিবৃত্তিক চর্চা কেন্দ্র।';
  const url = canonical || (typeof window !== 'undefined' ? window.location.href : '');
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
