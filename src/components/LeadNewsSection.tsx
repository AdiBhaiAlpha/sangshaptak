import React from 'react';
import { Article } from '../types';
import { Clock } from 'lucide-react';
import { toBanglaNumber } from '../utils/banglaUtils';

interface LeadNewsSectionProps {
  leadArticle: Article | null;
  subLeadArticles: Article[];
  sideArticles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const LeadNewsSection: React.FC<LeadNewsSectionProps> = ({
  leadArticle,
  subLeadArticles,
  sideArticles,
  onSelectArticle,
}) => {
  const getAuthorName = (art: Article) => {
    if (!art.author) return 'সংশপ্তক ডেস্ক';
    return typeof art.author === 'string' ? art.author : art.author.name;
  };

  const getImageUrl = (art: Article) => {
    return art.imageUrl || (art as any).image || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80';
  };

  const getPublishedTime = (art: Article) => {
    return art.publishedTime || (art as any).publishedAt || 'আজ';
  };

  const getCategoryName = (art: Article) => {
    return art.categoryName || art.category || 'সম্পাদকীয়';
  };

  if (!leadArticle) return null;

  const getLocationText = (art: Article) => {
    if (!art.location) return null;
    if (typeof art.location === 'string') return art.location;
    return art.location.district || art.location.division;
  };

  return (
    <section className="mb-7">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Lead Story (Takes 8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div 
            onClick={() => onSelectArticle(leadArticle)}
            className="group cursor-pointer bg-white border border-stone-200/90 hover:border-stone-300 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full rounded-xs"
          >
            {/* Clean Lead Image without overlay pills */}
            <div className="relative overflow-hidden aspect-[16/9] w-full bg-stone-100">
              <img
                src={getImageUrl(leadArticle)}
                alt={leadArticle.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
            </div>

            <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Typographic Kicker */}
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#790102] uppercase mb-2">
                  <span className="font-serif">{getCategoryName(leadArticle)}</span>
                  <span className="text-stone-300">/</span>
                  <span className="text-stone-500 font-sans font-normal text-[11px]">
                    {toBanglaNumber(getPublishedTime(leadArticle))}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 group-hover:text-[#790102] transition-colors leading-[1.25] mb-3">
                  {leadArticle.title}
                </h1>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-4 font-sans">
                  {leadArticle.excerpt}
                </p>
              </div>

              <div className="flex items-center text-xs text-stone-500 pt-3 border-t border-stone-100 space-x-3">
                <span className="font-medium text-stone-800">{getAuthorName(leadArticle)}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-stone-400" />
                  {toBanglaNumber(getPublishedTime(leadArticle))}
                </span>
                {getLocationText(leadArticle) && (
                  <>
                    <span>•</span>
                    <span>{getLocationText(leadArticle)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Side Stack Articles (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col space-y-3.5">
          {sideArticles.slice(0, 3).map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group cursor-pointer bg-white border border-stone-200/90 hover:border-[#790102]/40 hover:shadow-sm transition-all duration-200 p-3.5 flex gap-3.5 flex-1 rounded-xs"
            >
              <div className="relative w-28 sm:w-32 h-20 sm:h-24 flex-shrink-0 overflow-hidden bg-stone-100 rounded-xs">
                <img
                  src={getImageUrl(article)}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#790102] mb-1">
                    <span>{getCategoryName(article)}</span>
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#790102] transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                </div>
                <div className="flex items-center text-[11px] text-stone-400 mt-2">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{toBanglaNumber(getPublishedTime(article))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Lead 4-Column Grid Below Lead */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {subLeadArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="group cursor-pointer bg-white border border-stone-200/80 hover:border-stone-300 hover:shadow-sm transition-all duration-200 flex flex-col overflow-hidden rounded-xs"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
              <img
                src={getImageUrl(article)}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#790102] block mb-1">
                  {getCategoryName(article)}
                </span>
                <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#790102] transition-colors line-clamp-2 leading-snug mb-1.5">
                  {article.title}
                </h4>
                <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed mb-3">
                  {article.excerpt}
                </p>
              </div>
              <div className="text-[11px] text-stone-400 flex items-center pt-2 border-t border-stone-100">
                <Clock className="w-3 h-3 mr-1" />
                <span>{toBanglaNumber(getPublishedTime(article))}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
