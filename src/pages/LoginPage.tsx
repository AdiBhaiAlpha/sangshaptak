import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { auth, googleProvider } from '../lib/firebase';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { User as UserIcon, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  const handleAuthState = useCallback((u: User | null) => {
    setCurrentUser(u);
    setChecking(false);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, handleAuthState);
    return () => unsub();
  }, [handleAuthState]);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setCurrentUser(result.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage('');
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
          setLoading(false);
          return;
        }
      }
      setMessage('সাইন-ইন ব্যর্থ হয়েছে। ' + (e?.message || ''));
      setLoading(false);
    }
  };

  const handleGoProfile = () => {
    navigate('/profile');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-[#790102]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <SEO title="সাইন-ইন" />
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-8 sm:p-10 max-w-md w-full text-center">
        <ShieldCheck className="w-10 h-10 text-[#790102] mx-auto mb-4" />

        {currentUser ? (
          <>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-950 mb-2">আপনি ইতিমধ্যে সাইন-ইন করেছেন</h1>
            <p className="text-sm text-gray-600 mb-4">{currentUser.displayName || currentUser.email}</p>
            <p className="text-xs text-stone-500 mb-4">প্রোফাইলে যেতে নিচের বাটনে ক্লিক করুন।</p>
            <button
              onClick={handleGoProfile}
              className="w-full bg-[#790102] hover:bg-red-800 text-white font-semibold py-3 px-4 rounded-md shadow-sm transition flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" /> প্রোফাইলে যান
            </button>
          </>
        ) : (
          <>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-950 mb-2">সাইন-ইন করুন</h1>
            <p className="text-sm text-gray-600 mb-6">গুগল অ্যাকাউন্ট দিয়ে সাইন-ইন করুন এবং সদস্যপদ／প্রোফাইল ব্যবহার করুন।</p>
            {message && <p className="text-xs text-red-600 mb-4">{message}</p>}
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-md shadow-sm transition flex items-center justify-center space-x-3 cursor-pointer group disabled:opacity-50"
              disabled={loading}
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
              <span>গুগল দিয়ে সাইন-ইন</span>
            </button>
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-[#790102] font-medium hover:underline flex items-center gap-1 inline-flex"
              >
                <ArrowLeft className="w-3 h-3" /> প্রচ্ছদে ফিরুন
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
