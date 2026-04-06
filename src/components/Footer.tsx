import React from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../hooks/useContent';

export default function Footer() {
  const { profile, loading } = useProfile();

  if (loading) return null;

  const name = profile?.name || '';
  const location = profile?.location || '';

  return (
    <footer className="border-t border-gray-200 px-6 py-6 dark:border-white/10 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-xl font-display font-bold tracking-tighter">{name.toUpperCase()}</p>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
        
        <div className="flex gap-8 text-sm font-medium text-gray-500">
          <Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/projects" className="hover:text-primary">Projects</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
        </div>

        <p className="text-sm text-gray-400">
          Built in {location.split(',')[0]}
        </p>
      </div>
    </footer>
  );
}
