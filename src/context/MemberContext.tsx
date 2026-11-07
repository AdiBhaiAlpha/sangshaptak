import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ClubMember } from '../types';

interface Ctx {
  member: ClubMember | null;
  setMember: (m: ClubMember | null) => void;
}
const MemberContext = createContext<Ctx>({ member: null, setMember: () => {} });

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
  return <MemberContext.Provider value={{ member, setMember: set }}>{children}</MemberContext.Provider>;
}

export const useMember = () => useContext(MemberContext);
