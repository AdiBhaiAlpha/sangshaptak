import React, { useState } from 'react';
import { Article } from '../types';
import { mockArticles } from '../data/mockNewsData';
import { toBanglaNumber } from '../utils/banglaUtils';
import { Search, X, Clock, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('সব');

  if (!isOpen) return null;

  const categories = ['সব', 'জাতীয়', 'সাহিত্য ও সাময়িকী', 'রাজনীতি', 'আন্তর্জাতিক', 'অর্থনীতি', 'খেলা', 'বিজ্ঞান ও প্রযুক্তি'];

  const getArticleBodyText = (art: Article) => {
    if (Array.isArray(art.content)) return art.content.join(' ');
    return (art as any).body || art.excerpt;
  };

  const getImageUrl = (art: Article) => {
    return art.imageUrl || (art as any).image || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80';
  };

  const getCategoryName = (art: Article) => {
    return art.categoryName || art.category || 'সংবাদ';
  };

  const filteredArticles = mockArticles.filter((article) => {
    const catName = getCategoryName(article);
    const matchesCat = selectedCategory === 'সব' || catName.includes(selectedCategory);
    const bodyText = getArticleBodyText(article);
    const matchesQuery =
      !query.trim() ||
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      bodyText.toLowerCase().includes(query.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      (article.tags && article.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-start justify-center pt-16 px-4 backdrop-blur-xs">
      <div className="bg-white rounded-md max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-200 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="সংশপ্তকে খবর, সাহিত্য, লেখক বা বিষয় খুঁজুন..."
            className="flex-1 bg-transparent border-none text-base sm:text-lg text-gray-900 focus:outline-none placeholder-gray-400 font-serif"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 ml-2 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="px-4 py-2 bg-gray-100/70 border-b border-gray-200 flex items-center space-x-1.5 overflow-x-auto text-xs">
          <span className="text-gray-500 mr-1 flex-shrink-0">বিভাগ:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#790102] text-white font-medium'
                  : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p className="font-serif text-base mb-1">কোনো সংবাদ বা তথ্য পাওয়া যায়নি</p>
              <p className="text-xs">অনুগ্রহ করে ভিন্ন কোনো শব্দ বা বিভাগ নির্বাচন করে পুনরায় চেষ্টা করুন।</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => {
                  onSelectArticle(article);
                  onClose();
                }}
                className="group cursor-pointer py-3 hover:bg-red-50/40 px-2 rounded transition flex items-start gap-4"
              >
                <div className="w-20 sm:w-24 h-16 sm:h-18 flex-shrink-0 overflow-hidden bg-slate-100 rounded">
                  <img
                    src={getImageUrl(article)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[11px] font-semibold text-[#790102]">{getCategoryName(article)}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[11px] text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {toBanglaNumber(article.publishedTime || (article as any).publishedAt || 'আজ')}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#790102] line-clamp-2 leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-1">
                    {article.excerpt}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#790102] group-hover:translate-x-1 transition self-center hidden sm:block" />
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
          <span>মোট ফলাফল: {toBanglaNumber(filteredArticles.length)} টি</span>
          <span>সংশপ্তক ডিজিটাল আর্কাইভ</span>
        </div>
      </div>
    </div>
  );
};
