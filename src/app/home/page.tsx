"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import MovieRow from '@/components/movie-row';
import TrailerGenerator from '@/components/trailer-generator';
import { CONTINUE_WATCHING, Movie } from '@/lib/mock-data';
import { Play, Info, Clapperboard, Facebook, Instagram, Twitter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80';

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Trailer State
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchMovies() {
      try {
        const [trendingRes, topRatedRes, upcomingRes] = await Promise.all([
          fetch('/api/tmdb?type=trending'),
          fetch('/api/tmdb?type=top_rated'),
          fetch('/api/tmdb?type=upcoming')
        ]);

        const [trendingData, topRatedData, upcomingData] = await Promise.all([
          trendingRes.json(),
          topRatedRes.json(),
          upcomingRes.json()
        ]);

        const mapMovies = (results: any[]) => 
          (results || []).map((m: any) => ({
            id: m.id.toString(),
            title: m.title || m.name,
            genre: 'Movie',
            thumbnail: m.backdrop_path || m.poster_path 
              ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path || m.poster_path}`
              : FALLBACK_IMAGE,
          }));

        setTrendingMovies(mapMovies(trendingData.results));
        setTopRatedMovies(mapMovies(topRatedData.results));
        setUpcomingMovies(mapMovies(upcomingData.results));

      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoadingMovies(false);
      }
    }
  
    fetchMovies();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.results) {
        const mappedResults: Movie[] = data.results.map((m: any) => ({
          id: m.id.toString(),
          title: m.title || m.name,
          genre: 'Movie',
          thumbnail: m.backdrop_path || m.poster_path 
            ? `https://image.tmdb.org/t/p/w780${m.backdrop_path || m.poster_path}`
            : FALLBACK_IMAGE,
        }));
        setSearchResults(mappedResults);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleMovieClick = async (movieId: string) => {
    // TMDB IDs are numeric. Mock IDs might be 't1', 'cw1', etc.
    if (!/^\d+$/.test(movieId)) {
      toast({
        title: "Limited Content",
        description: "Trailers are currently available for our trending and global library.",
        variant: "default"
      });
      return;
    }

    setIsLoadingTrailer(true);
    try {
      const res = await fetch(`/api/trailer?movieId=${movieId}`);
      const data = await res.json();
      
      if (data.trailerKey) {
        setTrailerKey(data.trailerKey);
        setIsTrailerModalOpen(true);
      } else {
        toast({
          title: "No Trailer Found",
          description: "We couldn't find an official trailer for this title.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Trailer fetch failed:", error);
      toast({
        title: "Connection Error",
        description: "Failed to load trailer. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary text-xs font-black tracking-[0.2em] uppercase animate-pulse">StreamVerse</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-x-hidden">
      <Navbar onSearch={handleSearch} />
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] w-full flex flex-col justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80" 
            alt="Hero Banner" 
            fill
            priority
            className="object-cover contrast-[1.25] saturate-[1.25] brightness-75 animate-hero-zoom"
            data-ai-hint="cinema movie"
          />
          <div className="absolute inset-0 hero-gradient-overlay z-10" />
          <div className="absolute inset-0 bg-black/20 z-10" />
        </div>
        
        <div className="relative z-20 px-8 md:px-20 max-w-screen-2xl mx-auto w-full pt-16 pb-20">
          <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-3">
              <span className="bg-primary px-3 py-1 rounded-sm text-white font-black tracking-widest text-[10px] uppercase shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                StreamVerse Original
              </span>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-x-20 -inset-y-10 bg-primary/10 blur-[120px] rounded-full z-0 pointer-events-none" />
              <h1 className="relative z-10 text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter uppercase">
                CHRONO <br /> <span className="text-primary">ECHOES</span>
              </h1>
            </div>
            
            <p className="text-sm md:text-base text-zinc-200 leading-[1.6] max-w-xl font-bold drop-shadow-xl">
              A daring scientist uncovers the price of altering history when she begins receiving warnings from her future self.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-[#E50914] hover:brightness-110 text-white h-12 px-8 text-xs font-bold rounded-sm flex items-center gap-3 transition-all active:scale-95 border-none shadow-lg">
                <Play className="fill-current w-5 h-5" /> Play
              </Button>
              <Button size="lg" variant="secondary" className="bg-zinc-500/30 hover:bg-zinc-500/50 backdrop-blur-sm text-white border-none h-12 px-8 text-xs font-bold rounded-sm flex items-center gap-3 transition-all active:scale-95">
                <Info className="w-5 h-5" /> More Info
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 flex-grow bg-black">
        <div className="space-y-16 pb-32">
          {searchQuery ? (
            <div className="animate-in fade-in duration-500 mt-8">
              <MovieRow 
                title={isSearching ? `Searching for "${searchQuery}"...` : `Results for "${searchQuery}"`} 
                movies={searchResults} 
                onMovieClick={handleMovieClick}
              />
            </div>
          ) : (
            <>
              {CONTINUE_WATCHING.length > 0 && (
                <div className="animate-in fade-in duration-1000 mt-8">
                  <MovieRow title="Continue Watching" movies={CONTINUE_WATCHING} onMovieClick={handleMovieClick} />
                </div>
              )}

              <div className="space-y-16">
                {trendingMovies.length > 0 && (
                  <MovieRow title="Trending Now" movies={trendingMovies} onMovieClick={handleMovieClick} />
                )}
                {topRatedMovies.length > 0 && (
                  <MovieRow title="Top Rated" movies={topRatedMovies} onMovieClick={handleMovieClick} />
                )}
                {upcomingMovies.length > 0 && (
                  <MovieRow title="Upcoming" movies={upcomingMovies} onMovieClick={handleMovieClick} />
                )}
              </div>
            </>
          )}
          
          <section className="max-w-screen-2xl mx-auto px-8 md:px-20 mt-12">
             <TrailerGenerator />
          </section>
        </div>
      </main>

      {/* Trailer Modal */}
      <Dialog open={isTrailerModalOpen} onOpenChange={setIsTrailerModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl bg-black border-none p-0 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
          <DialogHeader className="sr-only">
            <DialogTitle>Movie Trailer</DialogTitle>
          </DialogHeader>
          
          <div className="aspect-video w-full bg-zinc-950 relative group">
            {trailerKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Loading Trailer</p>
              </div>
            )}
            
            <button 
              onClick={() => setIsTrailerModalOpen(false)}
              className="absolute top-4 right-4 z-[60] p-2 bg-black/50 hover:bg-black/80 rounded-full transition-all text-white/70 hover:text-white backdrop-blur-sm border border-white/10"
              aria-label="Close trailer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-24 px-8 md:px-20 text-zinc-500 text-[11px] font-bold">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
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
            <div className="space-y-4">
              <h4 className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">Explore</h4>
              <ul className="space-y-2">
                <li className="hover:text-white cursor-pointer transition-colors">TV Shows</li>
                <li className="hover:text-white cursor-pointer transition-colors">Movies</li>
                <li className="hover:text-white cursor-pointer transition-colors">Originals</li>
                <li className="hover:text-white cursor-pointer transition-colors">Trending</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">Support</h4>
              <ul className="space-y-2">
                <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-white cursor-pointer transition-colors">Account</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">Company</h4>
              <ul className="space-y-2">
                <li className="hover:text-white cursor-pointer transition-colors">Ways to Watch</li>
                <li className="hover:text-white cursor-pointer transition-colors">Corporate Info</li>
                <li className="hover:text-white cursor-pointer transition-colors">Investor Relations</li>
                <li className="hover:text-white cursor-pointer transition-colors">Terms of Use</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-zinc-700 uppercase tracking-[0.2em]">© 2025 StreamVerse Entertainment Global.</p>
            <div className="flex gap-10 text-[10px] text-zinc-700 uppercase tracking-[0.2em]">
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
