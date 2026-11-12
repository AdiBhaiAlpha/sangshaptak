import React from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useArticles } from '../context/ArticlesContext';
import { categories } from '../data/siteData';

export default function CategoryPage() {
  const { slug } = useParams();
  const { articles } = useArticles();
  const cat = categories.find((c) => c.slug === slug || c.id === slug);
  const title = cat ? cat.name : (slug || 'বিভাগ');
  const items = articles.filter((a) => a.category === slug || a.categoryName === slug || a.categoryName === title);
  return (
    <div>
      <SEO title={title} />
      <div className="bg-white border border-gray-200 p-4 mb-5 rounded shadow-xs">
        <h1 className="font-serif text-2xl font-bold text-gray-950 border-l-4 border-[#790102] pl-3">{title}</h1>
      </div>
      <div className="space-y-4">
        {items.length === 0 && <div className="bg-white p-8 text-center text-gray-500 rounded border">কোনো লেখা নেই</div>}
        {items.map((a) => (
          <div key={a.id} className="bg-white border border-gray-200 p-4 rounded shadow-xs flex gap-4">
            <img src={a.imageUrl} alt={a.title} className="w-40 h-28 object-cover rounded" />
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900">{a.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{a.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
