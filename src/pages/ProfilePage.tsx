import React from 'react';
import { SEO } from '../components/SEO';
import { useMember } from '../context/MemberContext';
import { useNavigate } from 'react-router-dom';
import { User, IdCard, LogOut, Phone, MapPin, School, Droplet } from 'lucide-react';

export default function ProfilePage() {
  const { member, setMember, signOut } = useMember();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!member) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded border border-gray-200 shadow-xs max-w-xl mx-auto">
        <SEO title="প্রোফাইল" />
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
            <User className="w-6 h-6 text-stone-500" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-950">সদস্য প্রোফাইল</h1>
            <p className="text-sm text-gray-600">আপনি এখনো লগইন/সদস্য হিসেবে নিবন্ধিত নন।</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => navigate('/membership')}
            className="inline-flex items-center justify-center bg-[#790102] hover:bg-red-800 text-white font-semibold px-4 py-2.5 rounded-md text-sm transition"
          >
            <IdCard className="w-4 h-4 mr-2" />
            সদস্যপদ/আইডি কার্ড খুলুন
          </button>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium px-4 py-2.5 rounded-md text-sm transition"
          >
            লগইন পেজে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <SEO title="প্রোফাইল" />
      <div className="bg-white p-5 sm:p-6 rounded border border-gray-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={member.name}
              className="w-16 h-16 rounded-full object-cover border border-stone-200"
            />
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-950">{member.name}</h1>
              <p className="text-sm text-gray-600">{member.nameEn || 'Club Member'}</p>
              <p className="text-xs font-mono text-[#790102] mt-1">{member.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/membership')}
              className="inline-flex items-center justify-center bg-[#790102] hover:bg-red-800 text-white font-semibold px-3.5 py-2 rounded-md text-sm transition"
            >
              <IdCard className="w-4 h-4 mr-1.5" />
              কার্ড/তথ্য দেখুন
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-3.5 py-2 rounded-md text-sm transition"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              লগআউট
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded border border-gray-200 shadow-xs">
        <h2 className="font-serif text-lg font-bold text-gray-900 mb-4">সদস্য তথ্য</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <School className="w-4 h-4 text-[#790102] mt-0.5" />
            <div><span className="text-stone-500 block text-xs">প্রতিষ্ঠান</span><span className="text-stone-900 font-medium">{member.institution || '—'}</span></div>
          </div>
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-[#790102] mt-0.5" />
            <div><span className="text-stone-500 block text-xs">শ্রেণি/বিভাগ</span><span className="text-stone-900 font-medium">{member.departmentOrClass || '—'}</span></div>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-[#790102] mt-0.5" />
            <div><span className="text-stone-500 block text-xs">মোবাইল</span><span className="text-stone-900 font-medium">{member.phone || '—'}</span></div>
          </div>
          <div className="flex items-start gap-2">
            <Droplet className="w-4 h-4 text-[#790102] mt-0.5" />
            <div><span className="text-stone-500 block text-xs">রক্তের গ্রুপ</span><span className="text-stone-900 font-medium">{member.bloodGroup || '—'}</span></div>
          </div>
          <div className="flex items-start gap-2 sm:col-span-2">
            <MapPin className="w-4 h-4 text-[#790102] mt-0.5" />
            <div><span className="text-stone-500 block text-xs">ঠিকানা</span><span className="text-stone-900 font-medium">{member.address || '—'}</span></div>
          </div>
        </div>
        {member.wings && member.wings.length > 0 && (
          <div className="mt-4">
            <span className="text-stone-500 block text-xs mb-1.5">কার্যক্রম/উইং</span>
            <div className="flex flex-wrap gap-1.5">
              {member.wings.map((w) => (
                <span key={w} className="text-xs bg-red-50 text-[#790102] border border-red-100 px-2 py-1 rounded">{w}</span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 flex flex-wrap gap-x-4 gap-y-1">
          <span>যোগদান: {member.joinedDate || '—'}</span>
          <span>মেয়াদ: {member.validUntil || '—'}</span>
          <span>স্ট্যাটাস: {member.status === 'active' ? 'সক্রিয়' : member.status || '—'}</span>
        </div>
      </div>
    </div>
  );
}
