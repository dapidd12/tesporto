import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Bell, X } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';

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
      handleFirestoreError(error, OperationType.GET, 'announcements');
    });

    return () => unsubscribe();
  }, []);

  if (announcements.length === 0 || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        className="fixed right-4 top-24 z-50 max-w-sm rounded-2xl border border-border bg-card p-4 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bell size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">{announcements[0].title}</span>
            <span className="text-xs text-muted-foreground line-clamp-2">{announcements[0].content}</span>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
