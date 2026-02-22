
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import MovieRow from '@/components/movie-row';
import TrailerGenerator from '@/components/trailer-generator';
import { CATEGORIES } from '@/lib/mock-data';
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80" 
          alt="Hero Banner" 
          fill
          priority
          className="object-cover"
          data-ai-hint="cinema movie"
        />
        <div className="absolute inset-0 hero-gradient" />
        
        <div className="relative h-full flex flex-col justify-center px-4 md:px-12 max-w-4xl space-y-6 pt-20">
          <div className="space-y-2 animate-in fade-in slide-in-from-left-8 duration-700">
            <span className="text-primary font-bold tracking-[0.4em] text-xs uppercase text-shadow-premium">Original Series</span>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter drop-shadow-2xl">
              CHRONO <br />
              <span className="text-primary">ECHOES</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-zinc-100 max-w-xl line-clamp-3 md:line-clamp-none leading-relaxed drop-shadow-lg text-shadow-premium animate-in fade-in slide-in-from-left-12 duration-1000">
            A brilliant scientist discovers a way to send messages to her past self, but every correction creates a darker reality. Experience the mind-bending thrill of the decade.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Button className="bg-white hover:bg-zinc-200 text-black px-10 py-7 text-xl font-bold rounded-md flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-xl">
              <Play className="fill-current w-6 h-6" /> Play
            </Button>
            <Button variant="secondary" className="bg-zinc-500/30 hover:bg-zinc-500/50 backdrop-blur-md text-white px-10 py-7 text-xl font-bold rounded-md flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-xl">
              <Info className="w-6 h-6" /> More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Content Rows */}
      <div className="relative z-20 -mt-32 pb-20 space-y-16 bg-gradient-to-t from-background via-background/95 to-transparent">
        {CATEGORIES.map((category) => (
          <MovieRow key={category.name} title={category.name} movies={category.items} />
        ))}
        
        {/* AI Trailer Tool */}
        <div className="max-w-7xl mx-auto px-4 md:px-12 pt-12">
          <TrailerGenerator />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-900 py-20 px-4 md:px-12 text-zinc-500 text-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Clapperboard className="w-8 h-8" />
                <span className="text-xl font-black uppercase tracking-tighter">StreamVerse</span>
              </div>
              <p className="text-xs leading-relaxed max-w-xs">
                The ultimate cinematic experience, bringing you the world's greatest stories right to your screen.
              </p>
              <div className="flex gap-4">
                <Facebook className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold mb-6">Explore</h4>
              <ul className="space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">TV Shows</li>
                <li className="hover:text-white cursor-pointer transition-colors">Movies</li>
                <li className="hover:text-white cursor-pointer transition-colors">Originals</li>
                <li className="hover:text-white cursor-pointer transition-colors">New Releases</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-white cursor-pointer transition-colors">Terms of Use</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Support</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold mb-6">Account</h4>
              <ul className="space-y-3">
                <li className="hover:text-white cursor-pointer transition-colors">My Profile</li>
                <li className="hover:text-white cursor-pointer transition-colors">Watchlist</li>
                <li className="hover:text-white cursor-pointer transition-colors">Settings</li>
                <li className="hover:text-white cursor-pointer transition-colors">Subscription</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs">© 2024-2025 StreamVerse Entertainment Inc. All rights reserved.</p>
            <div className="flex gap-8 text-xs font-medium">
              <span className="hover:text-white cursor-pointer transition-colors">Cookie Settings</span>
              <span className="hover:text-white cursor-pointer transition-colors">Corporate Info</span>
              <span className="hover:text-white cursor-pointer transition-colors">Ad Choices</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
