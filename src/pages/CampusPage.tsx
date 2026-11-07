import React from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';

export default function CampusPage() {
  const { name } = useParams();
  return (
    <div className="bg-white p-6 rounded border border-gray-200 shadow-xs">
      <SEO title={name || 'ক্যাম্পাস'} />
      <h1 className="font-serif text-2xl font-bold text-gray-950">{decodeURIComponent(name || '')}</h1>
      <p className="text-sm text-gray-600 mt-2">ক্যাম্পাস সংবাদ ও কার্যক্রম।</p>
    </div>
  );
}
