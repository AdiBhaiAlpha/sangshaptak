import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ClubMember } from '../types';
import { auth } from '../lib/firebase';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';

interface Ctx {
  member: ClubMember | null;
  setMember: (m: ClubMember | null) => void;
  signOut: () => Promise<void>;
}
const MemberContext = createContext<Ctx>({ member: null, setMember: () => {}, signOut: () => Promise.resolve() });

function memberFromFirebaseUser(u: User): ClubMember {
  return {
    id: `firebase:${u.uid}`,
    name: u.displayName || 'সংশপ্তক প্রতিনিধি',
    nameEn: u.displayName || 'Club Member',
    email: u.email || '',
    phone: '',
    institution: '',
    departmentOrClass: '',
    bloodGroup: '',
    avatarUrl: u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    joinedDate: new Date().toLocaleDateString('bn-BD'),
    validUntil: '',
    address: '',
    status: 'active',
    wings: [],
    _source: 'firebase',
  };
}

export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<ClubMember | null>(() => {
    try {
      const saved = localStorage.getItem('samshaptak_member');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const set = (m: ClubMember | null) => {
    setMember(m);
    try {
      if (m) localStorage.setItem('samshaptak_member', JSON.stringify(m));
      else localStorage.removeItem('samshaptak_member');
    } catch {}
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {}
    set(null);
  };

  // Sync Firebase auth session with member context.
  // If a Firebase user is logged in (e.g. admin) but no localStorage member exists,
  // create a member profile from the Firebase user so /profile works.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u: User | null) => {
      if (u) {
        // Firebase user exists
        if (!member || member._source !== 'firebase') {
          const fm = memberFromFirebaseUser(u);
          set(fm);
        } else if (member.id !== `firebase:${u.uid}`) {
          // Same firebase source but different user (e.g. switched accounts)
          const fm = memberFromFirebaseUser(u);
          set(fm);
        }
      } else {
        // Firebase user signed out
        if (member && member._source === 'firebase') {
          set(null);
        }
      }
    });
    return () => unsub();
  }, [member, set]);

  return (
    <MemberContext.Provider value={{ member, setMember: set, signOut }}>
      {children}
    </MemberContext.Provider>
  );
}

export const useMember = () => useContext(MemberContext);
