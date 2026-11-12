import React from 'react';
import { X, CalendarDays, Phone, Mail, UserCheck } from 'lucide-react';

interface NoticeboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMembership?: () => void;
}

export const NoticeboardModal: React.FC<NoticeboardModalProps> = ({
  isOpen,
  onClose,
  onOpenMembership,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container: Bottom sheet on mobile, centered modal on tablet/desktop */}
      <div 
        className="w-full sm:max-w-lg md:max-w-xl bg-white rounded-t-2xl sm:rounded-sm shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Handle */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 bg-stone-100">
          <div className="w-10 h-1 bg-stone-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="bg-[#790102] text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-red-900">
          <div className="flex items-center space-x-2.5">
            <img
              src="/assets/sangsaptak-logo.png"
              alt="সংশপ্তক"
              className="w-7 h-7 object-contain rounded-full bg-white/10 p-0.5"
            />
            <div>
              <h3 className="font-sangbadpatra text-base sm:text-lg text-white leading-tight">
                ক্লাব সূচি ও পাঠচক্র নোটিশ
              </h3>
              <p className="text-[11px] text-amber-200 font-sans">
                সংশপ্তক · শিল্প, সাহিত্য, সংস্কৃতি ও বুদ্ধিবৃত্তিক কেন্দ্র • ময়মনসিংহ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Empty Noticeboard State */}
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <CalendarDays className="w-12 h-12 text-stone-300 mb-3" />
          <p className="text-stone-500 text-sm">কোনো সূচি বা পাঠচক্র নোটিশ নেই।</p>
          <p className="text-xs text-stone-400 mt-1">এডমিন প্যানেল থেকে সূচি যোগ করুন।</p>
        </div>

        {/* Modal Footer with Contact & Membership Action */}
        <div className="p-3.5 sm:p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-stone-600 flex items-center space-x-3 text-[11px] w-full sm:w-auto justify-center sm:justify-start">
            <span className="flex items-center">
              <Phone className="w-3 h-3 mr-1 text-[#790102]" />
              01316655254
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Mail className="w-3 h-3 mr-1 text-[#790102]" />
              sangshaptak@gmail.com
            </span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {onOpenMembership && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMembership();
                }}
                className="flex-1 sm:flex-none bg-[#790102] hover:bg-red-800 text-white font-bold py-1.5 px-3 rounded-xs transition text-xs cursor-pointer flex items-center justify-center space-x-1"
              >
                <UserCheck size={14} className="text-amber-300" />
                <span>সদস্যপদ আবেদন</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium rounded-xs transition text-xs cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
