import React, { useState, useEffect } from 'react';
import { Bell, ChevronRight, Pause, Play } from 'lucide-react';
import { Article } from '../types';

interface BreakingTickerProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  articles,
  onSelectArticle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || articles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, articles.length]);

  if (articles.length === 0) return null;

  const current = articles[currentIndex];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2 text-xs md:text-sm">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          {/* Breaking badge */}
          <div className="flex items-center gap-1.5 bg-[#b80000] text-white px-2.5 py-1 font-bold text-xs uppercase tracking-wider flex-shrink-0 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>ব্রেকিং নিউজ</span>
          </div>

          {/* Headline display */}
          <div
            onClick={() => onSelectArticle(current)}
            className="truncate text-gray-900 font-medium hover:text-[#b80000] cursor-pointer flex-1 transition"
          >
            <span className="font-bold text-[#b80000] mr-2">[{current.categoryName}]</span>
            <span>{current.title}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0 text-gray-400">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:text-gray-700 transition cursor-pointer"
            title={isPaused ? 'চালান' : 'থামান'}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % articles.length)}
            className="p-1 hover:text-[#b80000] transition cursor-pointer"
            title="পরবর্তী সংবাদ"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
