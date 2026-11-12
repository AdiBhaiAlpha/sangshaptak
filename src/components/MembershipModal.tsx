import React, { useState, useEffect, useRef } from 'react';
import { ClubMember } from '../types';
import { secondaryAuth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { toBanglaNumber } from '../utils/banglaUtils';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle, 
  CreditCard, 
  Sparkles, 
  QrCode, 
  ShieldCheck, 
  User, 
  Edit3, 
  LogOut,
  Camera,
  Upload,
  Phone,
  MapPin,
  School,
  Save,
  Check
} from 'lucide-react';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMember: ClubMember | null;
  onSaveMember: (member: ClubMember) => void;
  onLogout: () => void;
}

const institutionsList = [
  'আনন্দ মোহন কলেজ, ময়মনসিংহ',
  'বাংলাদেশ কৃষি বিশ্ববিদ্যালয় (বাকৃবি), ময়মনসিংহ',
  'নাসিরাবাদ কলেজ, ময়মনসিংহ',
  'মুমুন্নেসা সরকারি মহিলা কলেজ',
  'শহীদ সৈয়দ নজরুল ইসলাম কলেজ',
  'ময়মনসিংহ পলিটেকনিক ইনস্টিটিউট',
  'ময়মনসিংহ জিলা স্কুল',
  'মুকুল নিকেতন উচ্চ বিদ্যালয়',
  'অন্যান্য শিক্ষাপ্রতিষ্ঠান',
];

const availableWings = [
  { id: 'chess', label: 'দাবা খেলা ও কৌশল চর্চা', icon: '♟️' },
  { id: 'study_circle', label: 'বুদ্ধিবৃত্তিক পাঠচক্র ও বিতর্ক', icon: '🧠' },
  { id: 'literature', label: 'শিল্প, সাহিত্য রচনা ও প্রকাশনা', icon: '📚' },
  { id: 'songs', label: 'গণসংগীত ও সুরসাধনা', icon: '🎵' },
  { id: 'poetry', label: 'কবিতা আবৃত্তি ও নাট্যকলা', icon: '📜' },
];

export const MembershipModal: React.FC<MembershipModalProps> = ({
  isOpen,
  onClose,
  currentMember,
  onSaveMember,
  onLogout,
}) => {
  // Navigation tabs: 'card' (view ID card) | 'profile' (account view & edit) | 'login' | 'form' (first-time apply)
  const [activeTab, setActiveTab] = useState<'card' | 'profile' | 'form' | 'login'>('login');
  const [googleUser, setGoogleUser] = useState<{ name: string; email: string; avatar: string } | null>(null);

  // Form & Profile states
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState(institutionsList[0]);
  const [customInstitution, setCustomInstitution] = useState('');
  const [deptOrClass, setDeptOrClass] = useState('অনার্স ১ম বর্ষ');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [selectedWings, setSelectedWings] = useState<string[]>([
    'দাবা খেলা ও কৌশল চর্চা',
    'বুদ্ধিবৃত্তিক পাঠচক্র ও বিতর্ক',
    'শিল্প, সাহিত্য রচনা ও প্রকাশনা',
  ]);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('ময়মনসিংহ');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentMember) {
      setActiveTab('card');
      setNameBn(currentMember.name);
      setNameEn(currentMember.nameEn || '');
      setPhone(currentMember.phone || '');
      setInstitution(currentMember.institution || institutionsList[0]);
      setDeptOrClass(currentMember.departmentOrClass || '');
      setBloodGroup(currentMember.bloodGroup || 'A+');
      setSelectedWings(currentMember.wings || []);
      setAvatarUrl(currentMember.avatarUrl || '');
      setAddress(currentMember.address || 'ময়মনসিংহ');
    } else {
      setActiveTab('login');
    }
  }, [currentMember, isOpen]);

  if (!isOpen) return null;

  // Handle redirect result (when popup is blocked)
  useEffect(() => {
    getRedirectResult(secondaryAuth)
      .then((result) => {
        if (result?.user) {
          const u = result.user;
          const profile = {
            name: u.displayName || '',
            email: u.email || '',
            avatar: u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          };
          setGoogleUser(profile);
          setNameBn(profile.name);
          setNameEn(profile.name);
          setAvatarUrl(profile.avatar);
          setActiveTab('form');
        }
      })
      .catch((e) => console.error('Redirect result error', e));
  }, []);

  // Google sign-in entry: real Firebase account picker
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(secondaryAuth, googleProvider);
      const u = result.user;
      const profile = {
        name: u.displayName || '',
        email: u.email || '',
        avatar: u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      };
      setGoogleUser(profile);
      setNameBn(profile.name);
      setNameEn(profile.name);
      setAvatarUrl(profile.avatar);
      setActiveTab('form');
    } catch (e: any) {
      console.error('Google sign-in failed', e);
      const code = String(e?.code || '');
      const redirectCodes = [
        'auth/popup-blocked',
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request',
        'auth/operation-not-supported-in-this-environment',
        'auth/web-storage-unsupported',
        'auth/internal-error',
      ];
      if (redirectCodes.includes(code)) {
        try {
          await signInWithRedirect(secondaryAuth, googleProvider);
          return;
        } catch (re: any) {
          console.error('Redirect failed', re);
          if (code === 'auth/popup-blocked') {
            alert('ব্রাউজার পপ-আপ ব্লক করেছে। সাইন-ইনের জন্য এই সাইটের পপ-আপ অনুমতি দিন, তারপর আবার চেষ্টা করুন।');
            return;
          }
          alert('Google সাইন-ইন ব্যর্থ হয়েছে। ' + (re?.message || e?.message || ''));
          return;
        }
      }
      alert('Google সাইন-ইন ব্যর্থ হয়েছে। ' + (e?.message || ''));
    }
  };

  const handleToggleWing = (wingLabel: string) => {
    if (selectedWings.includes(wingLabel)) {
      if (selectedWings.length > 1) {
        setSelectedWings(selectedWings.filter((w) => w !== wingLabel));
      }
    } else {
      setSelectedWings([...selectedWings, wingLabel]);
    }
  };

  // Image Upload handler (supports JPG, PNG, WebP via FileReader)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন (JPEG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAvatarUrl(result);

      // If user is already a member, auto-save the new photo immediately
      if (currentMember) {
        const updated: ClubMember = {
          ...currentMember,
          avatarUrl: result,
        };
        onSaveMember(updated);
        setSaveSuccessMsg(true);
        setTimeout(() => setSaveSuccessMsg(false), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Save changes from Edit Profile view
  const handleSaveProfileChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim() || !phone.trim()) {
      alert('অনুগ্রহ করে নাম এবং মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    const finalInst = institution === 'অন্যান্য শিক্ষাপ্রতিষ্ঠান' && customInstitution.trim() 
      ? customInstitution 
      : institution;

    const updatedMember: ClubMember = {
      id: currentMember?.id || `SMP-MYM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: nameBn.trim(),
      nameEn: nameEn.trim() || 'CLUB MEMBER',
      email: googleUser?.email || currentMember?.email || 'member@samshaptak.org',
      phone: phone.trim(),
      institution: finalInst,
      departmentOrClass: deptOrClass.trim(),
      bloodGroup,
      wings: selectedWings,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      joinedDate: currentMember?.joinedDate || '৪ নভেম্বর ২০২৬',
      validUntil: '৩১ ডিসেম্বর ২০২৭',
      emergencyContact,
      address,
      status: 'active',
    };

    onSaveMember(updatedMember);
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setActiveTab('card');
    }, 1200);
  };

  // First time application submission
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim() || !phone.trim()) {
      alert('অনুগ্রহ করে নাম এবং মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    const finalInst = institution === 'অন্যান্য শিক্ষাপ্রতিষ্ঠান' && customInstitution.trim() 
      ? customInstitution 
      : institution;

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newMember: ClubMember = {
      id: `SMP-MYM-2026-${randomId}`,
      name: nameBn.trim(),
      nameEn: nameEn.trim() || 'CLUB MEMBER',
      email: googleUser?.email || 'member@samshaptak.org',
      phone: phone.trim(),
      institution: finalInst,
      departmentOrClass: deptOrClass.trim(),
      bloodGroup,
      wings: selectedWings,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      joinedDate: '৪ নভেম্বর ২০২৬',
      validUntil: '৩১ ডিসেম্বর ২০২৭',
      emergencyContact,
      address,
      status: 'active',
    };

    onSaveMember(newMember);
    setActiveTab('card');
  };

  // Modern Canvas Card PNG Export with Centered Watermark
  const handleDownloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 490;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const member = currentMember || {
      id: 'SMP-MYM-2026-0842',
      name: nameBn || 'চিত্রণ ভট্টাচার্য',
      nameEn: nameEn || 'CHITRON BHATTACHARJEE',
      institution: institution || 'আনন্দ মোহন কলেজ, ময়মনসিংহ',
      departmentOrClass: deptOrClass || 'অনার্স ১ম বর্ষ',
      bloodGroup: bloodGroup || 'A+',
      wings: selectedWings,
      joinedDate: '৪ নভেম্বর ২০২৬',
      validUntil: '৩১ ডিসেম্বর ২০২৭',
    };

    // 1. Dark Luxury Executive Card Background
    const cardBgGradient = ctx.createLinearGradient(0, 0, 800, 490);
    cardBgGradient.addColorStop(0, '#1c0508');
    cardBgGradient.addColorStop(0.5, '#120305');
    cardBgGradient.addColorStop(1, '#0a0a0c');
    ctx.fillStyle = cardBgGradient;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(0, 0, 800, 490, 24);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, 800, 490);
    }

    // Border line
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2.5;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(0, 0, 800, 490, 24);
      ctx.stroke();
    }

    // 2. Center Aligned "সংশপ্তক" Watermark with Low Opacity in Alinur Font
    ctx.save();
    ctx.font = '900 115px "Li Alinur Sangbadpatra", "Li Alinur Sangbadpatra Unicode", "Noto Serif Bengali", serif';
    ctx.fillStyle = 'rgba(251, 191, 36, 0.07)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('সংশপ্তক', 400, 255);
    ctx.restore();

    // 3. Top Header Bar
    const headerGrad = ctx.createLinearGradient(0, 0, 800, 0);
    headerGrad.addColorStop(0, 'rgba(121, 1, 2, 0.95)');
    headerGrad.addColorStop(0.6, 'rgba(84, 0, 0, 0.95)');
    headerGrad.addColorStop(1, 'rgba(30, 4, 7, 0.95)');
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, 800, 95);

    // Gold hairline below header
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 95);
    ctx.lineTo(800, 95);
    ctx.stroke();

    // Brand Name in Header
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 24px "Li Alinur Sangbadpatra", "Noto Serif Bengali", serif';
    ctx.fillText('সংশপ্তক', 36, 42);

    ctx.fillStyle = '#f3f4f6';
    ctx.font = '13px "Noto Serif Bengali", sans-serif';
    ctx.fillText('সাংস্কৃতিক ও বুদ্ধিবৃত্তিক কেন্দ্র • ময়মনসিংহ', 36, 68);

    // Header Right: Official Member Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(570, 22, 195, 34);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`ID: ${member.id}`, 585, 44);

    ctx.fillStyle = '#fca5a5';
    ctx.font = '11px "Noto Serif Bengali", sans-serif';
    ctx.fillText('সক্রিয় ডিজিটাল সদস্য', 610, 75);

    // 4. Photo Frame Placeholder (Clean executive box)
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 2.5;
    ctx.fillRect(40, 130, 150, 185);
    ctx.strokeRect(40, 130, 150, 185);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Noto Serif Bengali", sans-serif';
    ctx.fillText('সদস্য আলোকচিত্র', 65, 230);

    // 5. Member Information (High contrast, modern typography)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Noto Serif Bengali", serif';
    ctx.fillText(member.name, 225, 160);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText((member.nameEn || 'MEMBER').toUpperCase(), 225, 185);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '15px "Noto Serif Bengali", sans-serif';
    ctx.fillText(`প্রতিষ্ঠান: ${member.institution}`, 225, 225);
    ctx.fillText(`শ্রেণি / বিভাগ: ${member.departmentOrClass || 'অনার্স'}`, 225, 255);
    ctx.fillText(`রক্তের গ্রুপ: ${member.bloodGroup}`, 225, 285);

    // Selected Wings
    ctx.fillStyle = '#fca5a5';
    ctx.font = '13px "Noto Serif Bengali", sans-serif';
    const wingsStr = member.wings && member.wings.length > 0 
      ? member.wings.slice(0, 3).join(' • ') 
      : 'দাবা • পাঠচক্র • সাহিত্য';
    ctx.fillText(`কার্যক্রম: ${wingsStr}`, 225, 320);

    // 6. Clean Modern Footer Bar (No unnecessary leader names)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 420, 800, 70);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, 420);
    ctx.lineTo(800, 420);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Noto Serif Bengali", sans-serif';
    ctx.fillText('স্থান: প্রয়াস ভবন, ব্যাট বল চত্বর সংলগ্ন, ময়মনসিংহ | যোগাযোগ: 01316655254', 40, 452);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px "Noto Serif Bengali", sans-serif';
    ctx.fillText(`বৈধতার মেয়াদ: ${member.validUntil} • সদস্য যাচাইকৃত`, 40, 472);

    // QR Verification Stamp
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(630, 432, 130, 46);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('VERIFIED ID', 655, 452);
    ctx.fillText('SANSHAPTAK', 650, 468);

    const link = document.createElement('a');
    link.download = `Sanshaptak-Member-Card-${member.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl flex flex-col overflow-hidden max-h-[94vh] border border-stone-300">
        
        {/* Modal Top Header */}
        <div className="bg-[#790102] text-white px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between border-b border-red-950">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/sangsaptak-logo.png"
              alt="সংশপ্তক প্রতীক"
              className="w-8 h-8 object-contain rounded-full bg-white/10 p-0.5"
            />
            <div>
              <h3 className="font-sangbadpatra text-lg sm:text-xl font-bold leading-tight">
                সংশপ্তক সদস্য পোর্টাল
              </h3>
              <p className="text-[11px] text-red-100 font-sans">
                শিল্প, সাহিত্য, সংস্কৃতি ও বুদ্ধিবৃত্তিক চর্চা কেন্দ্র • ময়মনসিংহ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 cursor-pointer transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (When logged in / member exists) */}
        {currentMember && (
          <div className="bg-stone-100 border-b border-stone-200 px-4 flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('card')}
                className={`py-2.5 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'card'
                    ? 'border-[#790102] text-[#790102]'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>মেম্বারশিপ কার্ড</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2.5 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'profile'
                    ? 'border-[#790102] text-[#790102]'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>অ্যাকাউন্ট ও তথ্য সংশোধন</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-semibold text-stone-500 hidden sm:inline">
                {currentMember.id}
              </span>
              <button
                onClick={onLogout}
                className="text-stone-500 hover:text-red-700 text-xs px-2 py-1 transition flex items-center space-x-1 cursor-pointer"
                title="লগআউট"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-stone-50/50">

          {/* Toast Notification */}
          {saveSuccessMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>আপনার তথ্য এবং ছবি সফলভাবে সংরক্ষিত ও আপডেট হয়েছে!</span>
            </div>
          )}

          {/* STEP 1: GOOGLE SIGN-IN */}
          {activeTab === 'login' && !currentMember && (
            <div className="text-center py-8 px-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-50 text-[#790102] rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200 shadow-xs">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <h4 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                সংশপ্তক ক্লাবে যুক্ত হোন
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
                দাবা খেলা, বুদ্ধিবৃত্তিক পাঠচক্র, সাহিত্য ও সংগীত চর্চায় নিয়মিত অংশ নিতে এবং নিজস্ব ছবি সংবলিত আধুনিক ডিজিটাল সদস্য কার্ড সংগ্রহ করতে গুগল দিয়ে আবেদন করুন।
              </p>

              {/* Google Sign-in Button */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-md shadow-sm transition flex items-center justify-center space-x-3 cursor-pointer group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Google দিয়ে সরাসরি আবেদন করুন
                </span>
              </button>


            </div>
          )}

          {/* TAB: CARD VIEW (CLEAN, MODERN, EXECUTIVE, WITH WATERMARK) */}
          {activeTab === 'card' && currentMember && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div>
                  <h4 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                    <span>সংশপ্তক অফিশিয়াল মেম্বারশিপ কার্ড</span>
                    <span className="text-[11px] font-sans font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      সক্রিয়
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500">
                    কার্ডটি প্রিন্ট অথবা পিএনজি হিসেবে ডাউনলোড করে ক্লাবের নিয়মিত কাজে ব্যবহার করুন।
                  </p>
                </div>

                <button
                  onClick={triggerFileInput}
                  className="self-start sm:self-auto text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-3 py-1.5 rounded-md border border-stone-300 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#790102]" />
                  <span>নিজের ছবি আপলোড</span>
                </button>
              </div>

              {/* CARD PREVIEW CONTAINER (Center Watermark, Alinur font, No Committee details) */}
              <div className="flex justify-center p-1 sm:p-2">
                <div 
                  ref={cardRef}
                  id="printable-member-card"
                  className="w-full max-w-[560px] bg-gradient-to-br from-[#1a0507] via-[#120305] to-[#0a0a0d] text-white border-2 border-amber-600/40 rounded-2xl overflow-hidden shadow-2xl relative select-none print:border-black print:text-black print:bg-white"
                >
                  {/* WATERMARK: Center Aligned "সংশপ্তক" in Alinur Font with Reduced Opacity */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                    <span 
                      className="font-sangbadpatra font-black text-6xl sm:text-7xl md:text-8xl tracking-widest text-amber-500/[0.08] print:text-gray-300/20 select-none uppercase transform -rotate-6"
                      style={{ fontFamily: "'Li Alinur Sangbadpatra', 'Li Alinur Sangbadpatra Unicode', 'Noto Serif Bengali', serif" }}
                    >
                      সংশপ্তক
                    </span>
                  </div>

                  {/* Top Bar with Authentic Calligraphic Emblem */}
                  <div className="relative z-10 bg-gradient-to-r from-red-950/90 via-[#790102]/90 to-stone-950/90 p-3.5 sm:p-4 flex items-center justify-between border-b border-amber-500/30">
                    <div className="flex items-center space-x-3">
                      <img
                        src="/assets/sangsaptak-logo.png"
                        alt="সংশপ্তক প্রতীক"
                        className="w-10 h-10 object-contain drop-shadow-md rounded-full bg-white/10 p-0.5 flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-sangbadpatra font-black text-xl text-amber-300 tracking-wide leading-tight">
                          সংশপ্তক
                        </h4>
                        <p className="text-[11px] text-stone-200 font-serif">
                          সাংস্কৃতিক ও বুদ্ধিবৃত্তিক কেন্দ্র • ময়মনসিংহ
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider font-bold">
                        {currentMember.id}
                      </div>
                      <p className="text-[9px] text-stone-400 mt-1 font-sans">
                        সদস্য পরিচয়পত্র
                      </p>
                    </div>
                  </div>

                  {/* Card Content Grid */}
                  <div className="relative z-10 p-4 sm:p-5 grid grid-cols-12 gap-4 items-center">
                    {/* Left: Avatar Photo with Quick Upload Camera Trigger */}
                    <div className="col-span-4 flex flex-col items-center">
                      <div 
                        onClick={triggerFileInput}
                        className="relative w-24 h-28 sm:w-28 sm:h-32 border-2 border-amber-500/60 rounded-xl overflow-hidden bg-stone-900 shadow-md group cursor-pointer"
                        title="ছবি পরিবর্তন করতে ক্লিক করুন"
                      >
                        <img
                          src={currentMember.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                          alt={currentMember.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px]">
                          <Camera className="w-4 h-4 mr-1" />
                          <span>আপলোড</span>
                        </div>
                      </div>
                      <span className="mt-2 text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        রক্ত: {currentMember.bloodGroup}
                      </span>
                    </div>

                    {/* Right: Member Info (Clean, Modern, No Leader Signatures) */}
                    <div className="col-span-8 space-y-1.5 text-xs">
                      <div>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide leading-tight">
                          {currentMember.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-amber-300/80 uppercase tracking-widest font-sans">
                          {currentMember.nameEn || 'MEMBER'}
                        </p>
                      </div>

                      <div className="pt-1.5 border-t border-white/10 space-y-1 text-stone-300 text-xs">
                        <p className="flex items-center space-x-1.5">
                          <strong className="text-stone-400 font-sans text-[11px]">প্রতিষ্ঠান:</strong>
                          <span className="text-white truncate font-medium">{currentMember.institution}</span>
                        </p>
                        <p className="flex items-center space-x-1.5">
                          <strong className="text-stone-400 font-sans text-[11px]">বিভাগ/শ্রেণি:</strong>
                          <span className="text-white font-medium">{currentMember.departmentOrClass || 'অনার্স'}</span>
                        </p>
                        <p className="flex items-center space-x-1.5">
                          <strong className="text-stone-400 font-sans text-[11px]">যোগদান:</strong>
                          <span className="text-stone-300">{currentMember.joinedDate}</span>
                        </p>
                      </div>

                      {/* Wings Tags */}
                      <div className="pt-1.5 flex flex-wrap gap-1">
                        {currentMember.wings.map((w) => (
                          <span
                            key={w}
                            className="bg-white/10 text-amber-200 text-[10px] px-2 py-0.5 rounded border border-white/10"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clean Modern Card Footer (No President/Secretary Clutter) */}
                  <div className="relative z-10 bg-black/40 border-t border-white/10 p-2.5 px-4 flex items-center justify-between text-[11px] text-stone-400">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div>
                        <span className="text-stone-300 font-medium block">সংশপ্তক ডিজিটাল সনদ</span>
                        <span className="text-[10px] text-emerald-400">মেয়াদ: {currentMember.validUntil}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded">
                      <QrCode className="w-4 h-4 text-amber-300" />
                      <span className="font-mono text-[10px] text-stone-300">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Print, Download, Edit */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrintCard}
                  className="bg-[#790102] hover:bg-red-800 text-white font-semibold px-5 py-2.5 rounded-lg text-xs transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>সদস্য কার্ড প্রিন্ট করুন</span>
                </button>

                <button
                  onClick={handleDownloadCard}
                  className="bg-stone-900 hover:bg-black text-white font-semibold px-5 py-2.5 rounded-lg text-xs transition flex items-center space-x-1.5 shadow-sm cursor-pointer border border-stone-700"
                >
                  <Download className="w-4 h-4" />
                  <span>কার্ড ছবি ডাউনলোড (PNG)</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-4 py-2.5 rounded-lg text-xs transition flex items-center space-x-1 border border-stone-300 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#790102]" />
                  <span>তথ্য ও ছবি এডিট করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: PROFILE & EDIT (USER ACCOUNT MANAGEMENT & IMAGE UPLOAD) */}
          {(activeTab === 'profile' || activeTab === 'form') && (
            <form onSubmit={activeTab === 'form' ? handleSubmitApplication : handleSaveProfileChanges} className="space-y-4">
              
              <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    {activeTab === 'form' ? 'সদস্যপদ আবেদন ফর্ম' : 'ইউজার প্রোফাইল ও তথ্য সংশোধন'}
                  </h4>
                  <p className="text-xs text-stone-500">
                    আপনার ব্যক্তিগত তথ্য, ছবি এবং ক্লাবের বিভাগ নির্বাচন আপডেট করুন।
                  </p>
                </div>

                {activeTab === 'profile' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('card')}
                    className="text-xs text-[#790102] font-semibold hover:underline"
                  >
                    ← মেম্বার কার্ডে ফিরুন
                  </button>
                )}
              </div>

              {/* Photo Upload Section */}
              <div className="bg-stone-100/80 border border-stone-200 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-20 h-24 rounded-lg overflow-hidden border-2 border-[#790102] shadow-xs flex-shrink-0 bg-stone-200">
                  <img
                    src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt="Member Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h5 className="font-semibold text-stone-900 text-sm">সদস্য আলোকচিত্র</h5>
                  <p className="text-xs text-stone-500 mb-2.5">
                    মোবাইল বা কম্পিউটার থেকে আপনার নিজস্ব ছবি আপলোড করতে পারেন।
                  </p>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="bg-[#790102] hover:bg-red-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>ছবি নির্বাচন করুন (Device থেকে)</span>
                  </button>
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    সম্পূর্ণ নাম (বাংলায়) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    placeholder="যেমন: চিত্রণ ভট্টাচার্য"
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name (in English for ID Card) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. CHITRON BHATTACHARJEE"
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm uppercase focus:outline-none focus:border-[#790102] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১৭xxxxxxxx"
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    রক্তের গ্রুপ *
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102] bg-white"
                  >
                    <option value="A+">A+ (পজিটিভ)</option>
                    <option value="A-">A- (নেগেটিভ)</option>
                    <option value="B+">B+ (পজিটিভ)</option>
                    <option value="B-">B- (নেগেটিভ)</option>
                    <option value="O+">O+ (পজিটিভ)</option>
                    <option value="O-">O- (নেগেটিভ)</option>
                    <option value="AB+">AB+ (পজিটিভ)</option>
                    <option value="AB-">AB- (নেগেটিভ)</option>
                  </select>
                </div>
              </div>

              {/* Institution */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  শিক্ষাপ্রতিষ্ঠান (ময়মনসিংহ) *
                </label>
                <select
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102] bg-white"
                >
                  {institutionsList.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
                {institution === 'অন্যান্য শিক্ষাপ্রতিষ্ঠান' && (
                  <input
                    type="text"
                    required
                    value={customInstitution}
                    onChange={(e) => setCustomInstitution(e.target.value)}
                    placeholder="আপনার প্রতিষ্ঠানের নাম লিখুন..."
                    className="w-full mt-2 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102] bg-white"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    শ্রেণি / শিক্ষাবর্ষ / বিভাগ *
                  </label>
                  <input
                    type="text"
                    required
                    value={deptOrClass}
                    onChange={(e) => setDeptOrClass(e.target.value)}
                    placeholder="যেমন: বাংলা বিভাগ / অনার্স ১ম বর্ষ / একাদশ শ্রেণি"
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    বর্তমান ঠিকানা (ময়মনসিংহ)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="যেমন: বাউন্ডারি রোড / গাঙিনার পাড়"
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102] bg-white"
                  />
                </div>
              </div>

              {/* Wings selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  সংশপ্তক ক্লাবের যে যে কার্যক্রমে আপনি নিয়মিত অংশগ্রহণ করতে চান:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {availableWings.map((w) => {
                    const isSelected = selectedWings.includes(w.label);
                    return (
                      <div
                        key={w.id}
                        onClick={() => handleToggleWing(w.label)}
                        className={`p-2.5 rounded-lg border flex items-center space-x-2.5 cursor-pointer transition ${
                          isSelected
                            ? 'bg-red-50 border-[#790102] text-[#790102] font-semibold'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span className="text-base">{w.icon}</span>
                        <span className="flex-1">{w.label}</span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="accent-[#790102]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Save / Apply Button */}
              <div className="flex items-center space-x-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#790102] hover:bg-red-800 text-white font-semibold py-2.5 rounded-lg text-sm transition cursor-pointer flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>{activeTab === 'form' ? 'আবেদন সম্পন্ন করুন ও কার্ড গ্রহণ করুন' : 'তথ্য সংরক্ষণ ও আপডেট করুন'}</span>
                </button>

                {activeTab === 'profile' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('card')}
                    className="px-4 py-2.5 border border-stone-300 bg-white hover:bg-stone-100 rounded-lg text-stone-700 text-sm font-medium transition cursor-pointer"
                  >
                    বাতিল
                  </button>
                )}
              </div>
            </form>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500">
          <span>স্থান: প্রয়াস ভবন, ব্যাট বল চত্বর সংলগ্ন, ময়মনসিংহ • ফোন: 01316655254</span>
          <button
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 font-medium px-3 py-1 rounded hover:bg-stone-200 cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
