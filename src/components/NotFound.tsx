import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-9xl font-display font-black tracking-tighter text-primary">404</h1>
        <h2 className="text-3xl font-display font-bold tracking-tight">Halaman Tidak Ditemukan</h2>
        <p className="mx-auto max-w-md text-muted-foreground leading-relaxed">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
        >
          <Home size={18} />
          Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  );
}
