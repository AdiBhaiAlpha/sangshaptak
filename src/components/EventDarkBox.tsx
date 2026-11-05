import React from 'react';
import { Article } from '../types';
import { ChevronRight } from 'lucide-react';

interface EventDarkBoxProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onOpenMembership?: () => void;
}

export const EventDarkBox: React.FC<EventDarkBoxProps> = ({
  articles,
  onSelectArticle,
  onOpenMembership,
}) => {
  // Key wing features mapped to curated articles
  const chessArticle = articles.find((a) => a.category === 'chess') || articles[1];
  const studyArticle = articles.find((a) => a.category === 'study_circle') || articles[2];
  const songsArticle = articles.find((a) => a.category === 'songs_poetry') || articles[3];
  const publicationArticle = articles.find((a) => a.category === 'publications') || articles[4];

  const wings = [
    {
      index: '০১',
      wingName: 'দাবা ও মনন চর্চা',
      article: chessArticle,
      accentColor: 'text-amber-300',
    },
    {
      index: '০২',
      wingName: 'বুদ্ধিবৃত্তিক পাঠচক্র ও দর্শন',
      article: studyArticle,
      accentColor: 'text-emerald-300',
    },
    {
      index: '০৩',
      wingName: 'গণসংগীত ও কবিতা সন্ধ্যা',
      article: songsArticle,
      accentColor: 'text-rose-300',
    },
    {
      index: '০৪',
      wingName: 'সাহিত্য প্রকাশনা ও দেয়াল পত্রিকা',
      article: publicationArticle,
      accentColor: 'text-sky-300',
    },
  ];

  return (
    <section className="bg-[#0e1014] text-stone-100 py-7 md:py-9 my-5 rounded-sm border-t-2 border-amber-700/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Editorial Section Header */}
        <div className="border-b border-stone-800 pb-4 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-amber-400/90 font-medium block mb-1">
              কার্যক্রম · ২০২৬
            </span>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-serif text-stone-100 tracking-tight leading-snug">
              ক্লাব কার্যক্রম: দাবা, পাঠচক্র, সাহিত্য ও সংগীত
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 font-sans">
              সুস্থ সংস্কৃতি ও মননশীল চিন্তার বিকাশ মঞ্চ, প্রয়াস ভবন, ময়মনসিংহ
            </p>
          </div>

          {onOpenMembership && (
            <button
              onClick={onOpenMembership}
              className="self-start md:self-auto text-xs font-semibold text-amber-300 hover:text-amber-200 border-b border-amber-400/40 pb-0.5 hover:border-amber-300 transition-colors cursor-pointer"
            >
              সদস্যপদ আবেদন ও সূচি দেখুন
            </button>
          )}
        </div>

        {/* 4 Cards Grid - Zero Pill, Pure Editorial Framing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {wings.map((wing) => {
            const art = wing.article;
            return (
              <div
                key={wing.index}
                onClick={() => onSelectArticle(art)}
                className="group cursor-pointer bg-stone-900/40 hover:bg-stone-900/90 border border-stone-800/80 hover:border-amber-500/40 p-3.5 sm:p-4 rounded-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Clean Image Container without pill badges */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xs mb-3 bg-stone-950">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  </div>

                  {/* Editorial Wing Header */}
                  <div className="flex items-center gap-1.5 text-xs font-mono font-medium mb-1.5">
                    <span className="text-amber-400/80">{wing.index}</span>
                    <span className="text-stone-600">/</span>
                    <span className={`${wing.accentColor} font-sans font-semibold tracking-wide text-[11px]`}>
                      {wing.wingName}
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="font-serif text-sm sm:text-base font-bold text-stone-100 group-hover:text-amber-200 transition-colors line-clamp-2 leading-snug mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed font-sans">
                    {art.excerpt}
                  </p>
                </div>

                {/* Card Footer with quiet byline */}
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-3 border-t border-stone-800/60 mt-4">
                  <span className="truncate pr-2">{art.author.name}</span>
                  <span className="flex items-center text-amber-300/90 font-medium group-hover:translate-x-1 transition-transform flex-shrink-0">
                    বিস্তারিত <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
