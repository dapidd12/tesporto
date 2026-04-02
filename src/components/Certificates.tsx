import React from 'react';
import { motion } from 'motion/react';
import { CV_DATA } from '../data';
import { FileText, ExternalLink } from 'lucide-react';

export default function Certificates() {
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
          {CV_DATA.certificates.map((cert, i) => {
            const isPrimary = i % 2 === 0;
            const colorClass = isPrimary ? 'primary' : 'secondary';
            
            return (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group flex flex-col justify-between rounded-[2rem] border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-${colorClass}/10 hover:border-${colorClass}/50`}
              >
                <div>
                  <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-${colorClass}/5 text-${colorClass} transition-all duration-500 group-hover:scale-110 group-hover:bg-${colorClass} group-hover:text-white`}>
                    <FileText size={24} />
                  </div>
                  <h3 className="mb-6 text-xl font-display font-black tracking-tight">{cert.name}</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {cert.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 hover:bg-accent hover:text-white hover:border-accent active:scale-95"
                    >
                      Sertifikat {cert.links.length > 1 ? index + 1 : ''} <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
