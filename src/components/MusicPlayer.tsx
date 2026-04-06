import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Play, Pause, Music, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function MusicPlayer() {
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch playlist
  useEffect(() => {
    const q = query(collection(db, 'playlist'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const songs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlaylist(songs);
    });
    return () => unsubscribe();
  }, []);

  // Interaction listener for autoplay
  useEffect(() => {
    const handleInteraction = async () => {
      if (!hasInteracted && playlist.length > 0 && audioRef.current) {
        try {
          await audioRef.current.play();
          setHasInteracted(true);
          setIsPlaying(true);
        } catch (e) {
          console.log("Autoplay prevented:", e);
          // Don't set hasInteracted to true if it failed, so next interaction can try again
        }
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted, playlist]);

  // Audio control
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.log("Play prevented:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex, playlist]);

  const handleEnded = () => {
    if (playlist.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
      setIsPlaying(true);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  if (playlist.length === 0) return null;

  const currentSong = playlist[currentIndex];

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      <audio
        ref={audioRef}
        src={currentSong?.audioUrl || undefined}
        onEnded={handleEnded}
        muted={isMuted}
      />
      
      <div className="flex items-center gap-3">
        {/* Compact Toggle Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border border-border/50 bg-background/80 shadow-lg backdrop-blur-xl transition-all duration-500",
            isPlaying ? "text-primary border-primary/30" : "text-muted-foreground"
          )}
        >
          {isPlaying ? (
            <div className="flex items-center gap-[2px]">
              <motion.div
                animate={{ height: [8, 16, 8] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0 }}
                className="w-[3px] bg-primary rounded-full"
              />
              <motion.div
                animate={{ height: [12, 20, 12] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                className="w-[3px] bg-primary rounded-full"
              />
              <motion.div
                animate={{ height: [10, 18, 10] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                className="w-[3px] bg-primary rounded-full"
              />
            </div>
          ) : (
            <Music size={20} />
          )}
        </motion.button>

        {/* Player Controls */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ x: -20, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -20, opacity: 0, scale: 0.95 }}
              className="flex items-center gap-4 rounded-full border border-border/50 bg-background/80 p-2 pr-6 shadow-xl backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>
              </div>

              <div className="flex flex-col min-w-[120px] max-w-[180px]">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary truncate">
                  Now Playing
                </span>
                <span className="text-xs font-bold text-foreground truncate">
                  {currentSong?.title}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground truncate">
                  {currentSong?.artist}
                </span>
              </div>

              <button
                onClick={toggleMute}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
