import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Code2, Shield } from 'lucide-react';

const TIMELINE = [
  {
    year: "2023 - Sekarang",
    title: "Siswa SMA",
    institution: "SMAN 1 Kemangkon",
    description: "Menempuh pendidikan menengah atas sambil aktif mengembangkan minat di bidang teknologi dan pemrograman.",
    icon: <GraduationCap size={20} />
  },
  {
    year: "2022 - Sekarang",
    title: "Self-Taught Developer",
    institution: "Otodidak & Berbagai Platform Online",
    description: "Mempelajari JavaScript, Python, dan C++ secara mandiri. Membangun berbagai proyek web dan aplikasi.",
    icon: <Code2 size={20} />
  },
  {
    year: "2023 - Sekarang",
    title: "Cyber Security Enthusiast",
    institution: "Eksplorasi Mandiri",
    description: "Mendalami dasar-dasar keamanan siber, enkripsi data (seperti pada proyek SourceLock), dan praktik keamanan web.",
    icon: <Shield size={20} />
  }
];

export default function Education() {
  return (
    <section id="education" className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-[2px] w-8 bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Perjalanan</span>
            <div className="h-[2px] w-8 bg-primary" />
          </div>
          <h2 className="text-3xl font-display font-black tracking-tighter md:text-5xl">Pendidikan & Pengalaman</h2>
        </div>

        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {TIMELINE.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl transition-transform duration-500 group-hover:scale-110 z-10">
                {item.icon}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-500 hover:border-primary/50 hover:shadow-primary/10 hover:-translate-y-1">
                <div className="flex flex-col gap-1 mb-3">
                  <span className="text-xs font-black uppercase tracking-widest text-primary">{item.year}</span>
                  <h3 className="text-xl font-display font-bold text-foreground">{item.title}</h3>
                  <span className="text-sm font-medium text-muted-foreground">{item.institution}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
