import React from 'react';
import { motion } from 'motion/react';
import { CV_DATA } from '../data';
import { Code2, Cpu, Palette, ShieldCheck } from 'lucide-react';

export default function Skills() {
  const iconMap: Record<string, any> = {
    "Bahasa Pemrograman": <Code2 />,
    "Cyber Security": <ShieldCheck />,
    "AI Engineer": <Cpu />,
    "Graphic Designer": <Palette />,
  };

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
          {/* Programming Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group rounded-[2rem] border border-border bg-card p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/5 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
              <Code2 size={28} />
            </div>
            <h3 className="mb-4 text-2xl font-display font-black tracking-tight">Pemrograman</h3>
            <div className="flex flex-wrap gap-2">
              {CV_DATA.skills.programming.map((skill) => (
                <span key={skill} className="rounded-lg border border-border bg-muted/50 px-4 py-2 text-xs font-bold tracking-tight transition-colors hover:bg-primary hover:text-white">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Other Skills */}
          {CV_DATA.skills.others.map((skill, i) => {
            const isCyber = skill.toLowerCase().includes('cyber');
            const isAI = skill.toLowerCase().includes('ai');
            const colorClass = isCyber ? 'secondary' : isAI ? 'primary' : 'secondary'; // Using primary/secondary for a more cohesive look
            
            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group rounded-[2rem] border border-border bg-card p-8 transition-all duration-500 hover:border-${colorClass}/50 hover:shadow-2xl hover:shadow-${colorClass}/10 hover:-translate-y-2`}
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-${colorClass}/5 text-${colorClass} transition-all duration-500 group-hover:scale-110 group-hover:bg-${colorClass} group-hover:text-white`}>
                  {isCyber ? <ShieldCheck size={28} /> : 
                   isAI ? <Cpu size={28} /> : <Palette size={28} />}
                </div>
                <h3 className="mb-4 text-2xl font-display font-black tracking-tight">{skill}</h3>
                <p className="text-sm font-medium text-muted-foreground">Tingkat dasar dan terus berkembang secara profesional.</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
