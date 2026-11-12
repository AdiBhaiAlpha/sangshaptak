import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useArticles } from '../context/ArticlesContext';
import { categories } from '../data/siteData';
import { auth, googleProvider, db } from '../lib/firebase';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { pushValue, removeValue, updateValue } from '../services/db';
import { uploadImageToImgbb } from '../services/imgbb';
import { Article, CategoryId } from '../types';
import {
  ShieldCheck,
  LogOut,
  PlusCircle,
  Trash2,
  Upload,
  Loader2,
  User as UserIcon,
  ImagePlus,
  X,
  CheckCircle2,
  Link as LinkIcon,
  Copy,
  Edit2,
  ArrowLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Flag,
  ClipboardList,
  BarChart3,
} from 'lucide-react';

const ADMIN_EMAIL = 'chitronbhattacharjee@gmail.com';

type Tab = 'dashboard' | 'upload' | 'articles' | 'members' | 'settings';

type ArticleRow = Article & { isDraft?: boolean };

type EditArticleForm = {
  id: string;
  title: string;
  shoulder?: string;
  excerpt: string;
  content: string;
  category: CategoryId;
  imageUrl: string;
  imageCaption?: string;
  tags: string;
  isLead: boolean;
  isSpecialFeature: boolean;
};

export default function AdminPage() {
  const { articles, loading } = useArticles();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('dashboard');

  // Upload form state
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [shoulder, setShoulder] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CategoryId>('mouthpiece');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [tags, setTags] = useState('');
  const [isLead, setIsLead] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);

  // Article management state
  const [editId, setEditId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditArticleForm | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) setUser(result.user);
      })
      .catch((e) => console.error('Redirect result error', e));
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleSignIn = async () => {
    setMessage(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      console.error(e);
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
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (re: any) {
          setMessage('সাইন-ইন ব্যর্থ হয়েছে। ব্রাউজার পপ-আপ অনুমতি দিন এবং আবার চেষ্টা করুন।');
          return;
        }
      }
      setMessage('সাইন-ইন ব্যর্থ হয়েছে। ' + (e?.message || ''));
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setTab('dashboard');
  };

  // --- Upload handlers ---
  const clearImage = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setImagePreview(null);
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setMessage('অনুগ্রহ করে একটি বৈধ ছবি ফাইল নির্বাচন করুন।');
      return;
    }
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    const localPreview = URL.createObjectURL(file);
    previewUrlRef.current = localPreview;
    setImagePreview(localPreview);
    setImageUrl('');
    setImageUploading(true);
    setMessage(null);
    try {
      const url = await uploadImageToImgbb(file);
      setImageUrl(url);
      setImagePreview(url);
      if (previewUrlRef.current && previewUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    } catch (e) {
      console.error('imgbb upload failed', e);
      setMessage('ছবি আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      clearImage();
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleImageFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleImageFile(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) {
      setMessage('শিরোনাম ও সংক্ষিপ্ত বিবরণ আবশ্যক।');
      return;
    }
    if (imageUploading) {
      setMessage('ছবি আপলোড শেষ হলে আবার চেষ্টা করুন।');
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const now = new Date();
      const categoryName = categories.find((c) => c.id === category)?.name || category;
      const article: Omit<Article, 'id'> & { createdAt: number; isDraft?: boolean } = {
        title: title.trim(),
        shoulder: shoulder.trim() || undefined,
        excerpt: excerpt.trim(),
        content: content.split('\n').map((s) => s.trim()).filter(Boolean),
        category,
        categoryName,
        imageUrl: imageUrl.trim() || '/assets/sangsaptak-editorial-card.jpg',
        imageCaption: imageCaption.trim() || undefined,
        publishedTime: now.toLocaleString('bn-BD'),
        author: { name: 'সংশপ্তক প্রতিনিধি' },
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        isLead,
        isSpecialFeature: isSpecial,
        createdAt: now.getTime(),
        isDraft: false,
      };
      const key = await pushValue('articles', article);
      await updateValue(`articles/${key}`, { id: key });
      setMessage('সংবাদ সফলভাবে আপলোড হয়েছে।');
      clearImage();
      setTitle(''); setShoulder(''); setExcerpt(''); setContent(''); setImageCaption(''); setTags(''); setIsLead(false); setIsSpecial(false);
    } catch (e: any) {
      console.error(e);
      const detail = e?.code || e?.message || '';
      setMessage(`আপলোড ব্যর্থ হয়েছে। ${detail ? `(${detail}) ` : ''}Firebase অনুমতি/নেটওয়ার্ক যাচাই করুন।`);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Article management helpers ---
  const articlesList = articles
    .slice()
    .sort((a, b) => {
      const ca = typeof a.createdAt === 'number' ? a.createdAt : 0;
      const cb = typeof b.createdAt === 'number' ? b.createdAt : 0;
      return cb - ca;
    });

  const draftCount = articlesList.filter((a) => a.isDraft).length;
  const publishedCount = articlesList.filter((a) => !a.isDraft).length;

  const togglePublish = async (article: Article) => {
    if (!isAdmin) return;
    try {
      await updateValue(`articles/${article.id}`, { isDraft: !article.isDraft });
      setMessage(article.isDraft ? 'প্রকাশিত করা হয়েছে।' : 'ড্রাফটে সরানো হয়েছে।');
    } catch (e) {
      console.error(e);
      setMessage('স্ট্যাটাস পরিবর্তন করতে সমস্যা হচ্ছে।');
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('এই সংবাদ মুছবেন? এই অপারেশন ফিরিয়ে আনা যাবে না।')) return;
    setDeletingId(id);
    try {
      await removeValue(`articles/${id}`);
      setMessage('সংবাদ মুছে ফেলা হয়েছে।');
      setSelectedArticles(new Set());
    } catch (e) {
      console.error(e);
      setMessage('মুছতে সমস্যা হচ্ছে।');
    } finally {
      setDeletingId(null);
    }
  };

  const bulkDelete = async () => {
    if (selectedArticles.size === 0) return;
    if (!confirm(`${selectedArticles.size} টি সংবাদ মুছে ফেলবেন?`)) return;
    try {
      for (const id of selectedArticles) {
        await removeValue(`articles/${id}`);
      }
      setMessage(`${selectedArticles.size} টি সংবাদ মুছে ফেলা হয়েছে।`);
      setSelectedArticles(new Set());
    } catch (e) {
      console.error(e);
      setMessage('বাল্ক ডিলিট করতে সমস্যা হচ্ছে।');
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedArticles);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedArticles(next);
  };

  const selectAll = (checked: boolean) => {
    if (checked) {
      setSelectedArticles(new Set(articlesList.map((a) => a.id)));
    } else {
      setSelectedArticles(new Set());
    }
  };

  const isAllSelected = articlesList.length > 0 && selectedArticles.size === articlesList.length;

  // --- Edit article inline ---
  const startEdit = (article: Article) => {
    setEditDraft({
      id: article.id,
      title: article.title,
      shoulder: article.shoulder,
      excerpt: article.excerpt,
      content: article.content.join('\n'),
      category: article.category,
      imageUrl: article.imageUrl,
      imageCaption: article.imageCaption,
      tags: (article.tags || []).join(', '),
      isLead: !!article.isLead,
      isSpecialFeature: !!article.isSpecialFeature,
    });
    setEditId(article.id);
  };

  const saveEdit = async () => {
    if (!editDraft || !editId) return;
    setSubmitting(true);
    try {
      const now = new Date();
      const categoryName = categories.find((c) => c.id === editDraft.category)?.name || editDraft.category;
      const updated: Partial<Article> & { createdAt: number } = {
        title: editDraft.title.trim(),
        shoulder: editDraft.shoulder?.trim() || undefined,
        excerpt: editDraft.excerpt.trim(),
        content: editDraft.content.split('\n').map((s) => s.trim()).filter(Boolean),
        category: editDraft.category,
        categoryName,
        imageUrl: editDraft.imageUrl.trim() || '/assets/sangsaptak-editorial-card.jpg',
        imageCaption: editDraft.imageCaption?.trim() || undefined,
        publishedTime: now.toLocaleString('bn-BD'),
        tags: editDraft.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isLead: !!editDraft.isLead,
        isSpecialFeature: !!editDraft.isSpecialFeature,
        createdAt: now.getTime(),
      };
      await updateValue(`articles/${editId}`, updated);
      setMessage('সংবাদ সম্পাদনা সম্পন্ন হয়েছে।');
      setEditId(null);
      setEditDraft(null);
    } catch (e) {
      console.error(e);
      setMessage('সম্পাদনা করতে সমস্যা হচ্ছে।');
    } finally {
      setSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditDraft(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-6 h-6 animate-spin text-[#790102]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-8 sm:p-10 max-w-md w-full text-center">
          <ShieldCheck className="w-10 h-10 text-[#790102] mx-auto mb-4" />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-950 mb-2">অ্যাডমিন প্যানেল</h1>
          <p className="text-sm text-gray-600 mb-6">এডমিন প্যানেলে প্রবেশ করতে গুগল দিয়ে সাইন-ইন করুন।</p>
          <button
            onClick={handleSignIn}
            className="w-full bg-[#790102] hover:bg-red-800 text-white font-semibold py-3 px-4 rounded-md shadow-sm transition flex items-center justify-center space-x-3 cursor-pointer"
          >
            <UserIcon className="w-5 h-5" />
            <span>গুগল দিয়ে সাইন-ইন</span>
          </button>
          <div className="mt-4 text-[11px] text-stone-500">
            অনুমতি শুধুমাত্র: {ADMIN_EMAIL}
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
        <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-8 text-center max-w-md w-full">
          <Flag className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">অননুমতি</h2>
          <p className="text-sm text-gray-600 mb-4">আপনার অ্যাকাউন্ট এডমিন প্যানেলে প্রবেশের অনুমতি নেই।</p>
          <button
            onClick={handleSignOut}
            className="bg-[#790102] hover:bg-red-800 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            সাইন-আউট
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col font-sans">
      <header className="bg-[#790102] text-white px-4 py-3 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 mr-1" />
            <span className="font-serif font-bold text-lg">সংশপ্তক অ্যারে অ্যাডমিন</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span>ইমেইল: {user.email}</span>
            <button onClick={handleSignOut} className="text-amber-100 hover:text-white underline underline-offset-2">সাইন-আউট</button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <SEO title="অ্যাডমিন ড্যাশবোর্ড" />

        {/* Sidebar Nav */}
        <nav className="hidden sm:flex sm:flex-col sm:w-64 sm:mr-8 mt-4 sm:mt-0">
          <div className="border border-stone-200 rounded-lg bg-white p-3 shadow-sm">
            {[
              { id: 'dashboard' as Tab, label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
              { id: 'upload' as Tab, label: 'সংবাদ আপলোড', icon: Upload },
              { id: 'articles' as Tab, label: 'সংবাদ ব্যবস্থাপনা', icon: ClipboardList },
              { id: 'members' as Tab, label: 'সদস্য তালিকা', icon: Users },
              { id: 'settings' as Tab, label: 'সেটিংস', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition ${
                  tab === item.id
                    ? 'bg-[#790102]/10 text-[#790102] font-semibold border border-[#790102]/30'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-[#790102]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <main className="mt-4 sm:mt-0 flex-1">
          {/* Dashboard Tab */}
          {tab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-5 rounded border border-stone-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-stone-500 uppercase font-semibold">মেট্রিক {i}</p>
                      <p className="text-2xl font-bold text-gray-900">{i * 100}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded border border-stone-200 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-4">দ্রুত কাজ</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setTab('upload')}
                  className="bg-[#790102] hover:bg-red-800 text-white text-sm font-medium px-4 py-3 rounded-md flex items-center gap-2 transition"
                >
                  <Upload className="w-4 h-4" /> নতুন সংবাদ আপলোড
                </button>
                <button
                  onClick={() => setTab('articles')}
                  className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-sm font-medium px-4 py-3 rounded-md flex items-center gap-2 transition"
                >
                  <ClipboardList className="w-4 h-4" /> সংবাদ ব্যবস্থাপনা
                </button>
                <button
                  onClick={() => setTab('members')}
                  className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-sm font-medium px-4 py-3 rounded-md flex items-center gap-2 transition"
                >
                  <Users className="w-4 h-4" /> সদস্য তালিকা
                </button>
              </div>
            </div>
          </>
          )}

          {/* Upload Tab */}
          {tab === 'upload' && (
            <div className="bg-white p-6 rounded border border-stone-200 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-4">সংবাদ আপলোড</h3>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">শিরোনাম</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102]" placeholder="সংবাদ শিরোনাম" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">বিভাগ</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as CategoryId)} className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102]">
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">সংক্ষিপ্ত বিবরণ</label>
                  <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102]" placeholder="সংক্ষিপ্ত বিবরণ" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">নিবন্ধ বডি (নতুন লাইনের সাথে আলাদা প্যারাগ্রাফ)</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102] font-kona" placeholder="নিবন্ধের সম্পূর্ণ টেক্সট..." />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">সংবাদ ছবি (নির্বাচন বা Drag & Drop)</label>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageInputChange} className="hidden" />
                  <div
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
                    onDrop={handleDrop}
                    onClick={() => !imageUploading && fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${dragActive ? 'border-[#790102] bg-red-50' : 'border-stone-300 hover:border-[#790102]/60 bg-stone-50 hover:bg-stone-100/70'} ${imageUploading ? 'opacity-70 pointer-events-none' : ''}`}
                  >
                    {!imagePreview && !imageUrl ? (
                      <div className="flex flex-col items-center justify-center text-stone-600 py-4">
                        <ImagePlus className="w-10 h-10 text-stone-400 mb-2" />
                        <p className="text-sm font-medium text-stone-800">ছবি নির্বাচন করুন বা এখানে Drag & Drop করুন</p>
                        <p className="text-xs text-stone-500 mt-1">নির্বাচন করলে স্বয়ংক্রিয়ভাবে imgbb-তে আপলোড হয়ে direct URL তৈরি হবে</p>
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden bg-white border border-stone-200">
                        <img src={imagePreview || imageUrl} alt="প্রিভিউ" className="w-full max-h-64 object-contain" />
                        {imageUploading && (
                          <div className="absolute inset-0 bg-black/45 backdrop-blur flex flex-col items-center justify-center text-white">
                            <Loader2 className="w-6 h-6 animate-spin mb-2" />
                            <p className="text-sm">আপলোড হচ্ছে...</p>
                          </div>
                        )}
                        <button type="button" onClick={(e) => { e.stopPropagation(); clearImage(); }} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/55 hover:bg-black/70 text-white flex items-center justify-center">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="mt-3 border border-dashed rounded-lg px-3 py-2 text-center text-xs cursor-pointer transition ${dragActive ? 'border-[#790102] bg-red-50 text-[#790102]' : 'border-stone-300 text-stone-600 hover:border-stone-400 hover:bg-white'} ${imageUploading ? 'opacity-60 pointer-events-none' : ''}" onClick={() => !imageUploading && fileInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }} onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }} onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }} onDrop={handleDrop}>
                      নতুন ছবি নির্বাচন করুন বা এখানে Drag & Drop করুন
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">ছবি ক্যাপশন</label>
                  <input value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">লেখক</label>
                  <div className="w-full border border-stone-200 bg-stone-50 rounded-md px-3 py-2 text-sm text-stone-800">সংশপ্তক প্রতিনিধি</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input id="isLead" type="checkbox" checked={isLead} onChange={(e) => setIsLead(e.target.checked)} className="text-[#790102] rounded" />
                    <label htmlFor="isLead" className="text-sm text-stone-700">লিড আর্টিকল (ফ্রন্টপেজে সবচেয়ে ওপরে দেখাবে)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="isSpecial" type="checkbox" checked={isSpecial} onChange={(e) => setIsSpecial(e.target.checked)} className="text-[#790102] rounded" />
                    <label htmlFor="isSpecial" className="text-sm text-stone-700">স্পেশাল ফিচার</label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">ট্যাগ (কমা দিয়ে আলাদা)</label>
                  <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102]" placeholder="ট্যাগ1, ট্যাগ2" />
                </div>

                {message && <p className="text-xs text-red-600">{message}</p>}
                <button type="submit" disabled={submitting || imageUploading} className="bg-[#790102] hover:bg-red-800 disabled:opacity-50 text-white font-semibold py-3 px-8 rounded-md transition flex items-center space-x-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{submitting ? 'আপলোড হচ্ছে...' : imageUploading ? 'ছবি আপলোড হচ্ছে...' : 'সংবাদ আপলোড করুন'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Articles Management Tab */}
          {tab === 'articles' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded border border-stone-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gray-900">সংবাদ ব্যবস্থাপনা</h3>
                    <p className="text-xs text-stone-500">সমস্ত সংবাদ, ড্রাফট ও অপubblica কন্ট্রোল</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs text-stone-500">মোট: {articlesList.length} • প্রকাশিত: {publishedCount} • ড্রাফট: {draftCount}</span>
                    {selectedArticles.size > 0 && (
                      <button onClick={bulkDelete} disabled={deletingId !== null} className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition">
                        বাল্ক ডিলিট ({selectedArticles.size})
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] border-b border-stone-200">
                        <th className="w-8 px-3 py-3 text-left"><input type="checkbox" checked={isAllSelected} onChange={(e) => selectAll(e.target.checked)} className="rounded text-[#790102]" /></th>
                        <th className="px-3 py-3 text-left">শিরোনাম</th>
                        <th className="px-3 py-3 text-left">বিভাগ</th>
                        <th className="px-3 py-3 text-left">সময়</th>
                        <th className="px-3 py-3 text-left">স্ট্যাটাস</th>
                        <th className="px-3 py-3 text-right">কrijkা</th>
                      </tr>
                    </thead>
                    <tbody className="text-stone-700 divide-y divide-stone-100">
                      {articlesList.length === 0 ? (
                        <tr><td colSpan={6} className="px-3 py-8 text-center text-stone-400">কোনো সংবাদ নেই।</td></tr>
                      ) : (
                        articlesList.map((article) => {
                          const isSelected = selectedArticles.has(article.id);
                          const isEditing = editId === article.id;
                          return (
                            <tr key={article.id} className="hover:bg-stone-50 transition border-b border-stone-50/30 last:border-0">
                              <td className="px-3 py-3">
                                <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(article.id)} className="rounded text-[#790102]" />
                              </td>
                              <td className="px-3 py-3">
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <input defaultValue={article.title} className="w-full border border-stone-300 rounded px-2 py-1 text-sm" />
                                    <textarea defaultValue={article.excerpt} rows={2} className="w-full border border-stone-300 rounded px-2 py-1 text-sm" />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium truncate max-w-[300px]">{article.title}</span>
                                    {article.isLead && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">লিড</span>}
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-3">{article.categoryName}</td>
                              <td className="px-3 py-3 text-xs text-stone-500">{article.publishedTime}</td>
                              <td className="px-3 py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${article.isDraft ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                  {article.isDraft ? 'ড্রাফট' : 'প্রকাশিত'}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-right space-x-1">
                                {isEditing ? (
                                  <div className="flex gap-1">
                                    <button onClick={saveEdit} disabled={submitting} className="bg-[#790102] hover:bg-red-800 text-white text-[10px] px-2 py-1.5 rounded transition">
                                      সংরক্ষণ
                                    </button>
                                    <button onClick={cancelEdit} className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] px-2 py-1.5 rounded transition">বাতিল</button>
                                  </div>
                                ) : (
                                  <div className="flex gap-1">
                                    <button onClick={() => startEdit(article)} className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] px-2 py-1.5 rounded transition" title="সম্পাদনা">
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => togglePublish(article)} className={`text-white text-[10px] px-2 py-1.5 rounded transition ${article.isDraft ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-600'}`} title={article.isDraft ? 'প্রকাশ করুন' : 'ড্রাফটে সরান'}>
                                      {article.isDraft ? 'প্রকাশ' : 'ড্রাফট'}
                                    </button>
                                    <button onClick={() => deleteArticle(article.id)} disabled={deletingId === article.id} className="bg-red-50 hover:bg-red-100 text-red-700 text-[10px] px-2 py-1.5 rounded transition" title="মুছুন">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inline edit full form (when editing an existing article fully) */}
              {editDraft && (
                <div className="bg-white p-6 rounded border border-stone-200 shadow-sm mt-6">
                  <h4 className="font-serif text-lg font-bold text-gray-900 mb-4">সম্পাদনা: {editDraft.title}</h4>
                  <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">শিরোনাম</label>
                      <input defaultValue={editDraft.title} className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">বিভাগ</label>
                      <select defaultValue={editDraft.category} className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#790102]">
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">বডি</label>
                      <textarea defaultValue={editDraft.content} rows={4} className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm font-kona focus:outline-none focus:border-[#790102]" />
                    </div>
                    <div className="flex justify-between items-center">
                      <button type="button" onClick={cancelEdit} className="text-stone-600 hover:text-stone-800 text-sm font-medium">বাতিল</button>
                      <button type="submit" disabled={submitting} className="bg-[#790102] hover:bg-red-800 text-white font-semibold px-5 py-2 rounded-md transition">
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Members Tab */}
          {tab === 'members' && (
            <div className="bg-white p-6 rounded border border-stone-200 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-4">সদস্য তালিকা</h3>
              <p className="text-sm text-stone-500 mb-4">সদস্যপদ Лениন stories here (LocalStorage based)</p>
              <div className="bg-stone-50 p-4 rounded border border-stone-200 text-sm">
                <p className="text-stone-600">বর্তমানে কোনো সদস্য নিবন্ধিত নেই। মেম্বার লিস্ট Firebase এবং লোকালস্টোরেজ থেকে সংগ্রহিত হবে।</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {tab === 'settings' && (
            <div className="bg-white p-6 rounded border border-stone-200 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-4">সেটিংস</h3>
              <div className="space-y-4">
                <div className="p-4 border border-stone-200 rounded bg-stone-50">
                  <p className="text-sm text-stone-600">এডমিন ইমেইল: <span className="font-mono text-[#790102]">{ADMIN_EMAIL}</span></p>
                  <p className="text-sm text-stone-600 mt-2">ইমaje আপলোড পরিষেবা: imgbb</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
