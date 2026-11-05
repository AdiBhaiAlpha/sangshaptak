import React, { useState } from 'react';
import { EpaperPage } from '../types';
import { epaperPages } from '../data/mockNewsData';
import { toBanglaNumber } from '../utils/banglaUtils';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Printer, 
  X, 
  Layers,
  FileText
} from 'lucide-react';

interface EpaperViewProps {
  onBackToHome: () => void;
}

export const EpaperView: React.FC<EpaperViewProps> = ({ onBackToHome }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeClipping, setActiveClipping] = useState<{
    id: string;
    headline: string;
    coords: { x: number; y: number; width: number; height: number };
    snippet: string;
  } | null>(null);
  const [selectedEdition, setSelectedEdition] = useState<string>('ঢাকা সংস্করণ');

  const currentPage: EpaperPage = epaperPages[currentPageIndex] || epaperPages[0];

  const handleNextPage = () => {
    if (currentPageIndex < epaperPages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 75));
  const handleResetZoom = () => setZoomLevel(100);

  const handlePrintClipping = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col">
      {/* Top E-Paper Header Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Branding & Back to Main Portal */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToHome}
              className="bg-red-900/60 hover:bg-red-800 text-white text-xs px-3 py-1.5 rounded flex items-center transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              মূল পোর্টালে ফিরুন
            </button>
            <div className="border-l border-slate-700 pl-3">
              <span className="font-serif text-lg font-bold text-red-400">সংশপ্তক</span>
              <span className="text-xs text-slate-400 ml-2 hidden sm:inline">ই-পেপার অনলাইন সংস্করণ</span>
            </div>
          </div>

          {/* Center: Page Controls */}
          <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1 rounded border border-slate-700 text-xs">
            <button
              onClick={handlePrevPage}
              disabled={currentPageIndex === 0}
              className="p-1 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
              title="পূর্ববর্তী পৃষ্ঠা"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium px-2">
              পৃষ্ঠা {toBanglaNumber(currentPage.pageNumber)} / {toBanglaNumber(epaperPages.length)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPageIndex === epaperPages.length - 1}
              className="p-1 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
              title="পরবর্তী পৃষ্ঠা"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Zoom & Edition Selector */}
          <div className="flex items-center space-x-2 text-xs">
            <select
              value={selectedEdition}
              onChange={(e) => setSelectedEdition(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 focus:outline-none hidden md:block"
            >
              <option value="ঢাকা সংস্করণ">ঢাকা সংস্করণ</option>
              <option value="চট্টগ্রাম সংস্করণ">চট্টগ্রাম সংস্করণ</option>
              <option value="জাতীয় সংস্করণ">জাতীয় সংস্করণ</option>
            </select>

            <div className="flex items-center bg-slate-800 border border-slate-700 rounded overflow-hidden">
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-slate-700 text-slate-300 cursor-pointer"
                title="ছোট করুন"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px]">{zoomLevel}%</span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-slate-700 text-slate-300 cursor-pointer"
                title="বড় করুন"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 hover:bg-slate-700 text-slate-300 border-l border-slate-700 cursor-pointer"
                title="রিসেট"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Epaper Canvas Area */}
      <main className="flex-1 overflow-auto flex items-center justify-center p-4 relative bg-[#1e232a]">
        <div 
          className="relative shadow-2xl transition-all duration-200 bg-white border-2 border-slate-700 select-none"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            maxWidth: '900px',
            width: '100%',
          }}
        >
          {/* Page Image */}
          <div className="relative">
            <img
              src={currentPage.imageUrl}
              alt={`সংশপ্তক পৃষ্ঠা ${currentPage.pageNumber}`}
              className="w-full h-auto block"
              loading="eager"
            />

            {/* Clipping hotspots overlay */}
            {currentPage.clippings && currentPage.clippings.map((clipping) => (
              <div
                key={clipping.id}
                onClick={() => setActiveClipping(clipping)}
                className="absolute border-2 border-red-500/80 bg-red-500/10 hover:bg-red-500/30 cursor-pointer transition-all flex items-center justify-center group"
                style={{
                  top: `${clipping.coords.y}%`,
                  left: `${clipping.coords.x}%`,
                  width: `${clipping.coords.width}%`,
                  height: `${clipping.coords.height}%`,
                }}
                title={`${clipping.headline} (ক্লিপিং দেখতে ক্লিক করুন)`}
              >
                <div className="opacity-0 group-hover:opacity-100 bg-[#790102] text-white text-[10px] px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                  খবর পড়ুন
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Thumbnail Bar */}
      <div className="bg-slate-950 border-t border-slate-800 p-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center space-x-3 px-2">
          <div className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center">
            <Layers className="w-3.5 h-3.5 mr-1 text-red-400" />
            পৃষ্ঠাসমূহ:
          </div>
          {epaperPages.map((page, index) => (
            <button
              key={page.pageNumber}
              onClick={() => setCurrentPageIndex(index)}
              className={`flex-shrink-0 flex flex-col items-center p-1 rounded transition border cursor-pointer ${
                currentPageIndex === index
                  ? 'border-red-500 bg-slate-800'
                  : 'border-slate-800 hover:border-slate-600 bg-slate-900'
              }`}
            >
              <div className="w-14 h-20 overflow-hidden bg-slate-800">
                <img
                  src={page.thumbnailUrl}
                  alt={`পৃষ্ঠা ${page.pageNumber}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`text-[11px] mt-1 ${currentPageIndex === index ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                পৃষ্ঠা {toBanglaNumber(page.pageNumber)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Clipping Pop-up Modal */}
      {activeClipping && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white text-gray-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-gray-200 bg-slate-50 sticky top-0 z-10">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#790102]" />
                <span className="font-serif font-bold text-sm text-[#790102]">
                  সংশপ্তক ই-পেপার ক্লিপিং
                </span>
                <span className="text-xs text-gray-500">
                  (পৃষ্ঠা {toBanglaNumber(currentPage.pageNumber)})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrintClipping}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-600 cursor-pointer"
                  title="প্রিন্ট করুন"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveClipping(null)}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-600 cursor-pointer"
                  title="বন্ধ করুন"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Clipping Content */}
            <div className="p-6">
              <h2 className="font-serif text-2xl font-bold text-gray-950 mb-3 leading-tight">
                {activeClipping.headline}
              </h2>

              <div className="w-full aspect-[16/9] overflow-hidden bg-slate-100 rounded mb-4">
                <img
                  src={currentPage.imageUrl}
                  alt={activeClipping.headline}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="font-serif text-base text-gray-800 leading-relaxed space-y-4">
                <p className="font-semibold text-gray-900 border-l-4 border-[#790102] pl-3 italic">
                  {activeClipping.snippet}
                </p>
                <p>
                  সংশপ্তক ই-পেপার সংস্করণ থেকে সংগৃহীত। কপিরাইট © সংশপ্তক ২০২৬। সর্বস্বত্ব সংরক্ষিত।
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <span>মুদ্রিত তারিখ: ৩১ অক্টোবর ২০২৬</span>
              <button
                onClick={() => setActiveClipping(null)}
                className="bg-[#790102] hover:bg-red-800 text-white px-4 py-1.5 rounded font-medium cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
