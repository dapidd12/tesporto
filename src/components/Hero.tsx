import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { CV_DATA } from '../data';
import { ArrowDownRight } from 'lucide-react';

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 pt-12 text-center md:px-12">
      {/* Background Glows */}
      <motion.div style={{ y: y1 }} className="absolute top-1/4 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px] animate-pulse" />
      <motion.div style={{ y: y2, animationDelay: '1s' }} className="absolute bottom-1/4 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[100px] animate-pulse" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 relative"
      >
        <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-primary to-secondary opacity-10 blur-xl" />
        <img
          src={CV_DATA.profileImage}
          alt={CV_DATA.name}
          className="relative h-36 w-36 rounded-full object-cover border border-border md:h-48 md:w-48 shadow-xl"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative flex w-full overflow-hidden whitespace-nowrap py-4"
      >
        <div className="animate-marquee-hero flex shrink-0 items-center">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-8 text-5xl font-display font-black tracking-tighter md:text-8xl text-foreground">
              {CV_DATA.name.toUpperCase()} •
            </span>
          ))}
        </div>
        <div className="animate-marquee-hero flex shrink-0 items-center">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-8 text-5xl font-display font-black tracking-tighter md:text-8xl text-foreground">
              {CV_DATA.name.toUpperCase()} •
            </span>
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes marquee-hero {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .animate-marquee-hero {
          animation: marquee-hero 30s linear infinite;
        }
      `}</style>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-4 text-base font-bold uppercase tracking-[0.2em] text-muted-foreground md:text-lg"
      >
        {CV_DATA.nickname} • {CV_DATA.status}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-6 flex flex-col sm:flex-row gap-4"
      >
        <a
          href="#projects"
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-8 py-4 text-xs font-black uppercase tracking-widest text-background transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">Lihat Proyek</span>
          <ArrowDownRight className="relative z-10 transition-transform group-hover:rotate-45" size={18} />
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity group-hover:opacity-100" />
        </a>
        <a
          href="#contact"
          className="flex items-center justify-center gap-2 rounded-full border border-border bg-card/50 px-8 py-4 text-xs font-black uppercase tracking-widest text-foreground backdrop-blur-sm transition-all hover:bg-card hover:border-foreground/20 active:scale-95"
        >
          Hubungi Saya
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Scroll</span>
          <div className="h-12 w-[2px] bg-gradient-to-b from-primary to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
