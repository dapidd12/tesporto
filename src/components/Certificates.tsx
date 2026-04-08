import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, ExternalLink } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';

export default function Certificates() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'certificates'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const certsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCertificates(certsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'certificates');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="py-24 text-center text-muted-foreground">Memuat sertifikat...</div>;
  }

  return (
    <section id="certificates" className="bg-muted/20 px-6 py-8 dark:bg-muted/5 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-[2px] w-8 bg-secondary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Sertifikasi</span>
            <div className="h-[2px] w-8 bg-secondary" />
          </div>
          <h2 className="text-4xl font-display font-black tracking-tighter md:text-6xl">Pencapaian & Kursus</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => {
            const isPrimary = i % 2 === 0;
            const colorClass = isPrimary ? 'primary' : 'secondary';
            
            return (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card group flex flex-col justify-between overflow-hidden rounded-[2rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-${colorClass}/10 hover:border-${colorClass}/50`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border/50 bg-muted/20">
                  {/* PDF Preview using iframe */}
                  <div className="absolute inset-0 z-0 opacity-50 transition-opacity duration-500 group-hover:opacity-100">
                    {cert.url && (
                      <iframe
                        src={`${cert.url}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="h-[150%] w-[150%] origin-top-left scale-[0.67] pointer-events-none"
                        title={`${cert.name} Preview`}
                        tabIndex={-1}
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 to-transparent" />
                  
                  <div className="absolute left-6 top-6 z-20">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${colorClass}/10 text-${colorClass} backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-${colorClass} group-hover:text-white shadow-inner`}>
                      <FileText size={24} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-6">
                  <div>
                    <h3 className="text-xl font-display font-black tracking-tight">{cert.name}</h3>
                    <span className={`mt-2 inline-block rounded-full bg-${colorClass}/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-${colorClass}`}>
                      {cert.tag}
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95"
                    >
                      Lihat Sertifikat <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
