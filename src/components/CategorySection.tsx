import React from 'react';
import { Article } from '../types';
import { ChevronRight, Clock, BookOpen } from 'lucide-react';
import { toBanglaNumber } from '../utils/banglaUtils';

interface CategorySectionProps {
  title: string;
  categoryName: string;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onViewCategory?: (cat: string) => void;
  variant?: 'standard' | 'literature' | 'video' | 'grid';
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  categoryName,
  articles,
  onSelectArticle,
  onViewCategory,
  variant = 'standard',
}) => {
  if (!articles || articles.length === 0) return null;

  const leadArticle = articles[0];
  const otherArticles = articles.slice(1, 5);

  const getAuthorName = (art: Article) => {
    if (!art.author) return 'সংশপ্তক ডেস্ক';
    return typeof art.author === 'string' ? art.author : art.author.name;
  };

  const getImageUrl = (art: Article) => {
    return art.imageUrl || (art as any).image || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80';
  };

  const getPublishedTime = (art: Article) => {
    return art.publishedTime || (art as any).publishedAt || 'আজ';
  };

  // Variant: Literature / Culture Feature (Special for "সংশপ্তক")
  if (variant === 'literature') {
    return (
      <section className="mb-8 border border-amber-200 bg-amber-50/40 p-4 sm:p-5 rounded-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-300">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[#790102]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 border-l-4 border-[#790102] pl-2.5">
              {title}
            </h2>
          </div>
          {onViewCategory && (
            <button
              onClick={() => onViewCategory(categoryName)}
              className="text-xs font-semibold text-[#790102] hover:text-red-900 flex items-center group cursor-pointer"
            >
              আরও পড়ুন
              <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Big Featured Literature Lead */}
          <div 
            onClick={() => onSelectArticle(leadArticle)}
            className="md:col-span-7 cursor-pointer group bg-white border border-amber-200 p-4 rounded shadow-xs hover:shadow-md transition"
          >
            <div className="relative aspect-[16/10] overflow-hidden mb-3 rounded-xs">
              <img
                src={getImageUrl(leadArticle)}
                alt={leadArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="text-xs font-serif tracking-widest text-[#790102] font-bold uppercase mb-1.5">
              সংশপ্তক বিশেষ ক্রোড়পত্র
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#790102] transition leading-snug mb-2">
              {leadArticle.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-3 font-serif">
              {leadArticle.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-amber-100">
              <span className="font-medium text-[#790102]">লেখক: {getAuthorName(leadArticle)}</span>
              <span className="flex items-center text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                {toBanglaNumber(getPublishedTime(leadArticle))}
              </span>
            </div>
          </div>

          {/* 3 Literature Items on Right */}
          <div className="md:col-span-5 flex flex-col space-y-3">
            {otherArticles.slice(0, 3).map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="group cursor-pointer bg-white border border-amber-200 p-3 rounded hover:border-[#790102] transition flex gap-3 flex-1"
              >
                <div className="w-24 h-20 flex-shrink-0 overflow-hidden bg-slate-100 rounded-xs">
                  <img
                    src={getImageUrl(article)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <h4 className="font-serif text-sm font-bold text-gray-900 group-hover:text-[#790102] line-clamp-2 leading-snug">
                    {article.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                    <span>{getAuthorName(article)}</span>
                    <span className="text-gray-400">{toBanglaNumber(getPublishedTime(article))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Variant: Standard 2-column or 3-column newspaper category
  return (
    <section className="mb-6">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-2 mb-3.5 border-b-2 border-gray-200">
        <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-[#790102] pl-2.5">
          {title}
        </h2>
        {onViewCategory && (
          <button
            onClick={() => onViewCategory(categoryName)}
            className="text-xs font-semibold text-[#790102] hover:text-red-900 flex items-center group cursor-pointer"
          >
            আরও
            <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Category Big Lead Item */}
        <div
          onClick={() => onSelectArticle(leadArticle)}
          className="md:col-span-6 group cursor-pointer bg-white border border-gray-200 hover:shadow-xs transition p-3 flex flex-col justify-between"
        >
          <div>
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 mb-2.5">
              <img
                src={getImageUrl(leadArticle)}
                alt={leadArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#790102] transition leading-snug mb-1.5">
              {leadArticle.title}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {leadArticle.excerpt}
            </p>
          </div>
          <div className="flex items-center text-[11px] text-gray-400 mt-2.5 pt-2 border-t border-gray-100">
            <Clock className="w-3 h-3 mr-1" />
            <span>{toBanglaNumber(getPublishedTime(leadArticle))}</span>
          </div>
        </div>

        {/* Small 3 list items */}
        <div className="md:col-span-6 flex flex-col space-y-3">
          {otherArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group cursor-pointer bg-white border border-gray-200 hover:border-gray-300 p-2.5 flex gap-3 transition flex-1"
            >
              <div className="w-24 sm:w-28 h-18 sm:h-20 flex-shrink-0 overflow-hidden bg-slate-100">
                <img
                  src={getImageUrl(article)}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <h4 className="font-serif text-sm font-semibold text-gray-900 group-hover:text-[#790102] line-clamp-2 leading-snug">
                  {article.title}
                </h4>
                <div className="flex items-center text-[11px] text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{toBanglaNumber(getPublishedTime(article))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
