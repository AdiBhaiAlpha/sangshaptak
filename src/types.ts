export type CategoryId =
  | 'all'
  | 'latest'
  | 'mouthpiece'     // মুখপত্র ও ছাত্র আন্দোলন
  | 'literature'     // সাহিত্য ও শিল্পকলা
  | 'study_circle'   // বুদ্ধিবৃত্তিক চর্চা ও পাঠচক্র
  | 'sports'         // ক্রীড়া
  | 'songs_poetry'   // গান ও কবিতা
  | 'publications'   // প্রকাশনা ও দেয়াল পত্রিকা
  | 'mymensingh'     // ময়মনসিংহ জেলা শাখা কার্যক্রম
  | 'national';      // শিক্ষাঙ্গন ও জাতীয় বার্তা

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  iconName?: string;
  subCategories?: string[];
}

export interface Article {
  id: string;
  title: string;
  shoulder?: string;
  excerpt: string;
  content: string[];
  category: CategoryId;
  categoryName: string;
  imageUrl: string;
  imageCaption?: string;
  publishedTime: string;
  createdAt?: number;
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
  viewsCount?: number;
  readTimeMinutes?: number;
  tags?: string[];
  isLead?: boolean;
  isSpecialFeature?: boolean;
  isDraft?: boolean;
  isVideo?: boolean;
  videoDuration?: string;
  audioUrl?: string; // For songs/poetry
  location?: {
    division: string;
    district: string;
    upazila?: string;
  };
}

export interface ClubMember {
  id: string; // e.g. SMP-MYM-2026-0842
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  institution: string;
  departmentOrClass: string;
  bloodGroup: string;
  wings: string[];
  avatarUrl: string;
  joinedDate: string;
  validUntil: string;
  emergencyContact?: string;
  address?: string;
  status: 'active' | 'approved';
  _source?: 'firebase' | 'manual';
}

export interface ClubEvent {
  id: string;
  title: string;
  wing: 'দাবা' | 'পাঠচক্র' | 'সাংস্কৃতিক সন্ধ্যা' | 'গান ও আবৃত্তি' | 'প্রকাশনা' | 'ছাত্র আন্দোলন';
  date: string;
  time: string;
  venue: string;
  description: string;
  leader?: string;
}

export interface PollData {
  id: string;
  question: string;
  date: string;
  totalVotes: number;
  yesPercent: number;
  noPercent: number;
  noOpinionPercent: number;
  userVoted?: 'yes' | 'no' | 'no_comment' | null;
}

export interface EpaperPage {
  pageNumber: number;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  clippings: Array<{
    id: string;
    headline: string;
    coords: { x: number; y: number; width: number; height: number };
    snippet: string;
  }>;
}
