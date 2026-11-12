import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { FileText, Download, ArrowLeft, BookOpen, File, RotateCcw } from 'lucide-react';

export default function ConstitutionPage() {
  const [viewMode, setViewMode] = useState<'html' | 'pdf'>('html');
  const [htmlLoaded, setHtmlLoaded] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <SEO title="গঠনতন্ত্র" description="সংশপ্তক ক্লাবের গঠনতন্ত্র" />

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm mb-6 overflow-hidden">
        <div className="bg-[#790102] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-amber-300" />
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-0.5">গঠনতন্ত্র</h1>
              <p className="text-amber-100 text-sm">সংশপ্তক ক্লাবের সংগঠনগত বিধি-বিধান</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/Shongshoptok_Gothontontro.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#790102] font-semibold px-3 py-2 rounded-md text-sm hover:bg-amber-50 transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> HTML দেখুন
            </a>
            <a
              href="/Shongshoptok_Gothontontro.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#790102] font-semibold px-3 py-2 rounded-md text-sm hover:bg-amber-50 transition flex items-center gap-1.5"
            >
              <File className="w-4 h-4" /> PDF দেখুন
            </a>
            <a
              href="/Shongshoptok_Gothontontro.pdf"
              download
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-3 py-2 rounded-md text-sm transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> PDF ডাউনলোড
            </a>
            <Link
              to="/"
              className="bg-white text-[#790102] font-semibold px-3 py-2 rounded-md text-sm hover:bg-amber-50 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> প্রচ্ছদে ফিরুন
            </Link>
          </div>
        </div>
        <div className="bg-stone-50 border-b border-stone-200 p-3 sm:p-4 flex items-center gap-3 text-xs text-stone-600 font-mono">
          <span>অনুমোদনের তারিখ:</span>
          <span className="font-bold">১২ নভেম্বর ২০২৬</span>
          <span className="w-px bg-stone-300 mx-1" />
          <span>প্রধান কার্যালয়:</span>
          <span className="font-bold">প্রয়াস ভবন, ব্যাট-বল চত্বর, ময়মনসিংহ</span>
        </div>
      </div>

      {/* View mode tabs */}
      <div className="flex border-b border-stone-200 mb-4">
        <button
          onClick={() => setViewMode('html')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${viewMode === 'html' ? 'border-[#790102] text-[#790102]' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
        >
          HTML ভিউ
        </button>
        <button
          onClick={() => setViewMode('pdf')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${viewMode === 'pdf' ? 'border-[#790102] text-[#790102]' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
        >
          PDF ফ্লিপবুক ভিউ
        </button>
      </div>

      {/* Viewer area */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm h-[80vh] sm:h-[90vh] flex flex-col">
        {viewMode === 'html' ? (
          <>
            <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 bg-stone-50">
              <h3 className="font-serif text-lg font-bold text-gray-900">গঠনতন্ত্র পাঠ করুন</h3>
              <span className={`text-xs ${htmlLoaded ? 'text-emerald-600' : 'text-stone-500'}`}>
                {htmlLoaded ? 'লোড সম্পন্ন' : 'লোড হচ্ছে...'}
              </span>
            </div>
            <iframe
              src="/Shongshoptok_Gothontontro.html"
              className="flex-1 w-full h-full border-0 bg-white"
              title="সंशপ্তক গঠনতন্ত্র"
              onLoad={() => setHtmlLoaded(true)}
              allowFullScreen
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 bg-stone-50">
              <h3 className="font-serif text-lg font-bold text-gray-900">PDF ফ্লিপবুক ভিউ</h3>
              <span className={`text-xs ${pdfLoaded ? 'text-emerald-600' : 'text-stone-500'}`}>
                {pdfLoaded ? 'লোড সম্পন্ন' : 'লোড হচ্ছে...'}
              </span>
            </div>
            <iframe
              src="/Shongshoptok_Gothontontro.pdf#page=1&view=FitH"
              className="flex-1 w-full h-full border-0 bg-white"
              title="সंशপ্তক গঠনতন্ত্র PDF"
              onLoad={() => setPdfLoaded(true)}
              allowFullScreen
            />
          </>
        )}
      </div>

      {/* Info section */}
      <div className="mt-6 bg-stone-50 rounded-lg border border-stone-200 p-5">
        <h4 className="font-serif text-lg font-bold text-gray-900 mb-3">গঠনতন্ত্র সম্পর্কে</h4>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          সংশপ্তক ক্লাবের গঠনতন্ত্রে সংগঠনের নাম, প্রকৃতি, স্লোগান, মূলমন্ত্র, কার্যালয়, কার্যপরিধি, সদস্যপদ, ব্যবস্থাপনা ও আর্থিক বিধান পরিষ্কারভাবে লেখা আছে। ক্লাবের সব কার্যক্রম এই নিয়মাবলী অনুযায়ী পরিচালিত হবে।
        </p>
        <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
          <li>সংগঠনের নাম: সংশপ্তক (Shongshoptok)</li>
          <li>স্লোগান: “বন্দিত্বের শেকল ছিঁড়ে মুক্তির পথে”</li>
          <li>মূলমন্ত্র: “চিন্তা ★ চর্চা ★ প্রগতি”</li>
          <li>অনুমোদনের তারিখ: ১২ নভেম্বর ২০২৬</li>
          <li>কার্যালয়: প্রয়াস ভবন, ব্যাট-বল চত্বর সংলগ্ন, ময়মনসিংহ, বাংলাদেশ</li>
        </ul>
        <div className="mt-4 pt-4 border-t border-stone-200">
          <h5 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">ব্যবস্থাপনা কমিটি</h5>
          <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
            <li>উপদেষ্টা: তানজিল হোসেন মুণিম</li>
            <li>আহ্বায়ক: চিত্রণ ভট্টাচার্য</li>
            <li>সদস্য: আওসাফ আহমেদ, হোসাইন শাহ মাহিন</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
