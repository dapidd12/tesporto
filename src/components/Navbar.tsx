import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useProfile } from '../hooks/useContent';

export default function Navbar() {
  const { profile } = useProfile();
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const nickname = profile?.nickname || '';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Berita', href: '/berita' },
    { name: 'Contact', href: '/contact' },
  ];

  if (location.pathname === '/admin') return null;

  return (
    <>
      <nav
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-500',
          isScrolled ? 'bg-background/60 py-3 shadow-lg shadow-black/5 backdrop-blur-xl border-b border-border/50' : 'bg-transparent py-6'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link to="/" className="text-xl font-display font-black tracking-tighter hover:scale-105 transition-transform">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">KaiDeveloper</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex glass px-8 py-3 rounded-full">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-0.5",
                  location.pathname === link.href ? "text-primary drop-shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-5 border-l border-border/50 pl-6 ml-2">
              <Link
                to="/login"
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-0.5",
                  location.pathname === '/login' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Admin
              </Link>
              <button
                onClick={() => setIsDark(!isDark)}
                className="text-muted-foreground transition-all hover:text-foreground hover:rotate-12"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setIsDark(!isDark)}
              className="text-muted-foreground"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/95 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-2xl font-display font-bold tracking-tight",
                    location.pathname === link.href ? "text-primary" : "text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 text-xl font-bold text-primary"
              >
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
