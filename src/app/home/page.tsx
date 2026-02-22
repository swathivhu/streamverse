"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import MovieRow from '@/components/movie-row';
import TrailerGenerator from '@/components/trailer-generator';
import { CATEGORIES } from '@/lib/mock-data';
import { Play, Info, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('streamverse_user');
    if (!user) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative h-[80vh] w-full">
        <img 
          src="https://images.unsplash.com/photo-1616530940355-351fabd9524b?auto=format&fit=crop&q=80" 
          alt="Hero Banner" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 netflix-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        <div className="relative h-full flex flex-col justify-center px-4 md:px-12 max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-7xl font-black text-white leading-tight">
            THE GRAND <br />
            <span className="text-primary">ODYSSEY</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-200 line-clamp-3">
            In a world where memories are traded like currency, one man must find his forgotten past to save the future of humanity. An epic saga from the creators of Interstellar.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white hover:bg-zinc-200 text-black px-8 py-6 text-lg font-bold flex items-center gap-2">
              <Play className="fill-current" /> Play
            </Button>
            <Button variant="secondary" className="bg-zinc-600/50 hover:bg-zinc-600 text-white px-8 py-6 text-lg font-bold flex items-center gap-2">
              <Info /> More Info
            </Button>
            <Button variant="ghost" className="w-12 h-12 rounded-full border-2 border-zinc-400 p-0 hover:bg-white/10">
              <Plus className="text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Rows */}
      <div className="relative z-20 -mt-24 pb-20 space-y-12">
        {CATEGORIES.map((category) => (
          <MovieRow key={category.name} title={category.name} movies={category.items} />
        ))}
        
        {/* AI Trailer Tool */}
        <TrailerGenerator />
      </div>

      {/* Footer */}
      <footer className="bg-zinc-950 py-12 px-4 md:px-12 text-zinc-500 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 max-w-4xl">
          <ul className="space-y-2">
            <li>Audio and Subtitles</li>
            <li>Media Center</li>
            <li>Privacy</li>
            <li>Contact Us</li>
          </ul>
          <ul className="space-y-2">
            <li>Audio Description</li>
            <li>Investor Relations</li>
            <li>Legal Notices</li>
          </ul>
          <ul className="space-y-2">
            <li>Help Center</li>
            <li>Jobs</li>
            <li>Cookie Preferences</li>
          </ul>
          <ul className="space-y-2">
            <li>Gift Cards</li>
            <li>Terms of Use</li>
            <li>Corporate Information</li>
          </ul>
        </div>
        <p>© 2024-2025 StreamVerse, Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}