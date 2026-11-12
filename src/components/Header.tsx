import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  Calendar,
  BookOpen,
  CreditCard,
  UserCheck,
  IdCard,
  ChevronDown,
  Layers,
  Facebook,
  Twitter,
  Youtube,
  ShieldAlert,
  Brain,
  Music,
  Trophy,
  Palette,
  Newspaper,
  MapPin,
  Clock,
  MoreVertical,
  CalendarDays,
  User
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { CategoryId, ClubMember } from '../types';
import { categories } from '../data/siteData';
import { getBengaliFormattedToday } from '../utils/banglaUtils';

interface HeaderProps {
  currentCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  onOpenEpaper: () => void;
  onOpenConverter: () => void;
  onOpenSearch: () => void;
  onGoHome: () => void;
  currentMember?: ClubMember | null;
  onOpenMembership: () => void;
  onOpenNoticeboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenEpaper,
  onOpenConverter,
  onOpenSearch,
  onGoHome,
  currentMember,
  onOpenMembership,
  onOpenNoticeboard,
}) => {
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const [today, setToday] = useState(getBengaliFormattedToday());
  useEffect(() => {
    const tick = () => setToday(getBengaliFormattedToday());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll listener for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}
      <header className="hidden md:block bg-white border-b border-gray-200">
        {/* Main Masthead Banner */}
        <div className="max-w-7xl mx-auto px-4 py-3.5">
          <div className="grid grid-cols-12 items-center">
            {/* Left: Date Display */}
            <div className="col-span-3 flex items-center text-xs text-gray-500 font-sans">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
              <span className="font-kona">{today.gregorian} ({today.banglaEra})</span>
            </div>

            {/* Center: Brand Masthead */}
            <div className="col-span-6 text-center">
              <div onClick={onGoHome} className="cursor-pointer inline-block group">
                <BrandLogo variant="crimson" size="lg" showSubtitle={true} />
              </div>
            </div>

            {/* Right: empty placeholder to keep grid balance */}
            <div className="col-span-3" />
          </div>
        </div>

        {/* Primary Navigation Bar (Sticky when scrolling) */}
        <nav
          className={`bg-white border-t border-b border-gray-200 transition-all ${
            isSticky ? 'sticky top-0 z-40 shadow-md' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 relative">
            <nav aria-label="Primary navigation" className="py-3">
              {/* First row (longer) */}
              <div className="flex flex-wrap justify-center items-center gap-2 mb-2 w-fit mx-auto">
                <button
                  onClick={onGoHome}
                  aria-current={currentCategory === 'all' || currentCategory === 'latest' ? 'page' : undefined}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:bg-white/90 ${
                    currentCategory === 'all' || currentCategory === 'latest'
                      ? 'bg-[#790102] text-white shadow-sm hover:bg-white hover:text-[#790102]'
                      : 'text-gray-800 hover:bg-stone-100/70'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-sm">সর্বশেষ</span>
                </button>

                {categories.filter(c => ['mouthpiece','literature','study_circle'].includes(c.id)).map((cat) => {
                  const Icon =
                    cat.id === 'mouthpiece' ? Newspaper :
                    cat.id === 'literature' ? Palette :
                    cat.id === 'study_circle' ? Brain :
                    Newspaper;
                  return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    aria-current={currentCategory === cat.id ? 'page' : undefined}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:bg-white/90 whitespace-nowrap ${
                      currentCategory === cat.id
                        ? 'bg-[#790102] text-white shadow-sm hover:bg-white hover:text-[#790102]'
                        : 'text-gray-800 hover:bg-stone-100/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-sm">{cat.name}</span>
                  </button>
                  );
                })}
              </div>

              {/* Second row (shorter), same horizontal center */}
              <div className="flex flex-wrap justify-center items-center gap-2 w-fit mx-auto">
                {categories.filter(c => ['sports','songs_poetry','publications'].includes(c.id)).map((cat) => {
                  const Icon =
                    cat.id === 'sports' ? Trophy :
                    cat.id === 'songs_poetry' ? Music :
                    cat.id === 'publications' ? Newspaper :
                    Newspaper;
                  return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    aria-current={currentCategory === cat.id ? 'page' : undefined}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:bg-white/90 whitespace-nowrap ${
                      currentCategory === cat.id
                        ? 'bg-[#790102] text-white shadow-sm hover:bg-white hover:text-[#790102]'
                        : 'text-gray-800 hover:bg-stone-100/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-sm">{cat.name}</span>
                  </button>
                  );
                })}
              </div>
            </nav>

            {/* Right icons: Membership, E-magazine, Search & Mega Menu */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <button
                onClick={() => (currentMember ? navigate('/profile') : navigate('/login'))}
                className="p-2 text-[#790102] transition cursor-pointer flex items-center hover:scale-110"
                title={currentMember ? `আইডি: ${currentMember.id}` : 'সদস্যপদ আবেদন ও আইডি কার্ড'}
                aria-label={currentMember ? `আইডি: ${currentMember.id}` : 'সদস্যপদ আবেদন ও আইডি কার্ড'}
              >
                <IdCard size={16} className="text-[#790102]" />
              </button>

              <button
                onClick={onOpenEpaper}
                className="p-2 text-gray-800 transition cursor-pointer flex items-center hover:text-[#790102] hover:scale-110"
                title="সংশপ্তক ডিজিটাল প্রকাশনা"
                aria-label="ই-ম্যাগাজিন"
              >
                <BookOpen size={16} className="text-[#790102]" />
              </button>

              <button
                onClick={onOpenSearch}
                className="p-1.5 text-gray-700 hover:text-[#790102] hover:bg-gray-100 rounded-full transition cursor-pointer"
                title="অনুসন্ধান"
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className="p-1.5 text-gray-700 hover:text-[#790102] hover:bg-gray-100 rounded transition cursor-pointer"
                title="মেগা মেনু"
              >
                {megaMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mega Menu Drawer (Desktop) */}
        {megaMenuOpen && (
          <div className="bg-white border-b-2 border-[#790102] shadow-2xl py-6 animate-fadeIn">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-4 gap-6 text-sm">
              <div>
                <h4 className="font-bold text-[#790102] border-b border-gray-200 pb-1 mb-2 font-serif">
                  মুখপত্র ও আন্দোলন
                </h4>
                <ul className="space-y-1.5 text-gray-700">
                  <li>
                    <button
                      onClick={() => {
                        onSelectCategory('mouthpiece');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-[#790102]"
                    >
                      সংশপ্তক সম্পাদকীয়
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onSelectCategory('mouthpiece');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-[#790102]"
                    >
                      শিক্ষা অধিকার আন্দোলন
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onSelectCategory('mymensingh');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-[#790102]"
                    >
                      ময়মনসিংহ জেলা শাখা প্রেসরিলিজ
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#790102] border-b border-gray-200 pb-1 mb-2 font-serif">
                  শিল্প, সাহিত্য ও সংস্কৃতি
                </h4>
                <ul className="space-y-1.5 text-gray-700">
                  <li>
                    <button
                      onClick={() => {
                        onSelectCategory('literature');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-[#790102]"
                    >
                      ছোটগল্প ও কথাসাহিত্য
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onSelectCategory('songs_poetry');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-[#790102]"
                    >
                      কবিতা ও গণসংগীত
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onSelectCategory('literature');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-[#790102]"
                    >
                      বইয়ের জগৎ ও সমালোচনা
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#790102] border-b border-gray-200 pb-1 mb-2 font-serif">
                  দাবা ও পাঠচক্র ক্লাব
                </h4>
                <ul className="space-y-1.5 text-gray-700">
                  <li>
                    <button
                      onClick={() => {
                        onSelectCategory('sports');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-[#790102]"
                    >
                      সংশপ্তক দাবা ক্লাব ও টুর্নামেন্ট
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onSelectCategory('study_circle');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-[#790102]"
                    >
                      সাপ্তাহিক বুদ্ধিবৃত্তিক পাঠচক্র
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onSelectCategory('publications');
                        setMegaMenuOpen(false);
                      }}
                      className="hover:text-[#790102]"
                    >
                      দেয়াল পত্রিকা "অগ্নিশিখা"
                    </button>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 p-3 rounded border border-red-200 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-[#790102] mb-1 font-serif">
                    সদস্য কার্ড গ্রহণ করুন
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    গুগল দিয়ে লগইন করে তাত্ক্ষণিক ক্লাব সদস্য আইডি ও প্রিন্টযোগ্য কার্ড সংগ্রহ করুন।
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMegaMenuOpen(false);
                    currentMember ? navigate('/profile') : navigate('/login');
                  }}
                  className="bg-[#790102] hover:bg-red-800 text-white font-semibold py-1.5 px-3 rounded text-xs transition"
                >
                  {currentMember ? 'আপনার আইডি কার্ড দেখুন' : 'সদস্যপদ আবেদন'}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ================= MOBILE HEADER ================= */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
        {/* Top identity banner */}
        <div className="bg-[#790102] text-white px-3 py-1 text-[11px] flex items-center justify-between">
          <span className="font-medium truncate">
            সংশপ্তক: শিল্প ও সাহিত্য কেন্দ্র • ময়মনসিংহ
          </span>
          <span className="text-yellow-300 text-[10px] font-semibold">
            প্রয়াস ভবন
          </span>
        </div>

        {/* Brand bar */}
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-gray-700 hover:text-[#790102]"
              aria-label="Open Mobile Menu"
            >
              <Menu size={22} />
            </button>
            <div onClick={onGoHome} className="cursor-pointer">
              <BrandLogo variant="crimson" size="sm" showSubtitle={false} />
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => (currentMember ? navigate('/profile') : navigate('/login'))}
              className="bg-[#790102] text-white text-[11px] font-bold px-2 py-1 rounded-xs flex items-center space-x-1"
            >
              <CreditCard size={12} className="text-yellow-300" />
              <span>{currentMember ? 'কার্ড' : 'সদস্যপদ'}</span>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="p-1.5 text-gray-700 hover:text-[#790102]"
              title="প্রোফাইল"
              aria-label="প্রোফাইল"
            >
              <User size={18} />
            </button>

            <button
              onClick={onOpenSearch}
              className="p-1.5 text-gray-600 hover:text-[#790102]"
              title="অনুসন্ধান"
              aria-label="অনুসন্ধান"
            >
              <Search size={18} />
            </button>

            {/* 3-Dot Menu Icon for Mobile Noticeboard & Schedule */}
            {onOpenNoticeboard && (
              <button
                onClick={onOpenNoticeboard}
                className="p-1.5 text-gray-700 hover:text-[#790102] hover:bg-gray-100 rounded-full transition cursor-pointer"
                title="ক্লাব সূচি ও পাঠচক্র নোটিশ"
                aria-label="ক্লাব সূচি ও নোটিশ মেনু"
              >
                <MoreVertical size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Strip on Mobile */}
        <div className="flex items-center space-x-3 px-3 py-1.5 overflow-x-auto text-xs font-semibold border-t border-gray-100 scrollbar-none whitespace-nowrap bg-gray-50">
          <button
            onClick={onGoHome}
            className={`transition ${currentCategory === 'all' || currentCategory === 'latest' ? 'text-[#790102]' : 'text-gray-700'}`}
          >
            সর্বশেষ
          </button>
          {categories.filter(c => c.id !== 'mymensingh').map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.id)}
              className={`transition ${currentCategory === c.id ? 'text-[#790102]' : 'text-gray-700'}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Mobile Slide-in Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
            <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between">
              <div>
                <div className="bg-[#790102] text-white p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src="/assets/sangsaptak-logo.png"
                      alt="সংশপ্তক"
                      className="w-8 h-8 object-contain rounded-full bg-white/10 p-0.5"
                    />
                    <div>
                      <h3 className="font-sangbadpatra font-bold text-lg leading-tight">সংশপ্তক</h3>
                      <p className="text-[11px] text-white/90">
                        শিল্প, সাহিত্য ও বুদ্ধিবৃত্তিক ক্লাব, ময়মনসিংহ
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                    <X size={20} />
                  </button>
                </div>

                {/* Member Card Callout */}
                <div className="p-3 bg-red-50 border-b border-red-200">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      currentMember ? navigate('/profile') : navigate('/login');
                    }}
                    className="w-full bg-[#790102] text-white text-xs font-bold py-2 px-3 rounded flex items-center justify-center space-x-1.5"
                  >
                    <CreditCard size={14} className="text-yellow-300" />
                    <span>{currentMember ? `সদস্য কার্ড (${currentMember.id})` : 'সদস্যপদ আবেদন ও আইডি কার্ড'}</span>
                  </button>
                </div>

                {/* Categories Navigation */}
                <div className="p-4 space-y-2 text-sm font-medium text-gray-800 overflow-y-auto max-h-[60vh]">
                  <button
                    onClick={() => {
                      onGoHome();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-1.5 hover:text-[#790102]"
                  >
                    প্রচ্ছদ
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-1.5 hover:text-[#790102]"
                    >
                      {cat.name}
                    </button>
                  ))}
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left py-1.5 text-[#790102] font-semibold flex items-center space-x-2"
                  >
                    <User size={16} />
                    <span>প্রোফাইল</span>
                  </button>
                  {onOpenNoticeboard && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenNoticeboard();
                      }}
                      className="w-full text-left py-1.5 text-[#790102] font-semibold flex items-center space-x-2"
                    >
                      <CalendarDays size={16} />
                      <span>ক্লাব সূচি ও পাঠচক্র নোটিশ</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onOpenEpaper();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-1.5 text-[#790102] font-semibold flex items-center space-x-2"
                  >
                    <BookOpen size={16} />
                    <span>ডিজিটাল ই-ম্যাগাজিন</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenConverter();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-1.5 text-gray-700"
                  >
                    ইউনিকোড ⇄ বিজয় কনভার্টার
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                <p>প্রয়াস ভবন, ব্যাট বল চত্বর সংলগ্ন, ময়মনসিংহ</p>
                <p className="mt-1">যোগাযোগ: 01316655254 | sangshaptak@gmail.com</p>
              </div>
            </div>

            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
      </header>
    </>
  );
};
