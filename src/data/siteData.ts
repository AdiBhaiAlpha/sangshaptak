import { Article, Category, ClubEvent, EpaperPage, PollData } from '../types';

// Site configuration (content is loaded from Firebase Realtime Database).
export const categories: Category[] = [
  { id: 'mouthpiece', name: 'মুখপত্র ও সম্পাদকীয়', slug: 'mouthpiece', subCategories: ['সম্পাদকীয়', 'ছাত্র আন্দোলন', 'শিক্ষা অধিকার', 'কেন্দ্রীয় ও জেলা বার্তা'] },
  { id: 'literature', name: 'শিল্প, সাহিত্য ও সংস্কৃতি', slug: 'literature', subCategories: ['ছোটগল্প', 'কবিতা ও ছড়া', 'নাট্য আন্দোলন', 'চিত্রকলা', 'বই পর্যালোচনা'] },
  { id: 'study_circle', name: 'বুদ্ধিবৃত্তিক পাঠচক্র', slug: 'study_circle', subCategories: ['মার্কসীয় দর্শন', 'সমাজবিজ্ঞান ও ইতিহাস', 'বিজ্ঞান চেতনা', 'বিতর্ক সংসদ'] },
  { id: 'sports', name: 'ক্রীড়া', slug: 'sports', subCategories: ['নিয়মিত আড্ডা', 'টুর্নামেন্ট নোটিশ', 'দাবা কৌশল ও পাজল', 'সদস্য তালিকা'] },
  { id: 'songs_poetry', name: 'গান ও আবৃত্তি', slug: 'songs_poetry', subCategories: ['গণসংগীত', 'বিদ্রোহী কবিতা', 'সুরসাধনা', 'সাংস্কৃতিক সন্ধ্যা'] },
  { id: 'publications', name: 'প্রকাশনা ও দেয়াল পত্রিকা', slug: 'publications', subCategories: ['সংশপ্তক ম্যাগাজিন সংখ্যা', 'দেওয়াল পত্রিকা', 'বুলেটিন', 'ক্রোড়পত্র'] },
  { id: 'mymensingh', name: 'ময়মনসিংহ জেলা শাখা', slug: 'mymensingh', subCategories: ['আনন্দ মোহন কলেজ শাখা', 'বাকৃবি শাখা', 'পৌর ও স্কুল শাখা', 'আলোকচিত্র'] },
];

// Content is loaded from Firebase Realtime Database; no fake news shipped.
export const articles: Article[] = [];
export const epaperPages: EpaperPage[] = [];
export const poll: PollData | null = null;