"use client";

import { useRef, useState } from 'react';
import { Movie } from '@/lib/mock-data';
import { ChevronLeft, ChevronRight, Play, Plus, ThumbsUp } from 'lucide-react';
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
      className="space-y-4 group relative"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div className="max-w-screen-2xl mx-auto px-8 md:px-20">
        <h2 className="text-sm md:text-lg font-black text-white tracking-tight uppercase">
          {title}
        </h2>
      </div>
      
      <div className="relative">
        {/* Scroll Buttons */}
        <button 
          onClick={() => scroll('left')}
          className={cn(
            "absolute left-0 top-0 bottom-0 z-40 bg-black/80 px-4 md:px-8 flex items-center justify-center transition-all duration-300 hover:bg-black/100",
            showArrows ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-12 h-12 text-white" />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={rowRef}
          className="flex gap-2 md:gap-4 overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory py-10 -my-10"
        >
          {/* Spacer to align first item with header */}
          <div className="flex-none w-8 md:w-20" />
          
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex-none w-[160px] md:w-[320px] aspect-[16/9] relative rounded-md group/item cursor-pointer movie-card-transition hover:scale-105 hover:z-50 origin-bottom shadow-2xl snap-start bg-zinc-900 overflow-hidden"
            >
              <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                className="w-full h-full object-cover contrast-[1.2] saturate-[1.1]"
                loading="lazy"
              />

              {movie.progress !== undefined && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
                  <div 
                    className="h-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" 
                    style={{ width: `${movie.progress}%` }} 
                  />
                </div>
              )}
              
              {/* High Contrast Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
                      <Play className="w-4 h-4 text-black fill-current" />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-400 hover:border-white transition-colors flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-400 hover:border-white transition-colors flex items-center justify-center ml-auto">
                      <ThumbsUp className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#46d369] font-black text-[10px] md:text-xs">98% Match</span>
                      <span className="text-zinc-400 font-bold text-[8px] md:text-[10px] uppercase border border-zinc-700 px-1">HD</span>
                    </div>
                    <h3 className="text-white font-black text-xs md:text-sm line-clamp-1 uppercase tracking-tighter shadow-black drop-shadow-md">
                      {movie.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Spacer for end scroll */}
          <div className="flex-none w-8 md:w-20" />
        </div>

        <button 
          onClick={() => scroll('right')}
          className={cn(
            "absolute right-0 top-0 bottom-0 z-40 bg-black/80 px-4 md:px-8 flex items-center justify-center transition-all duration-300 hover:bg-black/100",
            showArrows ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-12 h-12 text-white" />
        </button>
      </div>
    </div>
  );
}
