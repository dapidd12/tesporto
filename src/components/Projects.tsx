import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CV_DATA } from '../data';
import { ExternalLink, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface ProjectsProps {
  limit?: number;
  hideFilter?: boolean;
}

export default function Projects({ limit, hideFilter = false }: ProjectsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Extract unique tags from all projects
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => {
      if (p.tags) p.tags.forEach((t: string) => tags.add(t));
    });
    return ['All', ...Array.from(tags)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects;
    
    if (activeTag !== 'All') {
      filtered = filtered.filter(p => p.tags?.includes(activeTag));
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }
    
    if (limit) {
      return filtered.slice(0, limit);
    }
    return filtered;
  }, [searchQuery, activeTag, limit, projects]);

  if (loading) {
    return <div className="py-24 text-center text-muted-foreground">Memuat proyek...</div>;
  }

  return (
    <section id="projects" className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <div className="mb-4 flex items-center justify-center gap-4 md:justify-start">
              <div className="h-[2px] w-10 bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Portofolio</span>
            </div>
            <h2 className="text-4xl font-display font-black tracking-tighter md:text-6xl">Proyek Terpilih</h2>
          </div>
        </div>

        {!hideFilter && (
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Tags Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter size={16} className="mr-2 text-muted-foreground" />
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-bold transition-all",
                    activeTag === tag 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Cari proyek..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border/50 bg-card/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}

        <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                layout
                key={project.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative flex flex-col gap-6"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-border bg-muted/20 dark:bg-muted/5 transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/20">
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 backdrop-blur-[2px] z-10">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[10px] font-black uppercase tracking-widest text-background transition-transform hover:scale-110 active:scale-95"
                    >
                      Kunjungi Situs <ExternalLink size={14} />
                    </a>
                  </div>
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.name} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-8xl font-display font-black text-foreground/5 transition-transform duration-700 group-hover:scale-110 group-hover:text-primary/10">
                      {project.name[0]}
                    </div>
                  )}
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
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
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
          </AnimatePresence>
          {filteredProjects.length === 0 && (
            <div className="col-span-1 py-12 text-center md:col-span-2">
              <p className="text-lg text-muted-foreground">Tidak ada proyek yang sesuai dengan pencarian Anda.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
