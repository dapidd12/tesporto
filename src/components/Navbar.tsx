import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { CV_DATA } from '../data';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Comments', href: '#comments' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 py-4',
        isScrolled ? 'bg-background/80 backdrop-blur-lg py-3 border-b border-border shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-base font-display font-black tracking-tighter md:text-lg"
        >
          <span className="text-primary">KAI</span>
          <span className="text-foreground"> DEVELOPER</span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </motion.a>
          ))}
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:scale-105 active:scale-95"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={() => setIsDark(!isDark)}
            className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={false}
        animate={mobileMenuOpen ? { x: 0 } : { x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 top-0 left-0 z-40 flex h-screen w-full flex-col items-center justify-center bg-white dark:bg-black md:hidden"
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-6 right-6"
        >
          <X size={32} />
        </button>
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl font-display font-bold tracking-tighter hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      </motion.div>
    </nav>
  );
}
