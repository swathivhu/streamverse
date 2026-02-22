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
  Settings 
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
        "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out",
        isScrolled 
          ? "bg-black/40 backdrop-blur-lg border-b border-white/5 py-3 shadow-md" 
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-8 md:px-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/home" className="flex items-center gap-2 group shrink-0">
            <Clapperboard className="w-6 h-6 text-primary/90 transition-transform duration-300 group-hover:scale-105" />
            <span className="text-lg font-bold text-white tracking-tighter hidden md:block uppercase">
              StreamVerse
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-[9px] font-semibold tracking-[0.15em] uppercase text-zinc-500">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={cn(
                    "transition-colors duration-200 hover:text-white relative py-1",
                    isActive ? "text-white" : "text-zinc-500/60"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-primary/70" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:flex items-center gap-5">
            <Search className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-white transition-colors" />
            <div className="relative cursor-pointer group">
              <Bell className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              <span className="absolute top-0 right-0 w-1 h-1 bg-primary/80 rounded-full" />
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end shrink-0 border-r border-white/5 pr-4 mr-1">
            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em] mb-0.5">Welcome back</span>
            <span className="text-[10px] font-bold text-zinc-300 tracking-wider uppercase">{userData?.username || 'User'}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden border border-white/5 hover:border-white/10 transition-all shadow-sm">
                <Avatar className="h-full w-full">
                  <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'user'}/200/200`} alt="Profile" className="object-cover" />
                  <AvatarFallback className="bg-zinc-950 text-[9px] font-bold text-zinc-500">
                    {userData?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'S'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-zinc-950/95 backdrop-blur-xl border-white/5 shadow-2xl p-1" align="end" sideOffset={10}>
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-[10px] font-bold text-white uppercase">{userData?.username || 'Member'}</p>
                  <p className="text-[8px] text-zinc-600 uppercase tracking-widest font-semibold">Premium</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5 mx-1" />
              <DropdownMenuItem className="text-zinc-500 focus:text-white focus:bg-white/5 cursor-pointer py-2 px-3 rounded-md text-[9px] font-bold uppercase tracking-wider">
                <User className="mr-2 h-3.5 w-3.5" /> Account
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-500 focus:text-white focus:bg-white/5 cursor-pointer py-2 px-3 rounded-md text-[9px] font-bold uppercase tracking-wider">
                <Settings className="mr-2 h-3.5 w-3.5" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5 mx-1" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-primary/70 hover:text-primary hover:bg-primary/5 cursor-pointer py-2 px-3 rounded-md text-[9px] font-bold uppercase tracking-wider"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
