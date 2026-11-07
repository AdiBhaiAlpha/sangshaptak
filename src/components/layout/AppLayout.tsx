import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { SearchModal } from '../SearchModal';
import { ConverterModal } from '../ConverterModal';
import { MembershipModal } from '../MembershipModal';
import { NoticeboardModal } from '../NoticeboardModal';
import { useMember } from '../../context/MemberContext';
import { EpaperView } from '../EpaperView';

export default function AppLayout() {
  const { member, setMember } = useMember();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isNoticeboardOpen, setIsNoticeboardOpen] = useState(false);
  const [epaperOpen, setEpaperOpen] = useState(false);

  if (epaperOpen) {
    return <EpaperView onBackToHome={() => setEpaperOpen(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col font-sans selection:bg-red-200 selection:text-red-900">
      <Header
        currentCategory={'all' as any}
        onSelectCategory={(catId: string) => {
          if (catId === 'latest') navigate('/');
          else navigate(`/category/${catId}`);
        }}
        onOpenEpaper={() => setEpaperOpen(true)}
        onOpenConverter={() => setIsConverterOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onGoHome={() => navigate('/')}
        currentMember={member}
        onOpenMembership={() => setIsMembershipOpen(true)}
        onOpenNoticeboard={() => setIsNoticeboardOpen(true)}
      />
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 py-3 w-full">
        <Outlet />
      </main>
      <Footer
        onSelectCategory={(name: string) => {
          if (name.includes('ই-ম্যাগাজিন')) setEpaperOpen(true);
          else navigate(`/category/${name}`);
        }}
        onOpenEpaper={() => setEpaperOpen(true)}
        onOpenConverter={() => setIsConverterOpen(true)}
        onOpenMembership={() => setIsMembershipOpen(true)}
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSelectArticle={() => {}} />
      <ConverterModal isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} />
      <MembershipModal
        isOpen={isMembershipOpen}
        onClose={() => setIsMembershipOpen(false)}
        currentMember={member}
        onSaveMember={(m) => setMember(m)}
        onLogout={() => { setMember(null); setIsMembershipOpen(false); }}
      />
      <NoticeboardModal isOpen={isNoticeboardOpen} onClose={() => setIsNoticeboardOpen(false)} onOpenMembership={() => setIsMembershipOpen(true)} />
    </div>
  );
}
