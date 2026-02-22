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
      
      {/* Hero Section - Refined for visual balance and seamless transition */}
      <section className="relative h-[80vh] w-full flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80" 
            alt="Hero Banner" 
            fill
            priority
            className="object-cover animate-in zoom-in-105 duration-[20000ms] fill-mode-forwards"
            data-ai-hint="cinema movie"
          />
          {/* Multi-layered cinematic overlays */}
          <div className="absolute inset-0 hero-gradient-overlay z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-black/30 z-10" />
        </div>
        
        <div className="relative z-20 h-full flex flex-col justify-end pb-24 px-6 md:px-16 max-w-screen-2xl mx-auto w-full">
          <div className="space-y-6 max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex items-center gap-3">
              <span className="bg-primary px-2 py-0.5 rounded-sm text-white font-black tracking-widest text-[10px] uppercase shadow-lg shadow-primary/20">
                Original
              </span>
              <span className="text-white/40 font-bold tracking-widest text-[10px] uppercase">
                Season 1 Now Streaming
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter uppercase">
              CHRONO <br /> <span className="text-primary/90">ECHOES</span>
            </h1>
            
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-lg font-medium">
              A daring scientist uncovers the price of altering history when she begins receiving warnings from her future self.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white h-11 px-8 text-sm font-bold rounded-md flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-primary/10">
                <Play className="fill-current w-4 h-4" /> Play
              </Button>
              <Button size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 h-11 px-8 text-sm font-bold rounded-md flex items-center gap-2 transition-all active:scale-95">
                <Info className="w-4 h-4" /> More Info
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Smoothly integrated into the hero fade */}
      <main className="relative z-10 flex-grow bg-transparent -mt-16">
        <div className="space-y-24 pb-32">
          {continueWatching.length > 0 && (
            <div className="animate-in fade-in duration-1000">
              <MovieRow title="Continue Watching" movies={continueWatching} />
            </div>
          )}

          <div className="space-y-24">
            {CATEGORIES.map((category) => (
              <div key={category.name}>
                <MovieRow title={category.name} movies={category.items} />
              </div>
            ))}
          </div>
          
          <section className="max-w-screen-2xl mx-auto px-6 md:px-16 mt-12">
             <TrailerGenerator />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/5 py-24 px-6 md:px-16 text-zinc-500 text-xs font-medium">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Clapperboard className="w-8 h-8" />
                <span className="text-2xl font-black uppercase tracking-tighter">StreamVerse</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-600 max-w-[200px]">
                Cinematic masterpieces curated for the true enthusiast. Experience storytelling like never before.
              </p>
              <div className="flex gap-6">
                <Facebook className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-zinc-300 font-bold text-[10px] uppercase tracking-widest">Explore</h4>
              <ul className="space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">TV Shows</li>
                <li className="hover:text-white cursor-pointer transition-colors">Movies</li>
                <li className="hover:text-white cursor-pointer transition-colors">Originals</li>
                <li className="hover:text-white cursor-pointer transition-colors">Trending</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-zinc-300 font-bold text-[10px] uppercase tracking-widest">Support</h4>
              <ul className="space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-white cursor-pointer transition-colors">Account</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-zinc-300 font-bold text-[10px] uppercase tracking-widest">StreamVerse TV</h4>
              <ul className="space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">Ways to Watch</li>
                <li className="hover:text-white cursor-pointer transition-colors">Corporate Info</li>
                <li className="hover:text-white cursor-pointer transition-colors">Investor Relations</li>
                <li className="hover:text-white cursor-pointer transition-colors">Terms of Use</li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] text-zinc-700 uppercase tracking-[0.2em]">© 2025 StreamVerse Entertainment Global.</p>
            <div className="flex gap-10 text-[9px] text-zinc-700 uppercase tracking-[0.2em]">
              <span className="hover:text-white cursor-pointer transition-colors">Ad Choices</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cookie Preferences</span>
              <span className="hover:text-white cursor-pointer transition-colors">Legal Notices</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
