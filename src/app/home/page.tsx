"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import MovieRow from '@/components/movie-row';
import TrailerGenerator from '@/components/trailer-generator';
import { CATEGORIES, MOVIES } from '@/lib/mock-data';
import { Play, Info, Clapperboard, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-600 text-xs font-semibold tracking-widest uppercase animate-pulse">StreamVerse</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const continueWatching = MOVIES.filter(movie => movie.progress !== undefined).slice(0, 3);

  return (
    <div className="min-h-screen bg-transparent flex flex-col overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80" 
            alt="Hero Banner" 
            fill
            priority
            className="object-cover animate-in zoom-in-105 duration-[15000ms] fill-mode-forwards"
            data-ai-hint="cinema movie"
          />
          {/* Subtle minimal gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>
        
        <div className="relative z-20 h-full flex flex-col justify-end pb-20 px-6 md:px-16 max-w-7xl mx-auto w-full">
          <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase">
                StreamVerse Original
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-none tracking-tight uppercase">
              CHRONO <span className="text-primary">ECHOES</span>
            </h1>
            
            <p className="text-base md:text-lg text-zinc-300 leading-relaxed max-w-lg font-medium text-shadow-minimal">
              When a scientist discovers a way to send messages to her past, she realizes that changing the timeline comes at a devastating cost.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white h-12 px-8 text-base font-bold rounded-md flex items-center gap-2 transition-transform active:scale-95 shadow-lg">
                <Play className="fill-current w-5 h-5" /> Play
              </Button>
              <Button size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 h-12 px-8 text-base font-bold rounded-md flex items-center gap-2 transition-transform active:scale-95">
                <Info className="w-5 h-5" /> More Info
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 flex-grow bg-transparent">
        <div className="space-y-16 pb-24 pt-12">
          {continueWatching.length > 0 && (
            <div className="animate-in fade-in duration-500">
              <MovieRow title="Continue Watching" movies={continueWatching} />
            </div>
          )}

          {CATEGORIES.map((category) => (
            <div key={category.name}>
              <MovieRow title={category.name} movies={category.items} />
            </div>
          ))}
          
          <section className="max-w-7xl mx-auto px-6 md:px-12 mt-12 relative">
             <TrailerGenerator />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/5 py-16 px-6 md:px-12 text-zinc-500 text-xs font-medium">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Clapperboard className="w-6 h-6" />
                <span className="text-lg font-bold uppercase tracking-tight">StreamVerse</span>
              </div>
              <p className="text-[10px] leading-relaxed text-zinc-500">
                Premium cinematic experiences delivered to your favorite devices.
              </p>
              <div className="flex gap-4">
                <Facebook className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-[10px] uppercase tracking-wider">Explore</h4>
              <ul className="space-y-2">
                <li className="hover:text-white cursor-pointer">TV Shows</li>
                <li className="hover:text-white cursor-pointer">Movies</li>
                <li className="hover:text-white cursor-pointer">New Releases</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-[10px] uppercase tracking-wider">Support</h4>
              <ul className="space-y-2">
                <li className="hover:text-white cursor-pointer">Help Center</li>
                <li className="hover:text-white cursor-pointer">Privacy</li>
                <li className="hover:text-white cursor-pointer">Contact</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-[10px] uppercase tracking-wider">Company</h4>
              <ul className="space-y-2">
                <li className="hover:text-white cursor-pointer">About Us</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
                <li className="hover:text-white cursor-pointer">Terms</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[9px] text-zinc-600 uppercase tracking-widest">© 2025 StreamVerse Entertainment.</p>
            <div className="flex gap-8 text-[9px] text-zinc-600 uppercase tracking-widest">
              <span className="hover:text-white cursor-pointer">Terms</span>
              <span className="hover:text-white cursor-pointer">Privacy</span>
              <span className="hover:text-white cursor-pointer">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
