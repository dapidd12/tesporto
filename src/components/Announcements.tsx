import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Bell, X } from 'lucide-react';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const active = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((a: any) => {
          const expiresAt = a.expiresAt?.toDate();
          return expiresAt && expiresAt > now;
        });
      setAnnouncements(active);
    }, (error) => {
      console.error("Error fetching announcements: ", error);
    });

    return () => unsubscribe();
  }, []);

  if (announcements.length === 0 || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="relative z-50 w-full bg-primary px-4 py-3 text-primary-foreground shadow-lg"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Bell size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold">{announcements[0].title}</span>
              <span className="text-xs opacity-90 line-clamp-1">{announcements[0].content}</span>
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/20 active:scale-95"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
