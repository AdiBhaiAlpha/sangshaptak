import React from 'react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, ArrowRight } from 'lucide-react';

export default function PublicationsPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <SEO title="প্রকাশনা" description="সংশপ্তক ক্লাবের প্রকাশনা, দলিল ও গঠনতন্ত্র" />

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 sm:p-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-950 mb-1">প্রকাশনা</h1>
        <p className="text-sm text-gray-600">সংশপ্তক ক্লাবের প্রকাশনা, দলিল ও গঠনতন্ত্র।</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 flex flex-col h-full">
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center mb-4 text-amber-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">গঠনতন্ত্র</h3>
          <p className="text-sm text-gray-600 mb-4 flex-1">
            সংশপ্তক ক্লাবের সংগঠনগত দিকনির্দেশনা, লক্ষ্য, সদস্যপদ ও ব্যবস্থাপনা নিয়মাবলী। এখানে গঠনতন্ত্র পড়তে পারেন।
          </p>
          <Link
            to="/constitution"
            className="flex items-center gap-1.5 bg-[#790102] text-white text-xs font-semibold px-3 py-2 rounded-md hover:bg-red-800 transition inline-flex"
          >
            গঠনতন্ত্র পড়ুন <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="bg-stone-50 rounded-lg border border-stone-200 p-4 sm:p-6">
        <h4 className="font-serif text-lg font-bold text-gray-900 mb-3">আরো প্রকাশনা</h4>
        <p className="text-sm text-gray-600">শীঘ্রই নতুন প্রকাশনা যোগ করা হবে।</p>
      </div>
    </div>
  );
}
