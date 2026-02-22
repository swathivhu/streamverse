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
      className="space-y-3 group relative"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div className="max-w-screen-2xl mx-auto px-8 md:px-20">
        <h2 className="text-xs md:text-sm font-bold text-zinc-300 tracking-widest uppercase">
          {title}
        </h2>
      </div>
      
      <div className="relative">
        {/* Scroll Buttons - Perfectly aligned with viewport padding */}
        <button 
          onClick={() => scroll('left')}
          className={cn(
            "absolute left-0 top-0 bottom-0 z-40 bg-black/60 px-6 md:px-10 flex items-center justify-center transition-all duration-300 hover:bg-black/80",
            showArrows ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-10 h-10 text-white" />
        </button>

        {/* Scrollable Container - Internal padding matches header rhythm */}
        <div 
          ref={rowRef}
          className="flex gap-2 md:gap-3 overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory py-10 -my-10"
        >
          {/* Spacer to align first item with header */}
          <div className="flex-none w-8 md:w-20" />
          
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex-none w-[160px] md:w-[300px] aspect-[16/9] relative rounded-sm group/item cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:z-50 origin-bottom shadow-sm hover:shadow-2xl snap-start bg-zinc-900 overflow-hidden"
            >
              <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {movie.progress !== undefined && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-10">
                  <div 
                    className="h-full bg-primary/80" 
                    style={{ width: `${movie.progress}%` }} 
                  />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
                <h3 className="text-white font-bold text-[10px] md:text-xs line-clamp-1 uppercase tracking-widest mb-1">
                  {movie.title}
                </h3>
              </div>
            </div>
          ))}

          {/* Spacer for end scroll */}
          <div className="flex-none w-8 md:w-20" />
        </div>

        <button 
          onClick={() => scroll('right')}
          className={cn(
            "absolute right-0 top-0 bottom-0 z-40 bg-black/60 px-6 md:px-10 flex items-center justify-center transition-all duration-300 hover:bg-black/80",
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
