"use client";

import { useRef } from 'react';
import { Movie } from '@/lib/mock-data';
import { ChevronLeft, ChevronRight, Play, Plus } from 'lucide-react';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 py-4 group relative">
      <h2 className="text-xl md:text-2xl font-semibold px-4 md:px-12 text-zinc-100">{title}</h2>
      
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 bg-black/40 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-auto px-4 md:px-12 hide-scrollbar scroll-smooth"
        >
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex-none w-[160px] md:w-[240px] aspect-[2/3] relative rounded-lg overflow-hidden group/item cursor-pointer transform transition-transform duration-300 hover:scale-105"
            >
              <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white font-bold text-sm md:text-lg mb-2 truncate">{movie.title}</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:bg-zinc-200">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div className="w-8 h-8 border-2 border-zinc-400 rounded-full flex items-center justify-center text-white hover:border-white">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 bg-black/40 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
}