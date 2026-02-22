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
      className="space-y-4 group relative"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div className="flex items-center justify-between px-6 md:px-12">
        <h2 className="text-sm md:text-base font-bold text-zinc-100 tracking-wide uppercase">
          {title}
        </h2>
      </div>
      
      <div className="relative">
        {/* Scroll Buttons */}
        <button 
          onClick={() => scroll('left')}
          className={cn(
            "absolute left-0 top-0 bottom-0 z-40 bg-black/40 px-2 flex items-center justify-center transition-all duration-300 hover:bg-black/60",
            showArrows ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={rowRef}
          className="flex gap-2 md:gap-3 overflow-x-auto px-6 md:px-12 hide-scrollbar scroll-smooth snap-x snap-mandatory py-4"
        >
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex-none w-[160px] md:w-[260px] aspect-[16/9] relative rounded-sm group/item cursor-pointer transition-all duration-200 ease-out hover:scale-[1.03] hover:z-50 shadow-sm hover:shadow-lg snap-start bg-zinc-900 overflow-hidden"
            >
              {/* Main Card Image */}
              <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Progress Bar */}
              {movie.progress !== undefined && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-800 z-10">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${movie.progress}%` }} 
                  />
                </div>
              )}
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 z-20">
                <h3 className="text-white font-bold text-[10px] md:text-xs line-clamp-1 uppercase tracking-tight">
                  {movie.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className={cn(
            "absolute right-0 top-0 bottom-0 z-40 bg-black/40 px-2 flex items-center justify-center transition-all duration-300 hover:bg-black/60",
            showArrows ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
}
