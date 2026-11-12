import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Article, CategoryId } from '../types';
import { 
  poll, 
  categories 
} from '../data/siteData';
import { useArticles } from '../context/ArticlesContext';
import { useMember } from '../context/MemberContext';
import type { AppLayoutOutletContext } from '../components/layout/AppLayout';

import { EventDarkBox } from '../components/EventDarkBox';
import { LeadNewsSection } from '../components/LeadNewsSection';
import { SidebarWidgets } from '../components/SidebarWidgets';
import { CategorySection } from '../components/CategorySection';
import { ArticleDetailView } from '../components/ArticleDetailView';
import { EpaperView } from '../components/EpaperView';

import { ArrowLeft, Clock, MapPin, School } from 'lucide-react';
import { toBanglaNumber } from '../utils/banglaUtils';

export default function HomePage() {
  const { articles } = useArticles();
  const { member: currentMember } = useMember();
  let layout: Partial<AppLayoutOutletContext> = {};
  try {
    layout = useOutletContext<AppLayoutOutletContext>() || {};
  } catch {
    layout = {};
  }
  const openMembership = layout.openMembership || (() => {});
  const openSearch = layout.openSearch || (() => {});
  const openConverter = layout.openConverter || (() => {});
  const openNoticeboard = layout.openNoticeboard || (() => {});
  const openEpaper = layout.openEpaper || (() => {});

  // Navigation / View states
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'epaper' | 'category' | 'campus'>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(articles[0] ?? null);
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>('mouthpiece');
  const [categoryDisplayName, setCategoryDisplayName] = useState<string>('মুখপত্র ও সম্পাদকীয়');
  const [selectedCampus, setSelectedCampus] = useState<string>('');

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedArticle]);

  // Lead and sub-lead curation
  const leadArticle = articles.find((a) => a.isLead) || articles[0];
  const subLeadArticles = leadArticle ? articles.filter((a) => a.id !== leadArticle.id).slice(0, 4) : [];
  const sideLeadArticles = leadArticle ? articles.filter((a) => a.id !== leadArticle.id && !subLeadArticles.some((s) => s.id === a.id)).slice(0, 3) : [];

  // Grouped by Club Wings
  const mouthpieceArticles = articles.filter((a) => a.category === 'mouthpiece');
  const sportsArticles = articles.filter((a) => a.category === 'sports');
  const studyCircleArticles = articles.filter((a) => a.category === 'study_circle');
  const literatureArticles = articles.filter((a) => a.category === 'literature');
  const songsPoetryArticles = articles.filter((a) => a.category === 'songs_poetry');
  const publicationArticles = articles.filter((a) => a.category === 'publications');
  const mymensinghArticles = articles.filter((a) => a.category === 'mymensingh');

  // Latest vs Most Read
  const latestArticles = [...articles];
  const mostReadArticles = [...articles].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));

  // Handlers
  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
  };

  const handleHeaderCategorySelect = (catId: CategoryId) => {
    if (catId === 'latest') {
      setCurrentView('home');
      return;
    }
    const found = categories.find((c) => c.id === catId);
    setCategoryDisplayName(found ? found.name : 'সংবাদ ও মতামত');
    setActiveCategoryId(catId);
    setCurrentView('category');
  };

  const handleFooterCategorySelect = (catName: string) => {
    if (catName === 'ই-ম্যাগাজিন' || catName === 'ডিজিটাল ই-ম্যাগাজিন') {
      setCurrentView('epaper');
      return;
    }
    const found = categories.find((c) => c.name === catName || catName.includes(c.name));
    if (found) {
      setActiveCategoryId(found.id);
      setCategoryDisplayName(found.name);
      setCurrentView('category');
    } else {
      setCategoryDisplayName(catName);
      setCurrentView('category');
    }
  };

  const handleFilterCampus = (campus: string) => {
    if (campus === 'সব ক্যাম্পাস') {
      setCurrentView('home');
    } else {
      setSelectedCampus(campus);
      setCurrentView('campus');
    }
  };

  const handleTopicClick = (_topic: string) => {
    openSearch();
  };

  // If in E-paper / E-magazine view
  if (currentView === 'epaper') {
    return <EpaperView onBackToHome={() => setCurrentView('home')} />;
  }

  return (
    <div className="space-y-0">
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 py-3 w-full">

        {/* View: ARTICLE DETAIL */}
        {currentView === 'article' && selectedArticle && (
          <div className="bg-white p-4 sm:p-6 rounded border border-gray-200 shadow-xs">
            <ArticleDetailView
              article={selectedArticle}
              relatedArticles={articles.filter(
                (a) => a.id !== selectedArticle.id && a.category === selectedArticle.category
              )}
              onSelectArticle={handleSelectArticle}
              onBackToHome={() => setCurrentView('home')}
              onTagClick={handleTopicClick}
            />
          </div>
        )}

        {/* View: CAMPUS FILTERED VIEW */}
        {currentView === 'campus' && selectedCampus && (
          <div>
            <div className="bg-white border border-gray-200 p-4 mb-5 flex items-center justify-between rounded shadow-xs">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-[#790102] text-xs font-semibold flex items-center text-gray-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  প্রচ্ছদে ফিরুন
                </button>
                <div className="border-l border-gray-300 pl-3">
                  <div className="flex items-center space-x-2">
                    <School className="w-5 h-5 text-[#790102]" />
                    <h1 className="font-serif text-2xl font-bold text-gray-950">
                      {selectedCampus} সংবাদ ও কার্যক্রম
                    </h1>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    সংশপ্তক: শিল্প, সাহিত্য ও সংস্কৃতি কেন্দ্র • ময়মনসিংহ
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-4">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => handleSelectArticle(art)}
                    className="group cursor-pointer bg-white border border-gray-200 hover:border-gray-300 p-4 rounded shadow-xs hover:shadow-sm transition flex flex-col sm:flex-row gap-4"
                  >
                    <div className="w-full sm:w-48 h-36 flex-shrink-0 overflow-hidden bg-slate-100 rounded">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 text-xs text-[#790102] font-semibold mb-1">
                          <span>{art.categoryName}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500 font-normal">{selectedCampus}</span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-[#790102] transition leading-snug mb-2">
                          {art.title}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100 mt-2">
                        <span>{art?.author && typeof art.author === 'object' ? art.author.name : (typeof art?.author === 'string' ? art.author : 'সংশপ্তক প্রতিনিধি')}</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {toBanglaNumber(art.publishedTime || '')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-4">
                <SidebarWidgets
                  latestArticles={latestArticles}
                  mostReadArticles={mostReadArticles}
                  poll={poll}
                  currentMember={currentMember}
                  onSelectArticle={handleSelectArticle}
                  onOpenEpaper={() => setCurrentView('epaper')}
                  onOpenMembership={openMembership}
                  onOpenNoticeboard={openNoticeboard}
                  onFilterCampus={handleFilterCampus}
                />
              </div>
            </div>
          </div>
        )}

        {/* View: CATEGORY FILTERED LIST */}
        {currentView === 'category' && (
          <div>
            {/* Category header */}
            <div className="bg-white border border-gray-200 p-4 mb-5 flex items-center justify-between rounded shadow-xs">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-[#790102] text-xs font-semibold flex items-center text-gray-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  প্রচ্ছদে ফিরুন
                </button>
                <div className="border-l border-gray-300 pl-3">
                  <h1 className="font-serif text-2xl font-bold text-gray-950 flex items-center">
                    <span className="w-2.5 h-6 bg-[#790102] mr-2 inline-block"></span>
                    {categoryDisplayName}
                  </h1>
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                সংশপ্তক • ময়মনসিংহ
              </span>
            </div>

            {/* Category Articles Grid & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-4">
                {articles
                  .filter((a) => a.category === activeCategoryId || a.categoryName === categoryDisplayName)
                  .map((art) => (
                    <div
                      key={art.id}
                      onClick={() => handleSelectArticle(art)}
                      className="group cursor-pointer bg-white border border-gray-200 hover:border-gray-300 p-4 rounded shadow-xs hover:shadow-sm transition flex flex-col sm:flex-row gap-4"
                    >
                      <div className="w-full sm:w-48 h-36 flex-shrink-0 overflow-hidden bg-slate-100 rounded">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-2 text-xs text-[#790102] font-semibold mb-1">
                            <span>{art.categoryName}</span>
                          </div>
                          <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-[#790102] transition leading-snug mb-2">
                            {art.title}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                            {art.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100 mt-2">
                          <span>{art?.author && typeof art.author === 'object' ? art.author.name : (typeof art?.author === 'string' ? art.author : 'সংশপ্তক প্রতিনিধি')}</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {toBanglaNumber(art.publishedTime || '')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                {articles.filter((a) => a.category === activeCategoryId || a.categoryName === categoryDisplayName).length === 0 && (
                  <div className="bg-white p-12 text-center text-gray-500 border border-gray-200 rounded">
                    <p className="font-serif text-lg mb-1">এই বিভাগে কোনো লেখা পাওয়া যায়নি</p>
                    <p className="text-xs">শীঘ্রই আরও লেখা ও প্রকাশনা যুক্ত হবে।</p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <SidebarWidgets
                  latestArticles={latestArticles}
                  mostReadArticles={mostReadArticles}
                  poll={poll}
                  currentMember={currentMember}
                  onSelectArticle={handleSelectArticle}
                  onOpenEpaper={() => setCurrentView('epaper')}
                  onOpenMembership={openMembership}
                  onOpenNoticeboard={openNoticeboard}
                  onFilterCampus={handleFilterCampus}
                />
              </div>
            </div>
          </div>
        )}

        {/* View: HOMEPAGE */}
        {currentView === 'home' && (
          <div>
            {articles.length === 0 && (
              <div className="bg-white border border-stone-200 rounded p-8 text-center text-gray-500 mb-6">
                <p className="font-serif text-lg mb-1">এখনো কোনো সংবাদ আপলোড করা হয়নি।</p>
                <p className="text-xs">অ্যাডমিন প্যানেল থেকে সংবাদ যুক্ত করুন।</p>
              </div>
            )}
            {/* Club Wings Highlight Box (Chess, Study Circle, Songs & Poetry, Wall Magazine) */}
            <EventDarkBox
              articles={articles}
              onSelectArticle={handleSelectArticle}
              onOpenMembership={openMembership}
            />

            {/* Main Split: 8 cols for News/Mag Content, 4 cols for Sidebar Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (8 cols): Lead stories & Wing Sections */}
              <div className="lg:col-span-8">
                {/* 1. Primary Lead & Sub-Lead News Grid */}
                <LeadNewsSection
                  leadArticle={leadArticle}
                  subLeadArticles={subLeadArticles}
                  sideArticles={sideLeadArticles}
                  onSelectArticle={handleSelectArticle}
                />

                {/* 2. মুখপত্র ও সম্পাদকীয় (Mouthpiece Lead Block) */}
                <CategorySection
                  title="মুখপত্র ও সম্পাদকীয়"
                  categoryName="মুখপত্র ও সম্পাদকীয়"
                  articles={mouthpieceArticles}
                  onSelectArticle={handleSelectArticle}
                  onViewCategory={() => handleHeaderCategorySelect('mouthpiece')}
                />

                {/* 3. ক্রীড়া */}
                <CategorySection
                  title="ক্রীড়া"
                  categoryName="ক্রীড়া"
                  articles={sportsArticles}
                  onSelectArticle={handleSelectArticle}
                  onViewCategory={() => handleHeaderCategorySelect('sports')}
                />

                {/* 4. বুদ্ধিবৃত্তিক পাঠচক্র */}
                <CategorySection
                  title="বুদ্ধিবৃত্তিক পাঠচক্র"
                  categoryName="বুদ্ধিবৃত্তিক পাঠচক্র"
                  articles={studyCircleArticles}
                  onSelectArticle={handleSelectArticle}
                  onViewCategory={() => handleHeaderCategorySelect('study_circle')}
                />

                {/* 5. শিল্প, সাহিত্য ও সংস্কৃতি */}
                <CategorySection
                  title="শিল্প, সাহিত্য ও সংস্কৃতি"
                  categoryName="শিল্প, সাহিত্য ও সংস্কৃতি"
                  articles={literatureArticles}
                  onSelectArticle={handleSelectArticle}
                  onViewCategory={() => handleHeaderCategorySelect('literature')}
                  variant="literature"
                />
              </div>

              {/* Right Column (4 cols): Sidebar with Membership Box, Club Noticeboard, Tabs, Poll, Campus Search */}
              <div className="lg:col-span-4">
                <div className="sticky top-20">
                  <SidebarWidgets
                    latestArticles={latestArticles}
                    mostReadArticles={mostReadArticles}
                    poll={poll}
                    currentMember={currentMember}
                    onSelectArticle={handleSelectArticle}
                    onOpenEpaper={() => setCurrentView('epaper')}
                  onOpenMembership={openMembership}
                  onOpenNoticeboard={openNoticeboard}
                    onFilterCampus={handleFilterCampus}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
