import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Bell } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';

export default function News() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const activeNews = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((a: any) => {
          const expiresAt = a.expiresAt?.toDate();
          return !expiresAt || expiresAt > now;
        });
      setNews(activeNews);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'announcements');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="py-24 text-center text-muted-foreground">Memuat berita...</div>;
  }

  return (
    <section id="news" className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-[2px] w-8 bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Informasi</span>
            <div className="h-[2px] w-8 bg-primary" />
          </div>
          <h2 className="text-4xl font-display font-black tracking-tighter md:text-6xl">Berita & Pengumuman</h2>
        </div>

        {news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Bell size={48} className="mb-4 opacity-20" />
            <p>Belum ada berita atau pengumuman saat ini.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {news.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card flex flex-col gap-4 rounded-[2rem] p-6 shadow-lg md:p-8 transition-transform hover:-translate-y-1 duration-500"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/50 pb-4 gap-2">
                  <h3 className="text-2xl font-display font-bold text-primary">{item.title}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap bg-muted/50 px-3 py-1 rounded-full">
                    {item.createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-sm">{item.content}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
