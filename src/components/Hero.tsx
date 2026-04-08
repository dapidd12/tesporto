import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useProfile } from '../hooks/useContent';
import { ArrowDownRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const { profile, loading } = useProfile();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 250]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = profile?.roles || [];
  const name = profile?.name || '';
  const profileImage = profile?.profileImage || '';

  useEffect(() => {
    if (loading || !roles.length) return;
    const typeSpeed = isDeleting ? 40 : 80;
    const currentRole = roles[currentRoleIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting && currentText === currentRole) {
        setTimeout(() => setIsDeleting(true), 2000);
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
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-12 text-center md:px-12">
      {/* Background Glows */}
      <motion.div style={{ y: y1 }} className="absolute top-1/4 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
      <motion.div style={{ y: y2, animationDelay: '1s' }} className="absolute bottom-1/4 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-secondary/20 blur-[120px] animate-pulse" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 relative group"
      >
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent opacity-30 blur-2xl transition-opacity duration-700 group-hover:opacity-60 animate-pulse" />
        <div className="relative h-44 w-44 overflow-hidden rounded-full border-4 border-background shadow-2xl transition-transform duration-700 group-hover:scale-105 md:h-64 md:w-64">
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center text-5xl font-bold text-muted-foreground">
              {name ? name[0].toUpperCase() : ''}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex w-full overflow-hidden whitespace-nowrap py-2"
      >
        <div className="animate-marquee-hero flex shrink-0 items-center">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-8 text-6xl font-display font-black tracking-tighter md:text-9xl text-foreground drop-shadow-sm">
              {name.toUpperCase()} <Sparkles className="inline-block text-primary mx-4" size={48} />
            </span>
          ))}
        </div>
        <div className="animate-marquee-hero flex shrink-0 items-center">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-8 text-6xl font-display font-black tracking-tighter md:text-9xl text-foreground drop-shadow-sm">
              {name.toUpperCase()} <Sparkles className="inline-block text-primary mx-4" size={48} />
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
          animation: marquee-hero 40s linear infinite;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-6 flex h-10 items-center justify-center text-lg font-bold uppercase tracking-[0.25em] text-muted-foreground md:text-xl"
      >
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{currentText}</span>
        <span className="ml-1 inline-block h-6 w-[3px] animate-pulse bg-primary md:h-7" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-10 flex flex-col sm:flex-row gap-5"
      >
        <Link
          to="/projects"
          className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground px-10 py-5 text-sm font-black uppercase tracking-widest text-background transition-all hover:scale-105 active:scale-95 shadow-xl shadow-foreground/10"
        >
          <span className="relative z-10">Lihat Proyek</span>
          <ArrowDownRight className="relative z-10 transition-transform group-hover:rotate-45" size={20} />
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>
        <Link
          to="/contact"
          className="glass flex items-center justify-center gap-2 rounded-full px-10 py-5 text-sm font-black uppercase tracking-widest text-foreground transition-all hover:bg-foreground/5 active:scale-95"
        >
          Hubungi Saya
        </Link>
      </motion.div>

      {(profile?.intro || profile?.vision || profile?.mission) && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-24 grid max-w-5xl grid-cols-1 gap-6 text-left md:grid-cols-3"
        >
          {profile?.intro && (
            <div className="glass-card rounded-[2rem] p-8 transition-transform hover:-translate-y-2 duration-500">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" /> Pengenalan
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{profile.intro}</p>
            </div>
          )}
          {profile?.vision && (
            <div className="glass-card rounded-[2rem] p-8 transition-transform hover:-translate-y-2 duration-500">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-secondary">
                <span className="h-2 w-2 rounded-full bg-secondary" /> Visi
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{profile.vision}</p>
            </div>
          )}
          {profile?.mission && (
            <div className="glass-card rounded-[2rem] p-8 transition-transform hover:-translate-y-2 duration-500">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent">
                <span className="h-2 w-2 rounded-full bg-accent" /> Misi
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{profile.mission}</p>
            </div>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
          <div className="h-16 w-[2px] bg-gradient-to-b from-primary via-secondary to-transparent opacity-50" />
        </div>
      </motion.div>
    </section>
  );
}
