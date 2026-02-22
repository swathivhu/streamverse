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
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-medium animate-pulse">Loading StreamVerse...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Filter movies that have progress tracked for "Continue Watching"
  const continueWatching = MOVIES.filter(movie => movie.progress !== undefined).slice(0, 3);

  return (
    <div className="min-h-screen bg-transparent flex flex-col overflow-x-hidden">
      <Navbar />
      
      {/* Cinematic Hero Banner Section */}
      <section className="relative h-[85vh] w-full flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80" 
            alt="Hero Banner" 
            fill
            priority
            className="object-cover animate-in zoom-in-110 duration-[20000ms] fill-mode-forwards"
            data-ai-hint="cinema movie"
          />
          {/* Multi-layered cinematic gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />
        </div>
        
        <div className="relative z-20 h-full flex flex-col justify-end pb-24 px-6 md:px-16 max-w-7xl mx-auto w-full">
          <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-sm shadow-[0_0_15px_rgba(184,29,36,0.6)]">
                <Clapperboard className="w-4 h-4 text-white" />
              </div>
              <span className="text-primary font-black tracking-[0.3em] text-[10px] uppercase text-shadow-premium">
                StreamVerse Original
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl uppercase italic">
              CHRONO <br />
              <span className="text-primary">ECHOES</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-200 leading-relaxed drop-shadow-lg text-shadow-premium max-w-xl line-clamp-3">
              When a scientist discovers a way to send messages to her past, she realizes that changing the timeline comes at a devastating cost. A mind-bending thriller that redefines fate.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white h-14 px-10 text-xl font-bold rounded-md flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl">
                <Play className="fill-current w-6 h-6" /> Play
              </Button>
              <Button size="lg" variant="secondary" className="bg-zinc-500/20 hover:bg-zinc-500/40 backdrop-blur-md text-white border border-white/20 h-14 px-10 text-xl font-bold rounded-md flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
                <Info className="w-6 h-6" /> More Info
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow bg-transparent">
        <div className="space-y-24 pb-32 pt-12">
          {/* Continue Watching Section */}
          {continueWatching.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <MovieRow title="Continue Watching" movies={continueWatching} />
            </div>
          )}

          {CATEGORIES.map((category) => (
            <div key={category.name}>
              <MovieRow title={category.name} movies={category.items} />
            </div>
          ))}
          
          {/* AI Trailer Tool Section */}
          <section className="max-w-7xl mx-auto px-6 md:px-12 mt-12 relative">
             {/* Subtle glowing anchor for the AI section */}
             <div className="absolute -inset-24 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
             <TrailerGenerator />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md border-t border-white/5 py-20 px-6 md:px-12 text-zinc-500 text-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Clapperboard className="w-8 h-8" />
                <span className="text-2xl font-black uppercase tracking-tighter">StreamVerse</span>
              </div>
              <p className="text-xs leading-relaxed max-w-xs text-zinc-400">
                The ultimate cinematic experience, bringing you the world's greatest stories right to your screen.
              </p>
              <div className="flex gap-5">
                <Facebook className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-base mb-6">Explore Content</h4>
              <ul className="space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">TV Shows & Series</li>
                <li className="hover:text-white cursor-pointer transition-colors">Action Movies</li>
                <li className="hover:text-white cursor-pointer transition-colors">StreamVerse Originals</li>
                <li className="hover:text-white cursor-pointer transition-colors">Latest Releases</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-base mb-6">Company Support</h4>
              <ul className="space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Relations</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-base mb-6">User Account</h4>
              <ul className="space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">Manage Profile</li>
                <li className="hover:text-white cursor-pointer transition-colors">My Watchlist</li>
                <li className="hover:text-white cursor-pointer transition-colors">Account Settings</li>
                <li className="hover:text-white cursor-pointer transition-colors">Subscription Plans</li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-zinc-600">© 2024-2025 StreamVerse Entertainment Inc. Global HQ. All rights reserved.</p>
            <div className="flex gap-8 text-xs font-medium text-zinc-500">
              <span className="hover:text-white cursor-pointer transition-colors">Cookie Preferences</span>
              <span className="hover:text-white cursor-pointer transition-colors">Corporate Governance</span>
              <span className="hover:text-white cursor-pointer transition-colors">Legal Notices</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
