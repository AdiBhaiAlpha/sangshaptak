import React from 'react';
import { trendingTopics } from '../data/mockNewsData';

interface TrendingBarProps {
  onSelectTopic: (topic: string) => void;
}

export const TrendingBar: React.FC<TrendingBarProps> = ({ onSelectTopic }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center overflow-x-auto scrollbar-none text-xs md:text-sm">
        {/* Trending Badge */}
        <span className="bg-[#b80000] text-white px-2.5 py-0.5 font-bold text-xs mr-3 flex-shrink-0 select-none">
          ট্রেন্ডিং
        </span>

        {/* Trending items */}
        <div className="flex items-center gap-2 whitespace-nowrap">
          {trendingTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => onSelectTopic(topic)}
              className="px-2.5 py-1 text-gray-700 bg-gray-50 hover:bg-red-50 hover:text-[#b80000] border border-gray-200 rounded-sm text-xs font-medium transition cursor-pointer"
            >
              #{topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
