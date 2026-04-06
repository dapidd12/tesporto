import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCollection } from '../hooks/useContent';

export default function Testimonials() {
  const { data: testimonials, loading } = useCollection('testimonials');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    if (testimonials.length === 0) return;
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = testimonials.length - 1;
      if (nextIndex >= testimonials.length) nextIndex = 0;
      return nextIndex;
    });
  };

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, testimonials.length]);

  if (loading) return null;
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative overflow-hidden bg-background px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-[2px] w-10 bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Testimoni</span>
            <div className="h-[2px] w-10 bg-primary" />
          </div>
          <h2 className="text-4xl font-display font-black tracking-tighter md:text-6xl">Apa Kata Mereka</h2>
        </div>

        <div className="relative mx-auto h-[400px] max-w-4xl md:h-[300px]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 flex w-full items-center justify-center"
            >
              <div className="group relative w-full max-w-3xl rounded-[2.5rem] border border-border/50 bg-card/50 p-8 shadow-xl shadow-black/5 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-primary/10 dark:shadow-black/20 md:p-12">
                <Quote className="absolute -top-6 left-8 h-12 w-12 text-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/40 md:-left-6 md:top-8" />
                
                <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-muted/50 p-1 transition-all duration-500 group-hover:border-primary/50 md:h-32 md:w-32">
                    {testimonials[currentIndex]?.image ? (
                      <img 
                        src={testimonials[currentIndex]?.image} 
                        alt={testimonials[currentIndex]?.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                        {testimonials[currentIndex]?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col text-center md:text-left">
                    <p className="mb-6 text-lg font-medium leading-relaxed text-foreground/90 md:text-xl">
                      "{testimonials[currentIndex]?.text}"
                    </p>
                    <div>
                      <h4 className="text-xl font-display font-black tracking-tight text-foreground">
                        {testimonials[currentIndex]?.name}
                      </h4>
                      <p className="text-sm font-bold uppercase tracking-widest text-primary">
                        {testimonials[currentIndex]?.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 gap-4 md:bottom-1/2 md:left-auto md:right-0 md:w-full md:translate-x-0 md:translate-y-1/2 md:justify-between md:px-4 z-10">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border/50 bg-background/80 text-foreground shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:border-primary/50 hover:text-primary active:scale-95 md:-ml-6"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border/50 bg-background/80 text-foreground shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:border-primary/50 hover:text-primary active:scale-95 md:-mr-6"
              onClick={() => paginate(1)}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        {/* Indicators */}
        <div className="mt-16 flex justify-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                index === currentIndex 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-primary/20 hover:bg-primary/50"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
