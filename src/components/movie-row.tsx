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
      className="space-y-2 group relative"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div className="flex items-center justify-between px-6 md:px-16">
        <h2 className="text-sm md:text-lg font-bold text-zinc-200 tracking-tight uppercase">
          {title}
        </h2>
      </div>
      
      <div className="relative">
        {/* Scroll Buttons */}
        <button 
          onClick={() => scroll('left')}
          className={cn(
            "absolute left-0 top-0 bottom-0 z-40 bg-black/60 px-4 flex items-center justify-center transition-all duration-300 hover:bg-black/80",
            showArrows ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-10 h-10 text-white" />
        </button>

        {/* Scrollable Container with extra padding to accommodate upward scale */}
        <div 
          ref={rowRef}
          className="flex gap-2 md:gap-3 overflow-x-auto px-6 md:px-16 hide-scrollbar scroll-smooth snap-x snap-mandatory py-10 -my-10"
        >
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex-none w-[160px] md:w-[300px] aspect-[16/9] relative rounded-sm group/item cursor-pointer transition-all duration-250 ease-out hover:scale-105 hover:z-50 origin-bottom shadow-sm hover:shadow-2xl snap-start bg-zinc-900 overflow-hidden"
            >
              {/* Main Card Image */}
              <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Progress Bar (if applicable) */}
              {movie.progress !== undefined && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${movie.progress}%` }} 
                  />
                </div>
              )}
              
              {/* Refined Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-250 flex flex-col justify-end p-4 z-20">
                <h3 className="text-white font-bold text-xs md:text-sm line-clamp-1 uppercase tracking-wider mb-1">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  <span className="text-green-500">98% Match</span>
                  <span>{movie.genre}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className={cn(
            "absolute right-0 top-0 bottom-0 z-40 bg-black/60 px-4 flex items-center justify-center transition-all duration-300 hover:bg-black/80",
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
