import React from 'react';
import { SEO } from '../components/SEO';
import { useMember } from '../context/MemberContext';
import { LayoutDashboard, Users, Calendar, FileText, Image, Settings } from 'lucide-react';

export default function DashboardPage() {
  const { member } = useMember();
  const cards = [
    { label: 'সদস্য', value: '—', icon: Users },
    { label: 'ইভেন্ট', value: '—', icon: Calendar },
    { label: 'প্রকাশনা', value: '—', icon: FileText },
    { label: 'গ্যালারি', value: '—', icon: Image },
  ];
  return (
    <div className="space-y-6">
      <SEO title="ড্যাশবোর্ড" />
      <div className="bg-white p-6 rounded border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-950 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-[#790102]" />
            ড্যাশবোর্ড
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {member ? `স্বাগতম, ${member.name}` : 'লগইন করুন'}
          </p>
        </div>
        <Settings className="w-5 h-5 text-gray-400" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-5 rounded border border-gray-200 shadow-xs">
            <c.icon className="w-6 h-6 text-[#790102] mb-2" />
            <div className="text-2xl font-bold text-gray-900">{c.value}</div>
            <div className="text-xs text-gray-500">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
