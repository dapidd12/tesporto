import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useProfile } from '../hooks/useContent';
import { ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const { profile, loading } = useProfile();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = profile?.roles || [];

  const name = profile?.name || '';
  const profileImage = profile?.profileImage || '';

  useEffect(() => {
    if (loading || !roles.length) return;
    const typeSpeed = isDeleting ? 50 : 100;
    const currentRole = roles[currentRoleIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting && currentText === currentRole) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        setCurrentText(
          currentRole.substring(0, currentText.length + (isDeleting ? -1 : 1))
        );
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentRoleIndex, roles, loading]);

  if (loading) return <div className="min-h-[85vh] flex items-center justify-center">Loading...</div>;

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 pt-12 text-center md:px-12">
      {/* Background Glows */}
      <motion.div style={{ y: y1 }} className="absolute top-1/4 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px] animate-pulse" />
      <motion.div style={{ y: y2, animationDelay: '1s' }} className="absolute bottom-1/4 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[100px] animate-pulse" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 relative group"
      >
        <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-primary to-secondary opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40" />
        <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-border shadow-2xl transition-transform duration-500 group-hover:scale-105 md:h-56 md:w-56">
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground">
              {name ? name[0].toUpperCase() : ''}
            </div>
          )}
        </div>
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
              {name.toUpperCase()} •
            </span>
          ))}
        </div>
        <div className="animate-marquee-hero flex shrink-0 items-center">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-8 text-5xl font-display font-black tracking-tighter md:text-8xl text-foreground">
              {name.toUpperCase()} •
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

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-4 flex h-8 items-center justify-center text-base font-bold uppercase tracking-[0.2em] text-muted-foreground md:text-lg"
      >
        <span>{currentText}</span>
        <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-primary md:h-6" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-8 flex flex-col sm:flex-row gap-4"
      >
        <Link
          to="/projects"
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-8 py-4 text-xs font-black uppercase tracking-widest text-background transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">Lihat Proyek</span>
          <ArrowDownRight className="relative z-10 transition-transform group-hover:rotate-45" size={18} />
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
        <Link
          to="/contact"
          className="flex items-center justify-center gap-2 rounded-full border border-border bg-card/50 px-8 py-4 text-xs font-black uppercase tracking-widest text-foreground backdrop-blur-sm transition-all hover:bg-card hover:border-foreground/20 active:scale-95"
        >
          Hubungi Saya
        </Link>
      </motion.div>

      {(profile?.intro || profile?.vision || profile?.mission) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 grid max-w-4xl grid-cols-1 gap-8 text-left md:grid-cols-3"
        >
          {profile?.intro && (
            <div className="rounded-3xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-primary">Pengenalan</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{profile.intro}</p>
            </div>
          )}
          {profile?.vision && (
            <div className="rounded-3xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-primary">Visi</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{profile.vision}</p>
            </div>
          )}
          {profile?.mission && (
            <div className="rounded-3xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-primary">Misi</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{profile.mission}</p>
            </div>
          )}
        </motion.div>
      )}

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
