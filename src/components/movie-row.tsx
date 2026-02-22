"use client";

import { useRef, useState } from 'react';
import { Movie } from '@/lib/mock-data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="space-y-6 py-8 group relative"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className="text-xl md:text-2xl font-black px-6 md:px-12 text-zinc-100 tracking-tight transition-colors hover:text-white cursor-pointer inline-flex items-center gap-2 uppercase italic">
        {title}
        <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      </h2>
      
      <div className="relative">
        {/* Scroll Buttons */}
        <button 
          onClick={() => scroll('left')}
          className={cn(
            "absolute left-0 top-0 bottom-0 z-40 bg-black/60 px-2 md:px-4 flex items-center justify-center transition-all duration-300 hover:bg-black/80 hover:scale-110 active:scale-95",
            showArrows ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-10 h-10 text-white" />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={rowRef}
          className="flex gap-3 md:gap-4 overflow-x-auto px-6 md:px-12 hide-scrollbar scroll-smooth snap-x snap-mandatory py-10 -my-10"
        >
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex-none w-[180px] md:w-[300px] aspect-[16/9] relative rounded-md group/item cursor-pointer transition-all duration-300 ease-out hover:scale-[1.06] hover:-translate-y-2 hover:z-50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] snap-start bg-zinc-900/50 border border-white/10 overflow-hidden"
            >
              {/* Main Card Image */}
              <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                className="w-full h-full object-cover rounded-md"
                loading="lazy"
              />

              {/* Minimal Progress Bar (Continue Watching) */}
              {movie.progress !== undefined && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-zinc-800 z-10">
                  <div 
                    className="h-full bg-primary shadow-[0_0_8px_rgba(184,29,36,0.8)]" 
                    style={{ width: `${movie.progress}%` }} 
                  />
                </div>
              )}
              
              {/* Minimal Title Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent backdrop-blur-[2px] opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20 border border-white/5 rounded-md">
                <div className="flex flex-col gap-1 translate-y-2 group-hover/item:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-black text-xs md:text-sm line-clamp-1 drop-shadow-lg uppercase tracking-tight italic">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-green-500 uppercase tracking-widest">
                    <span>98% Match</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-300">{movie.genre}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className={cn(
            "absolute right-0 top-0 bottom-0 z-40 bg-black/60 px-2 md:px-4 flex items-center justify-center transition-all duration-300 hover:bg-black/80 hover:scale-110 active:scale-95",
            showArrows ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-10 h-10 text-white" />
        </button>
      </div>
    </div>
  );
}
