import React from 'react';
import { BrandLogo } from './BrandLogo';
import { 
  Facebook, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Newspaper,
  ChevronUp,
  CreditCard,
  BookOpen,
  IdCard
} from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenEpaper: () => void;
  onOpenConverter: () => void;
  onOpenMembership?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenEpaper,
  onOpenConverter,
  onOpenMembership,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navColumns = [
    {
      title: 'সম্পাদকীয় ও সমাজভাবনা',
      links: [
        'মুখপত্র ও সম্পাদকীয়',
        'শিক্ষা অধিকার ও ভাবনা',
        'মননশীল চিন্তা ও প্রবন্ধ',
        'ক্যাম্পাস ও শিক্ষার্থী বার্তা',
        'বিবৃতি ও মতামত',
      ],
    },
    {
      title: 'শিল্প, সাহিত্য ও সংস্কৃতি',
      links: [
        'ছোটগল্প ও কথাসাহিত্য',
        'কবিতা ও ছড়া',
        'বইয়ের জগৎ ও সমালোচনা',
        'নাট্য আন্দোলন ও চারুকলা',
        'সাংস্কৃতিক সন্ধ্যা',
      ],
    },
    {
      title: 'গান, আবৃত্তি ও প্রকাশনা',
      links: [
        'গণসংগীত ও সুরসাধনা',
        'বিদ্রোহী কবিতা আবৃত্তি',
        'দেয়াল পত্রিকা "অগ্নিশিখা"',
        'সংশপ্তক বার্ষিকী সংখ্যা',
        'ক্রোড়পত্র ও বুলেটিন',
      ],
    },
  ];

  return (
    <footer className="bg-[#111827] text-gray-300 mt-12 border-t-4 border-[#790102]">
      {/* Top Banner with Logo and Callouts */}
      <div className="bg-[#1f2937] border-b border-gray-700 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <BrandLogo size="md" variant="white" showSubtitle={false} />
            <div className="hidden sm:block border-l border-gray-600 pl-3">
              <p className="text-xs text-yellow-300 font-semibold">
                শিল্প, সাহিত্য, সংস্কৃতি ও বুদ্ধিবৃত্তিক চর্চা কেন্দ্র • ময়মনসিংহ
              </p>
            </div>
          </div>

          {/* Social Icons & Membership button */}
          <div className="flex items-center space-x-3">
            {onOpenMembership && (
              <button
                onClick={onOpenMembership}
                className="border border-amber-400/50 hover:bg-amber-400 hover:text-stone-950 text-amber-300 p-1.5 rounded-xs transition-colors cursor-pointer flex items-center"
                title="সদস্য কার্ড গ্রহণ ও আবেদন"
                aria-label="সদস্য কার্ড গ্রহণ ও আবেদন"
              >
                <IdCard size={14} />
              </button>
            )}

            <div className="flex items-center space-x-1.5">
              <a
                href="https://www.facebook.com/profile.php?id=61595433615675"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:opacity-90 transition"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#ff0000] text-white flex items-center justify-center hover:opacity-90 transition"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Links Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {navColumns.map((col, idx) => (
            <div key={idx}>
              <h4 className="font-serif text-sm sm:text-base font-bold text-white border-b border-[#790102] pb-2 mb-3">
                {col.title}
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-400">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => onSelectCategory(link)}
                      className="hover:text-red-400 hover:underline transition cursor-pointer text-left"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Quick Services Column */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-serif text-sm sm:text-base font-bold text-white border-b border-[#790102] pb-2 mb-3">
              ডিজিটাল সেবা
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={onOpenEpaper}
                  className="hover:text-yellow-300 text-yellow-400 flex items-center font-semibold cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                  ডিজিটাল ই-ম্যাগাজিন
                </button>
              </li>
              {onOpenMembership && (
                <li>
                  <button
                    onClick={onOpenMembership}
                    className="hover:text-yellow-300 text-yellow-400 flex items-center font-semibold cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                    সদস্য কার্ড প্রিন্ট পোর্টাল
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => onSelectCategory('দাবা')}
                  className="hover:text-red-400 flex items-center cursor-pointer"
                >
                  দাবা টুর্নামেন্ট নোটিশ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('পাঠচক্র')}
                  className="hover:text-red-400 flex items-center cursor-pointer"
                >
                  সাপ্তাহিক পাঠচক্র আর্কাইভ
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Editorial Credentials and Address */}
        <div className="mt-8 pt-6 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-400">
          <div>
            <h5 className="font-serif font-bold text-gray-200 text-sm mb-1.5">
              ব্যবস্থাপনা কমিটি
            </h5>
            <p className="leading-relaxed space-y-1">
              উপদেষ্টা: <strong className="text-amber-200">তানজিল হোসেন মুণিম</strong><br />
              আহ্বায়ক: <strong className="text-white">চিত্রণ ভট্টাচার্য</strong><br />
              সদস্য: <strong className="text-amber-200">আওসাফ আহমেদ</strong>, <strong className="text-amber-200">হোসাইন শাহ মাহিন</strong><br />
              প্রকাশনা ও মুখপত্র: <strong className="text-gray-200">সংশপ্তক</strong>
            </p>
          </div>

          <div>
            <h5 className="font-serif font-bold text-gray-200 text-sm mb-1.5">
              যোগাযোগ ও স্থান
            </h5>
            <p className="flex items-start space-x-1.5 mb-1.5 leading-relaxed">
              <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>স্থান: প্রয়াস ভবন, ব্যাট বল চত্বর সংলগ্ন, ময়মনসিংহ</span>
            </p>
            <p className="flex items-center space-x-1.5 mb-1">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>যোগাযোগ: 01316655254</span>
            </p>
            <p className="flex items-center space-x-1.5 mb-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>ইমেইল: sangshaptak@gmail.com</span>
            </p>
            <div className="mt-3 border-l-2 border-amber-400/80 pl-2.5 py-0.5 text-xs text-stone-300">
              <span className="block text-amber-300 font-medium text-[11px] font-mono tracking-wide mb-0.5">
                কার্যদিবস ও সময়সূচী
              </span>
              প্রতি শনিবার, বুধবার, বৃহস্পতিবার · বিকাল ৩টা থেকে সন্ধ্যা ৬টা
            </div>
          </div>

          <div>
            <h5 className="font-serif font-bold text-gray-200 text-sm mb-1.5">
              উদ্দেশ্য ও কার্যক্রম
            </h5>
            <p className="text-gray-400 leading-relaxed mb-3">
              দাবা খেলা, বুদ্ধিবৃত্তিক পাঠচক্র, শিল্প-সাহিত্য, গান, কবিতা ও প্রকাশনার মাধ্যমে সুস্থ সাংস্কৃতিক মনন গঠনে সংশপ্তক নিয়মিত কাজ করে চলেছে।
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-black/90 py-3.5 px-4 text-xs text-gray-500 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2 text-center">
          <div>
            স্বত্ব © ২০২৬ সংশপ্তক • <span className="text-gray-300 font-serif">সমাজতান্ত্রিক ছাত্র ফ্রন্ট, ময়মনসিংহ জেলা শাখার মুখপত্র</span>। সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div>
            Developed by{' '}
            <a
              href="https://facebook.com/ssfadi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white underline"
            >
              Chitron Bhattacharjee
            </a>
          </div>
          <button
            onClick={scrollToTop}
            className="bg-gray-800 hover:bg-[#790102] text-white p-1 rounded transition cursor-pointer"
            title="উপরে যান"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
