import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, FileText, ArrowLeft, ChevronLeft, ChevronRight, Download, RotateCcw } from 'lucide-react';

interface EpaperViewProps {
  onBackToHome: () => void;
}

export const EpaperView: React.FC<EpaperViewProps> = ({ onBackToHome }) => {
  const [pageNum, setPageNum] = useState(1);
  const [zoom, setZoom] = useState(100);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePrev = () => setPageNum((p) => Math.max(1, p - 1));
  const handleNext = () => setPageNum((p) => p + 1);

  // Send page change to the PDF iframe so it scrolls to that page
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = `/Shongshoptok_Gothontontro.pdf#page=${pageNum}&view=FitH`;
    }
  }, [pageNum]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#111827] border-b border-slate-800 px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToHome}
              className="bg-[#790102] hover:bg-red-800 text-white text-xs px-3 py-1.5 rounded flex items-center transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              মূল পোর্টালে ফিরুন
            </button>
            <div className="border-l border-slate-700 pl-3">
              <span className="font-serif text-lg font-bold text-red-400">সংশপ্তক</span>
              <span className="text-xs text-slate-400 ml-2 hidden sm:inline">ই-ম্যাগাজিন অনলাইন সংস্করণ</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handlePrev}
              disabled={pageNum === 1}
              className={`px-2.5 py-1 rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${
                pageNum === 1 ? 'text-slate-500 bg-slate-800' : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-400 font-mono mr-2">{pageNum}</span>
            <button
              onClick={handleNext}
              className="px-2.5 py-1 rounded transition bg-slate-700 hover:bg-slate-600 text-white"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 25))}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              title="ছোট করুন"
            >
              −
            </button>
            <span className="text-slate-400 font-mono mr-2">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 25))}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              title="বড় করুন"
            >
              +
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

      {/* PDF Viewer */}
      <main className="flex-1 flex items-center justify-center bg-[#0f172a] p-4 sm:p-6 overflow-hidden">
        <div className="relative w-full max-w-3xl h-full sm:h-[90vh] border border-slate-700 rounded-xl shadow-2xl overflow-hidden bg-white">
          <iframe
            ref={iframeRef}
            src={`/Shongshoptok_Gothontontro.pdf#page=${pageNum}&view=FitH`}
            className="w-full h-full border-0"
            title="সংশপ্তক গঠনতন্ত্র PDF ই-পেপার"
            allowFullScreen
          />
          {/* Mobile page hint */}
          {isMobile && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm animate-pulse">
              পৃষ্ঠা নড়াতে উপরের তীর ব্যবহার করুন
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="bg-[#111827] border-t border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
          <span>সংশপ্তক গঠনতন্ত্র — ছাপার চêque ছাড়া সরাসরি পড়ুন</span>
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
};
