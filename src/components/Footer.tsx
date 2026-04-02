import React from 'react';
import { CV_DATA } from '../data';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-6 py-6 dark:border-white/10 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-xl font-display font-bold tracking-tighter">{CV_DATA.name.toUpperCase()}</p>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
        
        <div className="flex gap-8 text-sm font-medium text-gray-500">
          <a href="#about" className="hover:text-primary">About</a>
          <a href="#projects" className="hover:text-primary">Projects</a>
          <a href="#contact" className="hover:text-primary">Contact</a>
        </div>

        <p className="text-sm text-gray-400">
          Built in {CV_DATA.location.split(',')[0]}
        </p>
      </div>
    </footer>
  );
}
