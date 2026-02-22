"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Clapperboard, LogOut, Search, Bell, User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('streamverse_user');
    router.push('/login');
  };

  return (
    <nav className={`fixed top-0 z-50 w-full px-4 md:px-12 py-4 transition-all duration-300 flex items-center justify-between ${isScrolled ? 'bg-background shadow-lg' : 'bg-transparent'}`}>
      <div className="flex items-center gap-8">
        <Link href="/home" className="flex items-center gap-2">
          <Clapperboard className="w-8 h-8 text-primary" />
          <span className="text-2xl font-black text-primary tracking-tighter hidden md:block uppercase">StreamVerse</span>
        </Link>
        <div className="hidden lg:flex items-center gap-6 text-sm text-zinc-300">
          <Link href="#" className="hover:text-white transition-colors font-medium">Home</Link>
          <Link href="#" className="hover:text-white transition-colors">TV Shows</Link>
          <Link href="#" className="hover:text-white transition-colors">Movies</Link>
          <Link href="#" className="hover:text-white transition-colors">New & Popular</Link>
          <Link href="#" className="hover:text-white transition-colors">My List</Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <Search className="w-5 h-5 text-white cursor-pointer hover:text-primary transition-colors" />
        <Bell className="w-5 h-5 text-white cursor-pointer hover:text-primary transition-colors" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-800 rounded overflow-hidden">
             <img src="https://picsum.photos/seed/user/200/200" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout} 
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}