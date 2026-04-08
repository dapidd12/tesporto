import React from 'react';
import { motion } from 'motion/react';
import { useCollection } from '../hooks/useContent';
import { Code2, Cpu, Palette, ShieldCheck } from 'lucide-react';

export default function Skills() {
  const { data: firestoreSkills, loading } = useCollection('skills', 'category');

  if (loading) return null;

  return (
    <section id="skills" className="bg-muted/20 px-6 py-8 dark:bg-muted/5 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-[2px] w-8 bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Keahlian</span>
            <div className="h-[2px] w-8 bg-primary" />
          </div>
          <h2 className="text-4xl font-display font-black tracking-tighter md:text-6xl">Apa yang saya kuasai</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {firestoreSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card group rounded-[2rem] p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-inner">
                  {skill.type === 'programming' ? <Code2 size={28} /> : 
                   skill.type === 'cyber' ? <ShieldCheck size={28} /> :
                   skill.type === 'ai' ? <Cpu size={28} /> : <Palette size={28} />}
                </div>
                <h3 className="mb-4 text-2xl font-display font-black tracking-tight">{skill.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items?.map((item: string) => (
                    <span key={item} className="rounded-lg border border-border/50 bg-background/50 px-4 py-2 text-xs font-bold tracking-tight transition-colors hover:bg-primary hover:text-white hover:border-primary">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
