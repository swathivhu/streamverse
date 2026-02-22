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
      setIsScrolled(window.scrollY > 20);
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
        "fixed top-0 z-50 w-full px-6 md:px-16 flex items-center justify-between transition-all duration-700 ease-in-out",
        isScrolled 
          ? "bg-black/70 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl" 
          : "bg-gradient-to-b from-black/80 to-transparent py-6"
      )}
    >
      <div className="flex items-center gap-12">
        <Link href="/home" className="flex items-center gap-2 group shrink-0">
          <Clapperboard className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
          <span className="text-2xl font-black text-primary tracking-tighter hidden md:block uppercase italic">
            StreamVerse
          </span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold tracking-wide uppercase">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={cn(
                  "transition-all duration-300 hover:text-white relative py-1",
                  isActive ? "text-white" : "text-zinc-400"
                )}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary animate-in fade-in slide-in-from-left-2 duration-500" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden sm:flex items-center gap-8">
          <Search className="w-5 h-5 text-zinc-300 cursor-pointer hover:text-primary transition-all hover:scale-110 active:scale-90" />
          <div className="relative cursor-pointer group">
            <Bell className="w-5 h-5 text-zinc-300 group-hover:text-primary transition-all group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border border-black shadow-sm" />
          </div>
        </div>

        {/* Personalized Greeting */}
        <div className="hidden md:flex flex-col items-end shrink-0">
          <span className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">Member</span>
          <span className="text-sm font-black text-white tracking-tight uppercase italic">{userData?.username || 'Streamer'}</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-11 w-11 rounded-lg p-0 overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105 active:scale-95 group shadow-xl">
              <Avatar className="h-full w-full rounded-none">
                <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'user'}/200/200`} alt="Profile" className="object-cover" />
                <AvatarFallback className="rounded-none bg-zinc-900 text-xs font-black text-primary">
                  {userData?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'S'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 bg-zinc-950/95 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-300 p-2" align="end" sideOffset={12}>
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xl italic shadow-inner">
                      {userData?.username?.[0]?.toUpperCase() || 'S'}
                   </div>
                   <div className="flex flex-col">
                      <p className="text-base font-black leading-none text-white uppercase tracking-tighter italic">{userData?.username || 'Member'}</p>
                      <p className="text-[10px] leading-none text-primary mt-1.5 font-bold uppercase tracking-widest">
                        Premium Tier
                      </p>
                   </div>
                </div>
                <p className="text-[10px] text-zinc-500 truncate pt-3 border-t border-white/5 font-medium">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5 mx-2" />
            <div className="space-y-1 my-1">
              <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-white/10 cursor-pointer py-3 px-4 rounded-md transition-all group">
                <User className="mr-3 h-4 w-4 text-zinc-500 group-focus:text-primary transition-colors" />
                <span className="font-bold uppercase text-xs tracking-wider">Profile Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-white/10 cursor-pointer py-3 px-4 rounded-md transition-all group">
                <Settings className="mr-3 h-4 w-4 text-zinc-500 group-focus:text-primary transition-colors" />
                <span className="font-bold uppercase text-xs tracking-wider">Account Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-white/10 cursor-pointer py-3 px-4 rounded-md transition-all group">
                <HelpCircle className="mr-3 h-4 w-4 text-zinc-500 group-focus:text-primary transition-colors" />
                <span className="font-bold uppercase text-xs tracking-wider">Support Center</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-white/5 mx-2" />
            <div className="p-1">
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-primary focus:text-white focus:bg-primary cursor-pointer font-black py-4 rounded-md transition-all uppercase text-[10px] tracking-[0.2em] justify-center shadow-lg active:scale-95"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
