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

          <div className="grid grid-cols-1 gap-6 pt-8 md:grid-cols-2">
            <div className="glass-card group rounded-[2rem] p-8 transition-all hover:-translate-y-2 duration-500">
              <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" /> Domisili
              </h3>
              <p className="text-xl font-display font-bold text-foreground">{location}</p>
            </div>
            <div className="glass-card group rounded-[2rem] p-8 transition-all hover:-translate-y-2 duration-500">
              <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" /> Status
              </h3>
              <p className="text-xl font-display font-bold text-foreground">{status}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
