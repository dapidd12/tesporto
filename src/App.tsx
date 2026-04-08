/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Marquee from './components/Marquee';
import Testimonials from './components/Testimonials';
import Comments from './components/Comments';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import BackToTop from './components/BackToTop';
import PageWrapper from './components/PageWrapper';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Announcements from './components/Announcements';
import Gallery from './components/Gallery';
import News from './components/News';
import MusicPlayer from './components/MusicPlayer';
import { AnimatePresence } from 'motion/react';

import { Toaster } from 'sonner';

const AntiInspect = () => {
  React.useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      {/* @ts-expect-error - key is required for AnimatePresence but not in RoutesProps types */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageWrapper>
            <main>
              <Hero />
              <Marquee />
              <Projects limit={2} hideFilter={true} />
            </main>
          </PageWrapper>
        } />
        <Route path="/about" element={
          <PageWrapper>
            <main className="pt-24">
              <About />
              <Skills />
              <Certificates />
            </main>
          </PageWrapper>
        } />
        <Route path="/projects" element={
          <PageWrapper>
            <main className="pt-24">
              <Projects />
            </main>
          </PageWrapper>
        } />
        <Route path="/gallery" element={
          <PageWrapper>
            <main className="pt-24">
              <Gallery />
            </main>
          </PageWrapper>
        } />
        <Route path="/berita" element={
          <PageWrapper>
            <main className="pt-24">
              <News />
            </main>
          </PageWrapper>
        } />
        <Route path="/contact" element={
          <PageWrapper>
            <main className="pt-24">
              <Testimonials />
              <Comments />
              <Contact />
            </main>
          </PageWrapper>
        } />
        <Route path="/login" element={
          <PageWrapper>
            <AdminLogin />
          </PageWrapper>
        } />
        <Route path="/admin" element={
          <PageWrapper>
            <AdminDashboard />
          </PageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <SmoothScroll>
        <div className="relative min-h-screen overflow-x-hidden selection:bg-primary selection:text-white">
          <AntiInspect />
          <Toaster position="top-center" richColors />
          <Preloader />
          <CustomCursor />
          <Announcements />
          <MusicPlayer />
          <Navbar />
          <ScrollToTop />
          <AnimatedRoutes />
          <BackToTop />
          <Footer />
        </div>
      </SmoothScroll>
    </Router>
  );
}
