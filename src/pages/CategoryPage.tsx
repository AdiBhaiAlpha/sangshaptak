import React from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { mockArticles } from '../data/mockNewsData';

export default function CategoryPage() {
  const { slug } = useParams();
  const items = mockArticles.filter((a) => a.category === slug || a.categoryName === slug);
  return (
    <div>
      <SEO title={slug || 'বিভাগ'} />
      <div className="bg-white border border-gray-200 p-4 mb-5 rounded shadow-xs">
        <h1 className="font-serif text-2xl font-bold text-gray-950">{slug}</h1>
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
