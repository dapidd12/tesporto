import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Berita', href: '/berita' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed left-1/2 top-4 z-50 w-[95%] max-w-6xl -translate-x-1/2 transition-all duration-500',
          isScrolled ? 'top-4' : 'top-6'
        )}
      >
        <div 
          className={cn(
            "flex items-center justify-between rounded-full border px-6 py-3 transition-all duration-500",
            isScrolled 
              ? "border-border/50 bg-background/80 shadow-lg shadow-black/5 backdrop-blur-xl dark:shadow-black/20" 
              : "border-transparent bg-transparent"
          )}
        >
          <Link
            to="/"
            className="text-base font-display font-black tracking-tighter md:text-lg z-50 relative"
          >
            <span className="text-primary">KAI</span>
            <span className="text-foreground"> DEVELOPER</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105",
                  location.pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-4 w-[1px] bg-border mx-2"></div>
            <Link
              to="/login"
              className="group flex h-9 items-center justify-center rounded-full border border-border bg-card px-4 text-[10px] font-black uppercase tracking-widest text-foreground transition-all hover:scale-105 active:scale-95 hover:border-primary/50 hover:text-primary hover:shadow-sm"
            >
              Login
            </Link>
            <button
              onClick={() => setIsDark(!isDark)}
              className="group flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:scale-110 active:scale-95 hover:border-primary/50 hover:shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <Sun size={16} className="transition-transform group-hover:rotate-45" />
              ) : (
                <Moon size={16} className="transition-transform group-hover:-rotate-12" />
              )}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-3 lg:hidden z-50 relative">
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all active:scale-95"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-transform active:scale-95"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex h-screen w-full flex-col items-center justify-center bg-background/95 lg:hidden"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-4xl font-display font-black tracking-tighter transition-colors",
                    location.pathname === link.href ? "text-primary" : "text-foreground hover:text-primary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 rounded-full bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-primary-foreground transition-transform active:scale-95"
              >
                Login Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
