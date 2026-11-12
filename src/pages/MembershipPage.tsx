import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { MembershipModal } from '../components/MembershipModal';
import { useMember } from '../context/MemberContext';
import { IdCard, UserPlus, Edit3, ShieldCheck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MembershipPage() {
  const navigate = useNavigate();
  const { member, setMember } = useMember();
  const [open, setOpen] = useState(false);

  const handleApplyLogin = () => {
    if (member) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleApplicationForm = () => {
    if (!member) {
      navigate('/login');
      return;
    }
    setOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <SEO title="সদস্যপদ" />
      <div className="bg-white p-5 sm:p-6 rounded border border-gray-200 shadow-xs">
        <h1 className="font-serif text-2xl font-bold text-gray-950 mb-1">সদস্যপদ আবেদন ও আইডি কার্ড</h1>
        <p className="text-sm text-gray-600">সংশপ্তক ক্লাবের সদস্যপদ, ডিজিটাল আইডি কার্ড ও প্রোফাইল ব্যবস্থাপনা।</p>
      </div>

      {!member ? (
        <div className="bg-white p-5 sm:p-6 rounded border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#790102] flex items-center justify-center border border-red-100">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">নতুন সদস্য আবেদন</h2>
              <p className="text-xs text-gray-600">গুগল দিয়ে সাইন-ইন করে সদস্য হোন এবং ডিজিটাল আইডি কার্ড গ্রহণ করুন।</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleApplyLogin}
              className="inline-flex items-center justify-center bg-[#790102] hover:bg-red-800 text-white font-semibold px-5 py-2.5 rounded-md text-sm transition"
            >
              <IdCard className="w-4 h-4 mr-2" />
              সদস্যপদ আবেদন / লগইন করুন
            </button>
            <button
              onClick={handleApplicationForm}
              className="inline-flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-5 py-2.5 rounded-md text-sm transition border border-stone-200"
              title="গুগল সাইন-ইন করার পর আবেদন ফর্ম খুলবে"
            >
              <Edit3 className="w-4 h-4 mr-2 text-[#790102]" />
              আবেদন ফর্ম
            </button>
          </div>
          <p className="text-xs text-stone-500 mt-4">
            suggestive: প্রথমে “সদস্যপদ আবেদন / লগইন করুন” বাটনে ক্লিক করে গুগল দিয়ে সাইন-ইন করুন, তারপর আবেদন ফর্ম পূরণ করুন।
          </p>
        </div>
      ) : (
        <div className="bg-white p-5 sm:p-6 rounded border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <img
                src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={member.name}
                className="w-14 h-14 rounded-full object-cover border border-stone-200"
              />
              <div>
                <h2 className="font-serif text-lg font-bold text-gray-900">{member.name}</h2>
                <p className="text-xs font-mono text-[#790102]">{member.id}</p>
                <p className="text-xs text-emerald-700 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  সক্রিয় সদস্য
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center gap-2 bg-[#790102] hover:bg-red-800 text-white font-semibold px-4 py-2.5 rounded-md text-sm transition"
            >
              <IdCard className="w-4 h-4" />
              সদস্য কার্ড দেখুন
            </button>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-4 py-2.5 rounded-md text-sm transition border border-stone-200"
            >
              <Edit3 className="w-4 h-4 text-[#790102]" />
              তথ্য/ছবি সংশোধন
            </button>
            <button
              onClick={() => {
                setMember(null);
              }}
              className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-4 py-2.5 rounded-md text-sm transition border border-stone-200"
            >
              <LogOut className="w-4 h-4" />
              লগআউট
            </button>
          </div>

          <p className="text-xs text-stone-500">
            কার্ড প্রিন্ট/ডাউনলোড, ছবি আপলোড ও তথ্য আপডেট করতে উপরের বাটনে ক্লিক করে মেম্বার পোর্টাল ব্যবহার করুন।
          </p>
        </div>
      )}

      <MembershipModal
        isOpen={open}
        onClose={() => setOpen(false)}
        currentMember={member}
        onSaveMember={(m) => setMember(m)}
        onLogout={() => {
          setMember(null);
          setOpen(false);
        }}
      />
    </div>
  );
}
