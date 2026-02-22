"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Clapperboard, 
  LogOut, 
  Search, 
  Bell, 
  User, 
  Settings, 
  HelpCircle 
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const db = useFirestore();
  const { user } = useUser();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userData } = useDoc(userRef);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      // Error handling is centralized via FirebaseErrorListener
    }
  };

  const navLinks = [
    { name: 'Home', href: '/home' },
    { name: 'TV Shows', href: '#' },
    { name: 'Movies', href: '#' },
    { name: 'New & Popular', href: '#' },
    { name: 'My List', href: '#' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 z-50 w-full px-6 md:px-16 flex items-center justify-between transition-all duration-500 ease-in-out",
        isScrolled 
          ? "bg-black/60 backdrop-blur-2xl border-b border-white/10 py-3 shadow-2xl" 
          : "bg-transparent py-6"
      )}
    >
      <div className="flex items-center gap-12">
        <Link href="/home" className="flex items-center gap-2 group shrink-0">
          {/* Logo with a slightly softer red tone via opacity/shadow */}
          <Clapperboard className="w-8 h-8 text-primary/90 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 filter drop-shadow-[0_0_8px_rgba(184,29,36,0.3)]" />
          <span className="text-2xl font-black text-primary/90 tracking-tighter hidden md:block uppercase italic">
            StreamVerse
          </span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-400">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={cn(
                  "transition-all duration-300 hover:text-white relative py-1",
                  isActive ? "text-white" : "text-zinc-400/80"
                )}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary/80 animate-in fade-in slide-in-from-left-2 duration-500" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden sm:flex items-center gap-6">
          <Search className="w-5 h-5 text-zinc-400 cursor-pointer hover:text-white transition-all hover:scale-110 active:scale-90" />
          <div className="relative cursor-pointer group">
            <Bell className="w-5 h-5 text-zinc-400 group-hover:text-white transition-all group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full border border-black shadow-sm" />
          </div>
        </div>

        {/* Personalized Greeting with minimal typography */}
        <div className="hidden md:flex flex-col items-end shrink-0 border-r border-white/10 pr-6 mr-2">
          <span className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-0.5">Welcome Back</span>
          <span className="text-xs font-black text-zinc-200 tracking-tight uppercase italic">{userData?.username || 'Streamer'}</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-white/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 active:scale-95 group shadow-xl">
              <Avatar className="h-full w-full">
                <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'user'}/200/200`} alt="Profile" className="object-cover" />
                <AvatarFallback className="bg-zinc-900 text-[10px] font-black text-primary">
                  {userData?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'S'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-black/80 backdrop-blur-3xl border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-300 p-2" align="end" sideOffset={12}>
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg italic shadow-inner">
                      {userData?.username?.[0]?.toUpperCase() || 'S'}
                   </div>
                   <div className="flex flex-col">
                      <p className="text-sm font-black leading-none text-zinc-100 uppercase tracking-tighter italic">{userData?.username || 'Member'}</p>
                      <p className="text-[9px] leading-none text-primary/80 mt-1.5 font-bold uppercase tracking-widest">
                        Premium Subscriber
                      </p>
                   </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10 mx-2" />
            <div className="space-y-1 my-1 px-1">
              <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-white/10 cursor-pointer py-2.5 px-3 rounded-md transition-all group">
                <User className="mr-3 h-4 w-4 text-zinc-500 group-focus:text-primary transition-colors" />
                <span className="font-bold uppercase text-[10px] tracking-wider">Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-white/10 cursor-pointer py-2.5 px-3 rounded-md transition-all group">
                <Settings className="mr-3 h-4 w-4 text-zinc-500 group-focus:text-primary transition-colors" />
                <span className="font-bold uppercase text-[10px] tracking-wider">Preferences</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-white/10 mx-2" />
            <div className="p-1">
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-primary hover:text-white focus:text-white focus:bg-primary/90 cursor-pointer font-black py-3 rounded-md transition-all uppercase text-[9px] tracking-[0.25em] justify-center shadow-lg active:scale-95 border border-primary/20"
              >
                <LogOut className="mr-2 h-3 w-3" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
