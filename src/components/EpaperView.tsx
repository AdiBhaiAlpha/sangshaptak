import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PDFFlipBook from './PDFFlipBook';
import { BookOpen, FileText, ArrowLeft, Download, RotateCcw } from 'lucide-react';

interface EpaperViewProps {
  onBackToHome: () => void;
}

const PDF_URL = '/Shongshoptok_Gothontontro.pdf';

export default function EpaperView({ onBackToHome }: EpaperViewProps) {
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleDocLoad = useCallback(() => {
    setPdfLoaded(true);
  }, []);

  const handleDocError = useCallback((err: any) => {
    console.error('PDF load error', err);
    setPdfError(err?.message || 'PDF লোড ব্যর্থ');
  }, []);

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
              <ArrowLeft className="w-4 h-4 mr-1" />
              মূল পোর্টালে ফিরুন
            </button>
            <div className="border-l border-slate-700 pl-3">
              <span className="font-serif text-lg font-bold text-red-400">সংশপ্তক</span>
              <span className="text-xs text-slate-400 ml-2 hidden sm:inline">ই-ম্যাগাজিন অনলাইন সংস্করণ</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href={PDF_URL}
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

      <main className="flex-1 bg-[#0f172a] p-4 sm:p-6">
        {pdfError ? (
          <div className="flex flex-col items-center justify-center h-[85vh] sm:h-[90vh]">
            <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-serif font-bold text-slate-200 mb-2">PDF লোড ব্যর্থ</h2>
            <p className="text-sm text-slate-400 text-center mb-4 max-w-sm">{pdfError}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#790102] hover:bg-red-800 text-white font-medium px-6 py-2.5 rounded-md transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : (
          <PDFFlipBook pdfUrl={PDF_URL} onBackToHome={onBackToHome} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#111827] border-t border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
          <span>সংশপ্তক গঠনতন্ত্র — ফ্লিপ বুক ভিউ (পৃষ্ঠা-ভিত্তিক)</span>
          <div className="flex gap-2">
            <a
              href={PDF_URL}
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
