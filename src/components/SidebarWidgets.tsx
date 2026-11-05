import React, { useState } from 'react';
import { Article, PollData, ClubMember } from '../types';
import { clubEvents } from '../data/mockNewsData';
import { toBanglaNumber } from '../utils/banglaUtils';
import { 
  Clock, 
  Download, 
  UserCheck,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

interface SidebarWidgetsProps {
  latestArticles: Article[];
  mostReadArticles: Article[];
  poll: PollData;
  currentMember?: ClubMember | null;
  onSelectArticle: (article: Article) => void;
  onOpenEpaper: () => void;
  onOpenMembership: () => void;
  onOpenNoticeboard?: () => void;
  onFilterCampus?: (campus: string) => void;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({
  latestArticles,
  mostReadArticles,
  poll: initialPoll,
  currentMember,
  onSelectArticle,
  onOpenEpaper,
  onOpenMembership,
  onOpenNoticeboard,
}) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');

  // Poll state
  const [poll, setPoll] = useState<PollData>(initialPoll);
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | 'no_comment' | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleVoteSubmit = () => {
    if (!selectedVote || hasVoted) return;
    const updated = { 
      ...poll, 
      totalVotes: poll.totalVotes + 1,
      userVoted: selectedVote 
    };
    if (selectedVote === 'yes') {
      updated.yesPercent = Math.min(100, poll.yesPercent + 1);
    } else if (selectedVote === 'no') {
      updated.noPercent = Math.min(100, poll.noPercent + 1);
    } else {
      updated.noOpinionPercent = Math.min(100, poll.noOpinionPercent + 1);
    }
    setPoll(updated);
    setHasVoted(true);
    setShowResults(true);
  };

  const handleDownloadPollCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 420;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 420);

    ctx.fillStyle = '#790102';
    ctx.fillRect(0, 0, 600, 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Li Alinur Sangbadpatra", "Noto Serif Bengali", serif';
    ctx.fillText('সংশপ্তক: জনমত জরিপ', 30, 45);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px "Li Alinur Sangbadpatra", "Noto Serif Bengali", serif';
    ctx.fillText(poll.question.slice(0, 45), 30, 120);
    if (poll.question.length > 45) {
      ctx.fillText(poll.question.slice(45, 95), 30, 150);
    }

    ctx.font = '16px "Noto Serif Bengali", sans-serif';
    ctx.fillStyle = '#16a34a';
    ctx.fillText(`হ্যাঁ: ${toBanglaNumber(poll.yesPercent)}%`, 30, 210);

    ctx.fillStyle = '#dc2626';
    ctx.fillText(`না: ${toBanglaNumber(poll.noPercent)}%`, 30, 260);

    ctx.fillStyle = '#6b7280';
    ctx.fillText(`মন্তব্য নেই: ${toBanglaNumber(poll.noOpinionPercent)}%`, 30, 310);

    ctx.fillStyle = '#374151';
    ctx.fillText(`মোট সংগৃহীত মতামত: ${toBanglaNumber(poll.totalVotes)} টি`, 30, 360);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 380, 600, 40);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('সংশপ্তক: শিল্প, সাহিত্য, সংস্কৃতি ও বুদ্ধিবৃত্তিক চর্চা কেন্দ্র • ময়মনসিংহ', 30, 405);

    const link = document.createElement('a');
    link.download = `samshaptak-poll-${poll.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const displayedArticles = activeTab === 'latest' ? latestArticles : mostReadArticles;

  return (
    <div className="space-y-6">
      {/* 1. Bespoke Editorial Membership Pass Card */}
      <div className="bg-[#1a0507] text-stone-100 p-5 rounded-xs border border-amber-900/40 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between border-b border-amber-900/50 pb-2.5 mb-3">
          <div className="flex items-center space-x-2">
            <img
              src="/assets/sangsaptak-logo.png"
              alt="সংশপ্তক"
              className="w-5 h-5 object-contain"
            />
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-300/90 font-medium">
              সদস্য পরিষদ · ময়মনসিংহ
            </span>
          </div>
          <span className="text-[10px] text-stone-400 font-mono">২০২৬</span>
        </div>

        {currentMember ? (
          <div>
            <div className="flex items-center space-x-3 my-2.5 bg-white/[0.04] p-3 rounded-xs border border-white/10">
              <img
                src={currentMember.avatarUrl}
                alt={currentMember.name}
                className="w-11 h-11 rounded-full border border-amber-400/80 object-cover"
              />
              <div className="text-xs">
                <span className="font-bold text-amber-200 block text-sm font-serif">{currentMember.name}</span>
                <span className="text-stone-400 font-mono text-[11px]">আইডি: {currentMember.id}</span>
              </div>
            </div>
            <p className="text-xs text-stone-300/90 mb-3.5 leading-relaxed font-sans">
              আপনার ডিজিটাল সদস্য সনদ সক্রিয় আছে। ক্লাবের নিয়মিত পাঠচক্র ও কার্যকলাপে অংশগ্রহণ নিশ্চিত করতে কার্ড প্রিন্ট করুন।
            </p>
            <button
              onClick={onOpenMembership}
              className="w-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold py-2.5 rounded-xs text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1" />
              <span>সদস্য কার্ড দেখুন ও প্রিন্ট করুন</span>
            </button>
          </div>
        ) : (
          <div>
            <h4 className="font-serif text-lg font-bold text-stone-100 mb-1.5 leading-snug">
              সংশপ্তক সাহিত্য, দাবা ও পাঠচক্র ক্লাবে যোগ দিন
            </h4>
            <p className="text-xs text-stone-300/85 mb-4 leading-relaxed font-sans">
              গুগল অ্যাকাউন্টের মাধ্যমে সহজ আবেদন সম্পন্ন করে তাৎক্ষণিক অফিসিয়াল ডিজিটাল সদস্য সনদ ও পরিচয়পত্র সংগ্রহ করুন।
            </p>
            <button
              onClick={onOpenMembership}
              className="w-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold py-2.5 rounded-xs text-xs transition-colors cursor-pointer text-center block shadow-sm tracking-wide"
            >
              Google দিয়ে সদস্যপদ আবেদন করুন
            </button>
          </div>
        )}
      </div>

      {/* 2. Upcoming Club Events & Noticeboard (Desktop View) */}
      <div className="hidden md:block bg-white border border-stone-200/90 p-4 sm:p-5 shadow-xs rounded-xs">
        <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b border-stone-100">
          <h3 className="font-bold text-stone-900 text-base font-serif">
            ক্লাব সূচি ও পাঠচক্র নোটিশ
          </h3>
          <span className="text-[11px] text-stone-400 font-mono">
            সাপ্তাহিক সূচি
          </span>
        </div>

        <div className="space-y-3">
          {clubEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3 bg-stone-50/70 border-l-2 border-[#790102] rounded-xs hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#790102] font-serif text-[11px] tracking-wide">
                  {evt.wing}
                </span>
                <span className="text-stone-400 font-sans text-[11px]">
                  {evt.date} · {evt.time}
                </span>
              </div>
              <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                {evt.title}
              </h4>
              <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 font-sans">
                {evt.venue}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Mobile Quick Trigger: 3-Dot Noticeboard & Schedule Bar */}
      {onOpenNoticeboard && (
        <div
          onClick={onOpenNoticeboard}
          className="md:hidden bg-stone-50 hover:bg-stone-100 border border-stone-200/90 p-3.5 rounded-xs flex items-center justify-between cursor-pointer transition-colors shadow-xs"
        >
          <div className="flex items-center space-x-2">
            <span className="font-bold text-stone-900 text-sm font-serif">
              ক্লাব সূচি ও পাঠচক্র নোটিশ
            </span>
            <span className="text-[10px] text-amber-800 font-mono bg-amber-100/70 px-1.5 py-0.5 rounded-xs">
              সাপ্তাহিক
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-stone-600">
            <span className="text-xs font-sans text-stone-500">সূচি দেখুন</span>
            <MoreVertical size={18} className="text-[#790102]" />
          </div>
        </div>
      )}

      {/* 3. Latest & Most Read Tabs */}
      <div className="bg-white border border-stone-200/90 overflow-hidden shadow-xs rounded-xs">
        <div className="flex border-b border-stone-200/90">
          <button
            onClick={() => setActiveTab('latest')}
            className={`flex-1 py-2.5 text-center font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
              activeTab === 'latest'
                ? 'bg-[#790102] text-white'
                : 'bg-stone-100/70 text-stone-700 hover:bg-stone-200/70'
            }`}
          >
            সর্বশেষ
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`flex-1 py-2.5 text-center font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
              activeTab === 'popular'
                ? 'bg-[#790102] text-white'
                : 'bg-stone-100/70 text-stone-700 hover:bg-stone-200/70'
            }`}
          >
            আলোচিত লেখা
          </button>
        </div>

        <div className="divide-y divide-stone-100">
          {displayedArticles.slice(0, 6).map((article, idx) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group cursor-pointer p-3 hover:bg-stone-50/80 transition-colors duration-150 flex items-start gap-3"
            >
              <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center font-serif text-xs font-bold text-[#790102] bg-red-50 rounded-xs">
                {toBanglaNumber(idx + 1)}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-[#790102] block mb-0.5">
                  {article.categoryName}
                </span>
                <h4 className="font-serif text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-[#790102] line-clamp-2 leading-snug">
                  {article.title}
                </h4>
                <div className="flex items-center text-[10px] text-stone-400 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{toBanglaNumber(article.publishedTime)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Student & Citizen Opinion Poll */}
      <div className="bg-white border border-stone-200/90 p-4 sm:p-5 shadow-xs rounded-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-100">
          <h3 className="font-bold text-stone-900 text-sm sm:text-base font-serif">
            শিক্ষা ও সাংস্কৃতিক মতামত
          </h3>
          <span className="text-[11px] text-stone-400 font-mono">
            ভোট: {toBanglaNumber(poll.totalVotes)}
          </span>
        </div>

        <p className="font-serif text-xs sm:text-sm font-semibold text-stone-900 leading-snug mb-3.5">
          {poll.question}
        </p>

        {!showResults ? (
          <div className="space-y-2 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer p-1.5 rounded-xs hover:bg-stone-50">
              <input
                type="radio"
                name="pollVote"
                checked={selectedVote === 'yes'}
                onChange={() => setSelectedVote('yes')}
                className="accent-[#790102]"
              />
              <span className="text-stone-800 font-medium">হ্যাঁ, একমত</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer p-1.5 rounded-xs hover:bg-stone-50">
              <input
                type="radio"
                name="pollVote"
                checked={selectedVote === 'no'}
                onChange={() => setSelectedVote('no')}
                className="accent-[#790102]"
              />
              <span className="text-stone-800 font-medium">না</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer p-1.5 rounded-xs hover:bg-stone-50">
              <input
                type="radio"
                name="pollVote"
                checked={selectedVote === 'no_comment'}
                onChange={() => setSelectedVote('no_comment')}
                className="accent-[#790102]"
              />
              <span className="text-stone-800 font-medium">মন্তব্য নেই</span>
            </label>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleVoteSubmit}
                disabled={!selectedVote}
                className="flex-1 bg-[#790102] hover:bg-red-800 disabled:opacity-40 text-white font-semibold py-2 rounded-xs transition-colors text-xs cursor-pointer"
              >
                মতামত দিন
              </button>
              <button
                onClick={() => setShowResults(true)}
                className="px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xs transition-colors text-xs cursor-pointer"
              >
                ফলাফল
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs pt-1">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-emerald-700 font-bold">হ্যাঁ</span>
                <span className="font-bold text-stone-700">{toBanglaNumber(poll.yesPercent)}%</span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${poll.yesPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-red-700 font-bold">না</span>
                <span className="font-bold text-stone-700">{toBanglaNumber(poll.noPercent)}%</span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full rounded-full" style={{ width: `${poll.noPercent}%` }} />
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-stone-100">
              <button
                onClick={handleDownloadPollCard}
                className="text-[#790102] hover:text-red-800 text-[11px] font-semibold flex items-center cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                ফলাফল কার্ড ডাউনলোড
              </button>
              <button
                onClick={() => setShowResults(false)}
                className="text-stone-500 text-[11px] cursor-pointer"
              >
                পুনরায় ভোট দিন
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Bespoke Editorial Publication Showcase Card */}
      <div 
        onClick={onOpenEpaper}
        className="cursor-pointer group relative bg-stone-900 hover:bg-stone-950 text-white p-4 sm:p-5 rounded-xs border border-stone-800 transition-all duration-300 shadow-sm overflow-hidden"
      >
        <div className="flex gap-3.5 items-center">
          {/* Magazine Cover Thumbnail */}
          <div className="w-20 h-28 flex-shrink-0 rounded-xs overflow-hidden border border-amber-500/30 shadow-md group-hover:scale-105 transition-transform duration-300 bg-stone-950">
            <img
              src="/assets/sangsaptak-magazine-cover.jpg"
              alt="সংশপ্তক বিশেষ প্রকাশনা প্রচ্ছদ"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex-1 min-w-0 border-l border-stone-800 pl-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300 font-medium block mb-1">
              ডিজিটাল প্রকাশনা · ই-ম্যাগাজিন
            </span>
            <h4 className="text-sm sm:text-base font-bold font-serif text-stone-100 group-hover:text-amber-200 transition-colors leading-snug">
              সংশপ্তক মুদ্রিত সংখ্যা ও দেয়াল পত্রিকা পড়ুন
            </h4>
            <p className="text-xs text-stone-400 mt-1.5 flex items-center gap-1 font-sans">
              পাতা উল্টানোর পূর্ণাঙ্গ ডিজিটাল সংস্করণ <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
