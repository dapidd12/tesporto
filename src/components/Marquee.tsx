import React from 'react';
import { motion } from 'motion/react';

export default function Marquee() {
  const words = ["DAFID SABRIA GHOFUR", "KAI DEVELOPER", "PROGRAMMING", "CYBER SECURITY", "AI ENGINEER", "CREATIVE", "INNOVATION"];
  
  return (
    <div className="relative flex overflow-x-hidden border-y border-border bg-card py-8">
      <div className="animate-marquee whitespace-nowrap">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="mx-12 text-5xl font-display font-black italic tracking-tighter text-foreground/10 md:text-8xl transition-colors hover:text-primary/40 cursor-default">
            {words.join(" • ")} •
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
