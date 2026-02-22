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
      className="space-y-2 py-4 group relative"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className="text-lg md:text-xl font-bold px-6 md:px-12 text-zinc-200 transition-colors hover:text-white cursor-pointer inline-flex items-center gap-2">
        {title}
        <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      </h2>
      
      <div className="relative">
        {/* Scroll Buttons */}
        <button 
          onClick={() => scroll('left')}
          className={cn(
            "absolute left-0 top-0 bottom-0 z-40 bg-black/60 px-2 md:px-4 flex items-center justify-center transition-all duration-300 hover:bg-black/80",
            showArrows ? "opacity-100" : "opacity-0"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div 
          ref={rowRef}
          className="flex gap-2 md:gap-3 overflow-x-auto px-6 md:px-12 hide-scrollbar scroll-smooth snap-x snap-mandatory py-2"
        >
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex-none w-[160px] md:w-[280px] aspect-[16/9] relative rounded-md group/item cursor-pointer transform transition-transform duration-300 hover:scale-[1.03] snap-start bg-zinc-900 border border-white/5 overflow-hidden"
            >
              {/* Main Card Image */}
              <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                className="w-full h-full object-cover rounded-md"
                loading="lazy"
              />
              
              {/* Minimal Title Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <h3 className="text-white font-semibold text-xs md:text-sm line-clamp-1 drop-shadow-md">
                  {movie.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className={cn(
            "absolute right-0 top-0 bottom-0 z-40 bg-black/60 px-2 md:px-4 flex items-center justify-center transition-all duration-300 hover:bg-black/80",
            showArrows ? "opacity-100" : "opacity-0"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
}
