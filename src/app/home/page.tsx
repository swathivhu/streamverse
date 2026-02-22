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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Banner Section */}
      <section className="relative h-[85vh] w-full flex-shrink-0">
        <Image 
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80" 
          alt="Hero Banner" 
          fill
          priority
          className="object-cover"
          data-ai-hint="cinema movie"
        />
        {/* Complex gradient for premium readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        
        <div className="relative h-full flex flex-col justify-center px-6 md:px-12 max-w-5xl space-y-6 pt-20">
          <div className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[2px] bg-primary"></span>
              <span className="text-primary font-bold tracking-[0.4em] text-xs uppercase text-shadow-premium">Original Series</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
              CHRONO <br />
              <span className="text-primary">ECHOES</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-zinc-200 max-w-xl leading-relaxed drop-shadow-lg text-shadow-premium animate-in fade-in slide-in-from-left-12 duration-1000">
            A brilliant scientist discovers a way to send messages to her past self, but every correction creates a darker reality. Experience the mind-bending thrill of the decade.
          </p>
          <div className="flex flex-wrap gap-4 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Button className="bg-white hover:bg-zinc-200 text-black h-16 px-10 text-xl font-bold rounded-md flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-xl">
              <Play className="fill-current w-6 h-6" /> Play
            </Button>
            <Button variant="secondary" className="bg-zinc-500/30 hover:bg-zinc-500/50 backdrop-blur-md text-white h-16 px-10 text-xl font-bold rounded-md flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-xl">
              <Info className="w-6 h-6" /> More Info
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow bg-background pb-32">
        <div className="space-y-16 md:space-y-24 pt-12">
          {CATEGORIES.map((category, index) => (
            <div key={category.name} className={index === 0 ? "mt-4" : ""}>
              <MovieRow title={category.name} movies={category.items} />
            </div>
          ))}
          
          {/* AI Trailer Tool Section */}
          <section className="max-w-7xl mx-auto px-6 md:px-12">
            <TrailerGenerator />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-900 py-20 px-6 md:px-12 text-zinc-500 text-sm">
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
          <div className="pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
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