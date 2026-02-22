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
      className="space-y-4 py-6 group relative"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className="text-xl md:text-2xl font-bold px-4 md:px-12 text-zinc-100 tracking-tight transition-colors hover:text-white cursor-pointer inline-block group-hover:translate-x-1 duration-300">
        {title}
        <span className="inline-block opacity-0 group-hover:opacity-100 ml-2 text-primary text-sm font-medium transition-all duration-300">Explore all →</span>
      </h2>
      
      <div className="relative overflow-visible group/row">
        <button 
          onClick={() => scroll('left')}
          className={cn(
            "absolute left-0 top-0 bottom-0 z-40 bg-black/60 px-2 flex items-center justify-center transition-all duration-300 hover:bg-black/80",
            showArrows ? "opacity-100" : "opacity-0"
          )}
        >
          <ChevronLeft className="w-10 h-10 text-white" />
        </button>

        <div 
          ref={rowRef}
          className="flex gap-2 md:gap-4 overflow-x-auto px-4 md:px-12 hide-scrollbar scroll-smooth py-6"
        >
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex-none w-[160px] md:w-[260px] aspect-[16/9] relative rounded-md overflow-visible group/item cursor-pointer transform transition-all duration-300 hover:scale-110 hover:z-50"
            >
              <div className="w-full h-full rounded-md overflow-hidden bg-zinc-900 shadow-xl border border-white/5">
                <img 
                  src={movie.thumbnail} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Detailed Card Overlay on Hover */}
              <div className="absolute top-0 left-0 w-full h-full bg-zinc-900 opacity-0 group-hover/item:opacity-100 transition-all duration-300 rounded-md shadow-[0_0_30px_rgba(0,0,0,0.8)] scale-110 flex flex-col pointer-events-none group-hover/item:pointer-events-auto z-50">
                <img 
                  src={movie.thumbnail} 
                  alt={movie.title} 
                  className="w-full aspect-[16/9] object-cover rounded-t-md"
                />
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-black hover:bg-zinc-200 transition-all active:scale-90">
                        <Play className="w-5 h-5 fill-current" />
                      </button>
                      <button className="w-9 h-9 border-2 border-zinc-600 rounded-full flex items-center justify-center text-white hover:border-white transition-all active:scale-90">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <button className="w-9 h-9 border-2 border-zinc-600 rounded-full flex items-center justify-center text-white hover:border-white transition-all active:scale-90 ml-auto">
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-bold text-sm truncate">{movie.title}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      <span className="text-green-500">98% Match</span>
                      <span className="border border-zinc-600 px-1 text-zinc-400">16+</span>
                      <span className="text-zinc-400">2h 14m</span>
                    </div>
                    <p className="text-zinc-400 text-[10px] uppercase tracking-wider font-semibold">{movie.genre}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className={cn(
            "absolute right-0 top-0 bottom-0 z-40 bg-black/60 px-2 flex items-center justify-center transition-all duration-300 hover:bg-black/80",
            showArrows ? "opacity-100" : "opacity-0"
          )}
        >
          <ChevronRight className="w-10 h-10 text-white" />
        </button>
      </div>
    </div>
  );
}