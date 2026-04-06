import React from 'react';
import { motion } from 'motion/react';
import { useProfile } from '../hooks/useContent';

export default function Marquee() {
  const { profile } = useProfile();
  const speed = profile?.marqueeSpeed || 60;
  const words = ["DAFID SABRIA GHOFUR", "KAI DEVELOPER", "PROGRAMMING", "CYBER SECURITY", "AI ENGINEER", "CREATIVE", "INNOVATION"];
  
  return (
    <div className="relative flex overflow-x-hidden border-y border-border bg-card py-8">
      <div className="animate-marquee whitespace-nowrap" style={{ animationDuration: `${speed}s` }}>
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
          animation-name: marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}
