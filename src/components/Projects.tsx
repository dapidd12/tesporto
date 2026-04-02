import React from 'react';
import { motion } from 'motion/react';
import { CV_DATA } from '../data';
import { ExternalLink, Github } from 'lucide-react';

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-8 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-[2px] w-10 bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Portofolio</span>
          </div>
          <h2 className="text-4xl font-display font-black tracking-tighter md:text-7xl">Proyek Terpilih</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {CV_DATA.projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative flex flex-col gap-6"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-border bg-muted/20 dark:bg-muted/5 transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/20">
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 backdrop-blur-[2px]">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[10px] font-black uppercase tracking-widest text-background transition-transform hover:scale-110 active:scale-95"
                  >
                    Kunjungi Situs <ExternalLink size={14} />
                  </a>
                </div>
                <div className="flex h-full items-center justify-center text-8xl font-display font-black text-foreground/5 transition-transform duration-700 group-hover:scale-110 group-hover:text-primary/10">
                  {project.name[0]}
                </div>
              </div>
              
              <div className="space-y-4 px-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-display font-black tracking-tighter">{project.name}</h3>
                  <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Project
                  </span>
                </div>
                <p className="text-base font-medium leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex gap-4 pt-1">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary transition-all hover:gap-4"
                  >
                    View Live <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
