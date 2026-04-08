import React from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../hooks/useContent';

export default function Footer() {
  const { profile, loading } = useProfile();

  if (loading) return null;

  const name = profile?.name || '';
  const location = profile?.location || '';
  const footerText = profile?.footerText || `© ${new Date().getFullYear()} All Rights Reserved.`;

  return (
    <footer className="border-t border-border/50 px-6 py-8 md:px-12 bg-muted/20 dark:bg-muted/5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-xl font-display font-black tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{name.toUpperCase()}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{footerText}</p>
        </div>
        
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
          Built in {location.split(',')[0]}
        </p>
      </div>
    </footer>
  );
}
