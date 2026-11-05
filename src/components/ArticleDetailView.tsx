import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { toBanglaNumber } from '../utils/banglaUtils';
import { 
  Clock, 
  User, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Printer, 
  Copy, 
  Check, 
  ArrowLeft,
  ChevronRight,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

interface ArticleDetailViewProps {
  article: Article;
  relatedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onBackToHome: () => void;
  onTagClick?: (tag: string) => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  relatedArticles,
  onSelectArticle,
  onBackToHome,
  onTagClick,
}) => {
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(142);

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
    return art.categoryName || art.category || 'সংবাদ';
  };

  const getLocationText = (art: Article) => {
    if (!art.location) return null;
    if (typeof art.location === 'string') return art.location;
    return art.location.district || art.location.division;
  };

  const getBodyParagraphs = (art: Article): string[] => {
    if (Array.isArray(art.content)) {
      return art.content;
    }
    if ((art as any).body && typeof (art as any).body === 'string') {
      return (art as any).body.split('\n\n');
    }
    return [art.excerpt];
  };

  const paragraphs = getBodyParagraphs(article);

  // Stop speech when component unmounts or article changes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article.id]);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('আপনার ব্রাউজারে অডিও রিডার সমর্থিত নয়।');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. ${paragraphs.join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.95;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 0:
        return 'text-base leading-relaxed';
      case 1:
        return 'text-lg leading-loose';
      case 2:
        return 'text-xl leading-loose';
      case 3:
        return 'text-2xl leading-loose';
      default:
        return 'text-lg leading-loose';
    }
  };

  return (
    <article className="max-w-4xl mx-auto py-2 px-1 sm:px-0">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-xs text-gray-500 mb-4 pb-2 border-b border-gray-100 flex-wrap gap-1">
        <button
          onClick={onBackToHome}
          className="hover:text-[#790102] flex items-center font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          প্রচ্ছদ
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-[#790102] font-semibold">{getCategoryName(article)}</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-400 truncate max-w-xs">{article.title}</span>
      </nav>

      {/* Shoulder / Kicker */}
      {article.shoulder && (
        <span className="text-xs md:text-sm font-bold text-[#790102] block mb-1">
          {article.shoulder}
        </span>
      )}

      {/* Headline */}
      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-950 leading-tight mb-4">
        {article.title}
      </h1>

      {/* Subtitle / Excerpt */}
      {article.excerpt && (
        <p className="text-gray-600 text-base sm:text-lg leading-normal font-sans mb-5 border-l-4 border-red-700 pl-3 italic">
          {article.excerpt}
        </p>
      )}

      {/* Author & Timestamp Bar */}
      <div className="flex flex-wrap items-center justify-between py-3 border-y border-gray-200 text-xs text-gray-600 gap-y-2 mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center font-medium text-gray-800">
            <User className="w-3.5 h-3.5 mr-1.5 text-[#790102]" />
            <span>{getAuthorName(article)}</span>
          </div>
          {getLocationText(article) && (
            <div className="flex items-center text-gray-500">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span>{getLocationText(article)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-500">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            <span>প্রকাশ: {toBanglaNumber(getPublishedTime(article))}</span>
          </div>
        </div>
      </div>

      {/* Control Toolbar (TTS Audio Reader, Font Resizer, Print, Social Share) */}
      <div className="flex flex-wrap items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-xs mb-6 text-xs gap-3">
        {/* Left: Audio Read & Font Resize */}
        <div className="flex items-center space-x-2">
          {/* Audio reader button */}
          <button
            onClick={toggleSpeech}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition cursor-pointer ${
              isSpeaking
                ? 'bg-red-700 text-white animate-pulse'
                : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="font-medium">পড়া থামান</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#790102]" />
                <span className="font-medium">সংবাদ শুনুন</span>
              </>
            )}
          </button>

          {/* Font resizer [A- / A / A+] */}
          <div className="flex items-center border border-gray-300 bg-white rounded overflow-hidden">
            <button
              onClick={() => setFontSizeLevel((prev) => Math.max(0, prev - 1))}
              title="অক্ষরের আকার ছোট করুন"
              className="px-2 py-1 hover:bg-gray-100 text-gray-700 font-bold border-r border-gray-200 cursor-pointer"
            >
              অ-
            </button>
            <button
              onClick={() => setFontSizeLevel(1)}
              title="স্বাভাবিক আকার"
              className="px-2 py-1 hover:bg-gray-100 text-gray-700 font-bold border-r border-gray-200 text-xs cursor-pointer"
            >
              অ
            </button>
            <button
              onClick={() => setFontSizeLevel((prev) => Math.min(3, prev + 1))}
              title="অক্ষরের আকার বড় করুন"
              className="px-2 py-1 hover:bg-gray-100 text-gray-700 font-bold cursor-pointer"
            >
              অ+
            </button>
          </div>

          <button
            onClick={handlePrint}
            title="সংবাদটি প্রিন্ট করুন"
            className="p-1.5 bg-white border border-gray-300 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Share buttons */}
        <div className="flex items-center space-x-1.5">
          <span className="text-gray-500 mr-1 hidden sm:inline">শেয়ার:</span>
          <button
            onClick={handleCopyLink}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center cursor-pointer"
            title="লিঙ্ক কপি করুন"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span className="text-emerald-600">কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                <span>কপি করুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Featured Main Image */}
      <div className="mb-6">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 rounded-xs shadow-xs">
          <img
            src={getImageUrl(article)}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-xs text-gray-500 mt-2 italic px-1">
          {article.imageCaption || 'ছবি: সংশপ্তক ফটো সার্ভিস / সংগৃহীত'}
        </div>
      </div>

      {/* Google News and Follow Channels banner */}
      <div className="bg-red-50 border border-red-200 p-3 rounded flex items-center justify-between mb-6 text-xs">
        <span className="text-gray-800 font-medium">
          সংশপ্তকের সর্বশেষ খবর পেতে যুক্ত হোন গুগল নিউজ ও হোয়াটসঅ্যাপ চ্যানেলে
        </span>
        <div className="flex space-x-2">
          <span className="bg-[#790102] text-white px-3 py-1 rounded font-semibold cursor-pointer hover:bg-red-800">
            অনুসরণ করুন
          </span>
        </div>
      </div>

      {/* Main Body Content */}
      <div className={`font-serif text-gray-900 ${getFontSizeClass()} space-y-5 text-justify`}>
        {paragraphs.map((paragraph, index) => {
          if (index === 1) {
            return (
              <React.Fragment key={index}>
                <p>{paragraph}</p>
                <div className="my-6 p-4 border-l-4 border-[#790102] bg-slate-50 italic text-gray-800 font-serif">
                  "সংশপ্তক সর্বদা সত্য, সাহিত্য ও জনগণের নির্ভীক কন্ঠস্বর হিসেবে দায়িত্ব পালন করে যাবে।"
                </div>
              </React.Fragment>
            );
          }
          return <p key={index}>{paragraph}</p>;
        })}
      </div>

      {/* Like and Feedback interaction */}
      <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between text-xs">
        <button
          onClick={() => {
            setLiked(!liked);
            setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
          }}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-full border transition cursor-pointer ${
            liked
              ? 'bg-red-50 border-red-300 text-[#790102]'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-[#790102]' : ''}`} />
          <span className="font-semibold">{toBanglaNumber(likeCount)} জন পছন্দ করেছেন</span>
        </button>

        <div className="flex items-center space-x-2 text-gray-500">
          <MessageSquare className="w-4 h-4" />
          <span>মন্তব্য করুন (০)</span>
        </div>
      </div>

      {/* Tags Section */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs font-semibold text-gray-500 mb-2">সম্পর্কিত বিষয়াবলী:</div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick && onTagClick(tag)}
                className="bg-gray-100 hover:bg-red-50 hover:text-[#790102] border border-gray-200 text-xs px-2.5 py-1 rounded-xs text-gray-700 transition cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Related News Section */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="mt-10 pt-6 border-t-2 border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl font-bold text-gray-900 border-l-4 border-[#790102] pl-2">
              আরও পড়ুন
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedArticles.slice(0, 4).map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectArticle(rel)}
                className="group cursor-pointer bg-white border border-gray-200 hover:border-gray-300 p-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100 mb-2">
                    <img
                      src={getImageUrl(rel)}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <h4 className="font-serif text-sm font-bold text-gray-900 group-hover:text-[#790102] line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                </div>
                <div className="text-[11px] text-gray-400 mt-2 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{toBanglaNumber(getPublishedTime(rel))}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
