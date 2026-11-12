import React, { useState, useRef, useCallback } from 'react';
import ReactPageFlip from 'react-pageflip';
import { FileText, Download, ArrowLeft, ChevronLeft, ChevronRight, BookOpen, RotateCcw } from 'lucide-react';

interface FlipBookViewerProps {
  pageImages: string[];
  onBackToHome: () => void;
  totalPages?: number;
}

export default function FlipBookViewer({ pageImages, onBackToHome, totalPages }: FlipBookViewerProps) {
  const flipRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const total = totalPages || pageImages.length;

  const nextPage = useCallback(() => {
    flipRef.current?.pageFlip?.flipNext();
  }, []);

  const prevPage = useCallback(() => {
    flipRef.current?.pageFlip?.flipPrev();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-[#0f172a] min-h-screen text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#111827] border-b border-slate-800 px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToHome}
              className="bg-[#790102] hover:bg-red-800 text-white text-xs px-3 py-1.5 rounded flex items-center transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              মূল পোর্টালে ফিরুন
            </button>
            <div className="border-l border-slate-700 pl-3">
              <span className="font-serif text-lg font-bold text-red-400">সংশপ্তক</span>
              <span className="text-xs text-slate-400 ml-2 hidden sm:inline">ই-ম্যাগাজিন অনলাইন সংস্করণ</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-2.5 py-1 rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${
                currentPage === 1 ? 'text-slate-500 bg-slate-800' : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-400 font-mono mr-1">{currentPage}</span>
            <span className="text-slate-500 text-[10px] mr-1">/</span>
            <span className="text-slate-400 font-mono">{total}</span>
            <button
              onClick={nextPage}
              disabled={currentPage === total}
              className={`px-2.5 py-1 rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${
                currentPage === total ? 'text-slate-500 bg-slate-800' : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="/Shongshoptok_Gothontontro.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-[#790102] hover:bg-red-800 text-white text-xs font-medium"
              title="নতুন ট্যাবে খুলুন"
            >
              <FileText className="w-3 h-3 mr-1" />
              নতুন ট্যাব
            </a>
          </div>
        </div>
      </header>

      {/* Flip Book */}
      <main className="flex-1 bg-[#0f172a] flex-1 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        <div className="relative w-full max-w-4xl h-[85vh] sm:h-[90vh] border border-slate-700 rounded-xl shadow-2xl overflow-hidden bg-white">
          <ReactPageFlip
            ref={flipRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
            size="fixed"
            width={600}
            height={800}
            minWidth={600}
            maxWidth={600}
            minHeight={800}
            maxHeight={800}
            startPage={0}
            drawShadow={true}
            flippingTime={1000}
            usePortrait={true}
            startZIndex={0}
            autoSize={true}
            maxShadowOpacity={1}
            showCover={false}
            mobileScrollSupport={true}
            swipeDistance={30}
            clickEventForward={true}
            useMouseEvents={true}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {pageImages.map((src, index) => (
              <div key={index} className="w-full h-full overflow-hidden bg-white">
                <img src={src} alt={`পৃষ্ঠা ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </ReactPageFlip>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#111827] border-t border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
          <span>সংশপ্তক গঠনতন্ত্র — ফ্লিপ বুক ভিউ</span>
          <div className="flex gap-2">
            <a
              href="/Shongshoptok_Gothontontro.pdf"
              download
              className="border border-slate-700 hover:bg-slate-800 hover:text-white px-2.5 py-1 rounded transition text-slate-300"
              title="PDF ডাউনলোড করুন"
            >
              <Download className="w-3 h-3 mr-1" />
              ডাউনলোড
            </a>
            <button
              onClick={() => window.location.reload()}
              className="border border-slate-700 hover:bg-slate-800 hover:text-white px-2.5 py-1 rounded transition text-slate-300"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              রিফ্রেশ
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
