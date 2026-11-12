import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const CampusPage = lazy(() => import('./pages/CampusPage'));
const EpaperPage = lazy(() => import('./pages/EpaperPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SiteUrlPage = lazy(() => import('./pages/SiteUrlPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ConstitutionPage = lazy(() => import('./pages/ConstitutionPage'));
const MembershipPage = lazy(() => import('./pages/MembershipPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const PublicationsPage = lazy(() => import('./pages/PublicationsPage'));
const NoticeboardPage = lazy(() => import('./pages/NoticeboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function Fallback() {
  return <div className="p-8 text-center text-gray-500">লোড হচ্ছে...</div>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Suspense fallback={<Fallback />}><HomePage /></Suspense>} />
        <Route path="/article/:id" element={<Suspense fallback={<Fallback />}><ArticlePage /></Suspense>} />
        <Route path="/category/:slug" element={<Suspense fallback={<Fallback />}><CategoryPage /></Suspense>} />
        <Route path="/campus/:name" element={<Suspense fallback={<Fallback />}><CampusPage /></Suspense>} />
        <Route path="/epaper" element={<Suspense fallback={<Fallback />}><EpaperPage /></Suspense>} />
        <Route path="/dashboard" element={<Suspense fallback={<Fallback />}><DashboardPage /></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={<Fallback />}><AdminPage /></Suspense>} />
        <Route path="/site-url" element={<Suspense fallback={<Fallback />}><SiteUrlPage /></Suspense>} />
        <Route path="/siteurl" element={<Suspense fallback={<Fallback />}><SiteUrlPage /></Suspense>} />
        <Route path="/about" element={<Suspense fallback={<Fallback />}><AboutPage /></Suspense>} />
        <Route path="/constitution" element={<Suspense fallback={<Fallback />}><ConstitutionPage /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<Fallback />}><ContactPage /></Suspense>} />
        <Route path="/membership" element={<Suspense fallback={<Fallback />}><MembershipPage /></Suspense>} />
        <Route path="/events" element={<Suspense fallback={<Fallback />}><EventsPage /></Suspense>} />
        <Route path="/gallery" element={<Suspense fallback={<Fallback />}><GalleryPage /></Suspense>} />
        <Route path="/publications" element={<Suspense fallback={<Fallback />}><PublicationsPage /></Suspense>} />
        <Route path="/noticeboard" element={<Suspense fallback={<Fallback />}><NoticeboardPage /></Suspense>} />
        <Route path="/login" element={<Suspense fallback={<Fallback />}><LoginPage /></Suspense>} />
        <Route path="/register" element={<Suspense fallback={<Fallback />}><RegisterPage /></Suspense>} />
        <Route path="/profile" element={<Suspense fallback={<Fallback />}><ProfilePage /></Suspense>} />
        <Route path="/404" element={<Suspense fallback={<Fallback />}><NotFoundPage /></Suspense>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
