import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ImageIcon } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';

export default function Gallery() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const galleryData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGallery(galleryData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'gallery');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="py-24 text-center text-muted-foreground">Memuat galeri...</div>;
  }

  return (
    <section id="gallery" className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-[2px] w-8 bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Momen</span>
            <div className="h-[2px] w-8 bg-primary" />
          </div>
          <h2 className="text-4xl font-display font-black tracking-tighter md:text-6xl">Galeri</h2>
        </div>

        {gallery.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <ImageIcon size={48} className="mb-4 opacity-20" />
            <p>Belum ada foto di galeri.</p>
          </div>
        ) : (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {gallery.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative mb-6 overflow-hidden rounded-2xl bg-muted"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-muted text-muted-foreground">
                    <ImageIcon size={48} className="opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 backdrop-blur-[2px]" />
                <div className="absolute bottom-0 left-0 w-full translate-y-4 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="glass-card rounded-xl p-4 border-white/10 bg-white/10 dark:bg-black/20">
                    <h3 className="text-lg font-bold text-white drop-shadow-md">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
