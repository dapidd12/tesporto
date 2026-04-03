import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Play, Pause, SkipForward, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
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
    const handleInteraction = () => {
      if (!hasInteracted && playlist.length > 0) {
        setHasInteracted(true);
        setIsPlaying(true);
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted, playlist]);

  // Audio control
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.log("Autoplay prevented:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex, playlist]);

  const handleEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  if (playlist.length === 0) return null;

  const currentSong = playlist[currentIndex];

  return (
    <div className="fixed bottom-4 left-4 z-50 md:bottom-6 md:left-6">
      <audio
        ref={audioRef}
        src={currentSong?.audioUrl}
        onEnded={handleEnded}
      />
      
      <motion.div 
        className="flex items-center gap-3 rounded-full border border-border bg-card/80 p-2 shadow-lg backdrop-blur-md cursor-pointer max-w-[calc(100vw-2rem)] md:max-w-md"
        onClick={() => setIsExpanded(!isExpanded)}
        layout
      >
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Music size={18} className={isPlaying ? "animate-spin-slow" : ""} />
          {isPlaying && (
            <span className="absolute right-0 top-0 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
            </span>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center gap-4 overflow-hidden pr-4"
            >
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-xs font-bold">{currentSong?.title || 'Unknown Title'}</span>
                <span className="text-[10px] text-muted-foreground">{currentSong?.artist || 'Unknown Artist'}</span>
              </div>
              
              <div className="flex items-center gap-2 border-l border-border/50 pl-4">
                <button 
                  onClick={togglePlay}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
                <button 
                  onClick={handleNext}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <SkipForward size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
