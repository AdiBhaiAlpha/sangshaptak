import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useArticles } from '../context/ArticlesContext';
import { ArticleDetailView } from '../components/ArticleDetailView';

export default function ArticlePage() {
  const { id } = useParams();
  const { articles } = useArticles();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (!articles.length) {
      setCurrentIndex(null);
      return;
    }
    const found = articles.findIndex((a) => a.id === id);
    setCurrentIndex(found === -1 ? 0 : found);
  }, [articles, id]);

  const currentArticle = currentIndex != null ? articles[currentIndex] : null;

  const loadNext = useCallback(() => {
    if (!articles.length || currentIndex == null || isLoadingRef.current) return;
    const nextIndex = currentIndex + 1 >= articles.length ? 0 : currentIndex + 1;
    isLoadingRef.current = true;
    setCurrentIndex(nextIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', `/article/${articles[nextIndex].id}`);
    setTimeout(() => {
      isLoadingRef.current = false;
    }, 300);
  }, [articles, currentIndex]);

  const onScroll = useCallback(() => {
    if (!currentArticle || isLoadingRef.current) return;
    const { scrollY, innerHeight } = window;
    const html = document.documentElement;
    const height = Math.max(
      html.scrollHeight,
      html.offsetHeight,
      document.body.scrollHeight,
      document.body.offsetHeight
    );
    if (scrollY + innerHeight >= height - 150) {
      loadNext();
    }
  }, [currentArticle, loadNext]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  if (!currentArticle) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded border border-gray-200 shadow-xs text-center text-gray-500">
        লেখা পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded border border-gray-200 shadow-xs">
      <SEO title={currentArticle.title} description={currentArticle.excerpt} image={currentArticle.imageUrl} />
      <ArticleDetailView
        article={currentArticle}
        relatedArticles={articles.filter((a) => a.id !== currentArticle.id && a.category === currentArticle.category)}
        onSelectArticle={(a) => {
          const idx = articles.findIndex((x) => x.id === a.id);
          setCurrentIndex(idx);
          window.scrollTo(0, 0);
          window.history.pushState(null, '', `/article/${a.id}`);
        }}
        onBackToHome={() => (window.location.href = '/')}
        onTagClick={() => {}}
      />
    </div>
  );
}
