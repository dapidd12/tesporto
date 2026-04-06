import React from 'react';
import { motion } from 'motion/react';
import { useProfile } from '../hooks/useContent';

export default function About() {
  const { profile, loading } = useProfile();

  if (loading) return null;

  const summary = profile?.summary || '';
  const location = profile?.location || '';
  const status = profile?.status || '';

  return (
    <section id="about" className="px-6 py-6 md:px-12">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-10 bg-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">Tentang Saya</span>
          </div>
          
          <h2 className="text-3xl font-display font-bold tracking-tighter md:text-5xl">
            Membangun masa depan melalui <span className="text-primary">kode</span> dan <span className="text-secondary">kreativitas</span>.
          </h2>
          
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            {summary}
          </p>

          <div className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2">
            <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg">
              <h3 className="mb-2 text-sm font-black uppercase tracking-widest text-primary">Domisili</h3>
              <p className="text-lg font-bold text-foreground">{location}</p>
            </div>
            <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-secondary/30 hover:shadow-lg">
              <h3 className="mb-2 text-sm font-black uppercase tracking-widest text-secondary">Status</h3>
              <p className="text-lg font-bold text-foreground">{status}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
