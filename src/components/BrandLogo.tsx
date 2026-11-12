import React from 'react';

interface BrandLogoProps {
  variant?: 'black' | 'white' | 'crimson';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showEmblem?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'black',
  size = 'md',
  showSubtitle = true,
  showEmblem = true,
  className = '',
}) => {
  const isWhite = variant === 'white';
  const isCrimson = variant === 'crimson';

  const textColor = isWhite ? 'text-white' : isCrimson ? 'text-[#790102]' : 'text-[#121212]';
  const subColor = isWhite ? 'text-gray-200' : 'text-gray-600';

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
    xl: 'text-5xl md:text-6xl',
  };

  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-11 h-11 md:w-13 md:h-13',
    xl: 'w-14 h-14 md:w-16 md:h-16',
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* Brand Title with Authentic Calligraphic Emblem */}
      <div className="relative flex items-center justify-center gap-2.5 sm:gap-3">
        {showEmblem && (
          <img
            src="/assets/sangsaptak-logo.png"
            alt="সংশপ্তক প্রতীক"
            className={`${emblemSizes[size]} object-contain flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}
            loading="eager"
          />
        )}
        <h1
          className={`font-sangbadpatra font-black tracking-tight leading-none ${sizeClasses[size]} ${textColor}`}
          style={{
            fontFamily: "'Li Alinur Sangbadpatra', 'Li Alinur Sangbadpatra Unicode', 'Noto Serif Bengali', 'Tiro Bangla', serif",
            textShadow: 'none',
          }}
        >
          সংশপ্তক
        </h1>
      </div>

      {showSubtitle && (
        <div className="flex items-center gap-1.5 mt-1 text-[10px] md:text-[11px] font-sans tracking-wide">
          <span className={`h-[1px] w-4 ${isWhite ? 'bg-white/40' : 'bg-gray-300'}`} />
          <span className={`${subColor} font-semibold text-center`}>
            শিল্প, সাহিত্য, সংস্কৃতি ও বুদ্ধিবৃত্তিক চর্চা কেন্দ্র • ময়মনসিংহ
          </span>
          <span className={`h-[1px] w-4 ${isWhite ? 'bg-white/40' : 'bg-gray-300'}`} />
        </div>
      )}
    </div>
  );
};

