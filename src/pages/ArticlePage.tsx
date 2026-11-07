import React from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { mockArticles } from '../data/mockNewsData';
import { ArticleDetailView } from '../components/ArticleDetailView';

export default function ArticlePage() {
  const { id } = useParams();
  const article = mockArticles.find((a) => a.id === id) || mockArticles[0];
  return (
    <div className="bg-white p-4 sm:p-6 rounded border border-gray-200 shadow-xs">
      <SEO title={article.title} description={article.excerpt} image={article.imageUrl} />
      <ArticleDetailView
        article={article}
        relatedArticles={mockArticles.filter((a) => a.id !== article.id && a.category === article.category)}
        onSelectArticle={() => {}}
        onBackToHome={() => (window.location.href = '/')}
        onTagClick={() => {}}
      />
    </div>
  );
}
