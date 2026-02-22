"use client";

import { useRef, useState } from 'react';
import { Movie } from '@/lib/mock-data';
import { ChevronLeft, ChevronRight, Play, Plus, Info } from 'lucide-react';
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
      className="space-y-4 py-8 group relative"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className="text-xl md:text-2xl font-bold px-6 md:px-12 text-zinc-100 tracking-tight transition-colors hover:text-white cursor-pointer inline-flex items-center gap-2 group/title">
        {title}
        <ChevronRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all duration-300" />
      </h2>
      
      <div className="relative overflow-visible">
        {/* Scroll Buttons */}
        <button 
          onClick={() => scroll('left')}
          className={cn(
            "absolute left-0 top-0 bottom-0 z-40 bg-black/70 px-4 flex items-center justify-center transition-all duration-300 hover:bg-black/90",
            showArrows ? "opacity-100" : "opacity-0"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-10 h-10 text-white" />
        </button>

        <div 
          ref={rowRef}
          className="flex gap-2 md:gap-4 overflow-x-auto px-6 md:px-12 hide-scrollbar scroll-smooth snap-x snap-mandatory py-4"
        >
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex-none w-[180px] md:w-[300px] aspect-[16/9] relative rounded-md overflow-visible group/item cursor-pointer transform transition-all duration-300 hover:scale-110 hover:z-50 snap-start"
            >
              <div className="w-full h-full rounded-md overflow-hidden bg-zinc-900 shadow-lg border border-white/5">
                <img 
                  src={movie.thumbnail} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Detailed Card Overlay on Hover */}
              <div className="absolute top-0 left-0 w-full h-full bg-zinc-950 opacity-0 group-hover/item:opacity-100 transition-all duration-300 rounded-md shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col pointer-events-none group-hover/item:pointer-events-auto z-50 overflow-hidden border border-white/10">
                <img 
                  src={movie.thumbnail} 
                  alt={movie.title} 
                  className="w-full aspect-[16/9] object-cover rounded-t-md"
                />
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:bg-zinc-200 transition-all active:scale-90 pointer-events-auto shadow-lg">
                        <Play className="w-5 h-5 fill-current" />
                      </button>
                      <button className="w-10 h-10 border-2 border-zinc-600 rounded-full flex items-center justify-center text-white hover:border-white transition-all active:scale-90 pointer-events-auto">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <button className="w-10 h-10 border-2 border-zinc-600 rounded-full flex items-center justify-center text-white hover:border-white transition-all active:scale-90 pointer-events-auto">
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-bold text-sm truncate">{movie.title}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      <span className="text-green-500">New for You</span>
                      <span className="border border-zinc-600 px-1.5 py-0.5 rounded text-zinc-400">4K Ultra HD</span>
                      <span className="text-zinc-400">2h 14m</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-400 text-[10px] uppercase tracking-wider font-semibold">{movie.genre}</span>
                      <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                      <span className="text-zinc-400 text-[10px] font-semibold">Cinematic</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className={cn(
            "absolute right-0 top-0 bottom-0 z-40 bg-black/70 px-4 flex items-center justify-center transition-all duration-300 hover:bg-black/90",
            showArrows ? "opacity-100" : "opacity-0"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-10 h-10 text-white" />
        </button>
      </div>
    </div>
  );
}