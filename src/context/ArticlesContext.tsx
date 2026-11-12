import React, { createContext, useContext, useEffect, useState } from 'react';
import { Article } from '../types';
import { subscribe } from '../services/db';

interface ArticlesContextValue {
  articles: Article[];
  loading: boolean;
}

const ArticlesContext = createContext<ArticlesContextValue>({ articles: [], loading: true });

function normalizeArticle(raw: any, key: string): Article | null {
  if (!raw || typeof raw !== 'object') return null;
  const author =
    typeof raw.author === 'string'
      ? { name: raw.author }
      : raw.author && typeof raw.author === 'object'
        ? { name: raw.author.name || 'সংশপ্তক প্রতিনিধি', role: raw.author.role, avatar: raw.author.avatar }
        : { name: 'সংশপ্তক প্রতিনিধি' };
  const content = Array.isArray(raw.content)
    ? raw.content.filter((c: any) => typeof c === 'string')
    : typeof raw.content === 'string'
      ? raw.content.split('\n').map((s: string) => s.trim()).filter(Boolean)
      : typeof raw.body === 'string'
        ? raw.body.split('\n').map((s: string) => s.trim()).filter(Boolean)
        : [];
  return {
    id: String(raw.id || key),
    title: String(raw.title || ''),
    shoulder: raw.shoulder ? String(raw.shoulder) : undefined,
    excerpt: String(raw.excerpt || ''),
    content,
    category: (raw.category || 'mouthpiece') as Article['category'],
    categoryName: String(raw.categoryName || raw.category || 'সংবাদ'),
    imageUrl: String(raw.imageUrl || raw.image || '/assets/sangsaptak-editorial-card.jpg'),
    imageCaption: raw.imageCaption ? String(raw.imageCaption) : undefined,
    publishedTime: String(raw.publishedTime || raw.publishedAt || ''),
    author,
    viewsCount: typeof raw.viewsCount === 'number' ? raw.viewsCount : 0,
    readTimeMinutes: typeof raw.readTimeMinutes === 'number' ? raw.readTimeMinutes : undefined,
    tags: Array.isArray(raw.tags) ? raw.tags.filter((t: any) => typeof t === 'string') : [],
    isLead: !!raw.isLead,
    isSpecialFeature: !!raw.isSpecialFeature,
    isVideo: !!raw.isVideo,
    videoDuration: raw.videoDuration ? String(raw.videoDuration) : undefined,
    audioUrl: raw.audioUrl ? String(raw.audioUrl) : undefined,
    location: raw.location,
    ...(typeof raw.createdAt === 'number' ? { createdAt: raw.createdAt } : {}),
  } as Article & { createdAt?: number };
}

export function ArticlesProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribe(
      'articles',
      (v) => {
        try {
          if (v && typeof v === 'object') {
            const list = Object.entries(v as Record<string, unknown>)
              .map(([key, val]) => normalizeArticle(val, key))
              .filter((a): a is Article => !!a && !!a.title)
              .sort((a: any, b: any) => {
                const ca = typeof a.createdAt === 'number' ? a.createdAt : 0;
                const cb = typeof b.createdAt === 'number' ? b.createdAt : 0;
                if (cb !== ca) return cb - ca;
                if (a.isLead && !b.isLead) return -1;
                if (!a.isLead && b.isLead) return 1;
                return String(b.id).localeCompare(String(a.id));
              });
            setArticles(list as Article[]);
          } else {
            setArticles([]);
          }
        } catch (err) {
          console.error('Failed to load articles', err);
          setArticles([]);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Articles subscription failed', err);
        setArticles([]);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return (
    <ArticlesContext.Provider value={{ articles, loading }}>
      {children}
    </ArticlesContext.Provider>
  );
}

export const useArticles = () => useContext(ArticlesContext);