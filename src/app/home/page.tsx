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
          <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#E50914] text-xs font-black tracking-[0.2em] uppercase animate-pulse">StreamVerse</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const continueWatching = MOVIES.filter(movie => movie.progress !== undefined).slice(0, 3);

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section - Bold Cinematic Presence */}
      <section className="relative h-[85vh] w-full flex-shrink-0 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80" 
            alt="Hero Banner" 
            fill
            priority
            className="object-cover contrast-[1.2] saturate-[1.2] brightness-75 blur-[1px] animate-in zoom-in-105 duration-[30000ms] fill-mode-forwards"
            data-ai-hint="cinema movie"
          />
          <div className="absolute inset-0 hero-gradient-overlay z-10" />
          <div className="absolute inset-0 bg-black/60 z-10" />
        </div>
        
        <div className="relative z-20 h-full flex flex-col justify-end pb-32 px-8 md:px-20 max-w-screen-2xl mx-auto w-full">
          <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-3">
              <span className="bg-[#E50914] px-3 py-1 rounded-sm text-white font-black tracking-widest text-[10px] uppercase shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                StreamVerse Original
              </span>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-x-20 -inset-y-10 bg-[#E50914]/10 blur-[120px] rounded-full z-0 pointer-events-none" />
              <h1 className="relative z-10 text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter uppercase">
                CHRONO <br /> <span className="text-[#E50914]">ECHOES</span>
              </h1>
            </div>
            
            <p className="text-sm md:text-lg text-zinc-200 leading-relaxed max-w-xl font-bold drop-shadow-xl">
              A daring scientist uncovers the price of altering history when she begins receiving warnings from her future self.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-[#E50914] hover:bg-[#ff0a16] text-white h-14 px-10 text-sm font-black rounded-sm flex items-center gap-3 transition-all active:scale-95 border-none shadow-lg">
                <Play className="fill-current w-6 h-6" /> Play
              </Button>
              <Button size="lg" variant="secondary" className="bg-zinc-500/30 hover:bg-zinc-500/50 backdrop-blur-sm text-white border-none h-14 px-10 text-sm font-black rounded-sm flex items-center gap-3 transition-all active:scale-95">
                <Info className="w-6 h-6" /> More Info
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - High Contrast Rows */}
      <main className="relative z-10 flex-grow bg-black mt-12">
        <div className="space-y-24 pb-48">
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
          
          <section className="max-w-screen-2xl mx-auto px-8 md:px-20 mt-12">
             <TrailerGenerator />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-32 px-8 md:px-20 text-zinc-500 text-[11px] font-bold">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-24">
            <div className="space-y-8">
              <div className="flex items-center gap-2 text-[#E50914]">
                <Clapperboard className="w-8 h-8" />
                <span className="text-2xl font-black uppercase tracking-tighter">StreamVerse</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-600 max-w-[200px]">
                Cinematic masterpieces curated for the true enthusiast. Experience storytelling like never before.
              </p>
              <div className="flex gap-8">
                <Facebook className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">Explore</h4>
              <ul className="space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">TV Shows</li>
                <li className="hover:text-white cursor-pointer transition-colors">Movies</li>
                <li className="hover:text-white cursor-pointer transition-colors">Originals</li>
                <li className="hover:text-white cursor-pointer transition-colors">Trending</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">Support</h4>
              <ul className="space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-white cursor-pointer transition-colors">Account</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">Company</h4>
              <ul className="space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">Ways to Watch</li>
                <li className="hover:text-white cursor-pointer transition-colors">Corporate Info</li>
                <li className="hover:text-white cursor-pointer transition-colors">Investor Relations</li>
                <li className="hover:text-white cursor-pointer transition-colors">Terms of Use</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] text-zinc-700 uppercase tracking-[0.2em]">© 2025 StreamVerse Entertainment Global.</p>
            <div className="flex gap-12 text-[10px] text-zinc-700 uppercase tracking-[0.2em]">
              <span className="hover:text-white cursor-pointer transition-colors">Ad Choices</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
              <span className="hover:text-white cursor-pointer transition-colors">Legal Notices</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
