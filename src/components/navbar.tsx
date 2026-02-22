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
        "fixed top-0 z-50 w-full px-6 md:px-16 flex items-center justify-between transition-all duration-300 ease-in-out",
        isScrolled 
          ? "bg-black/40 backdrop-blur-lg border-b border-white/5 py-3 shadow-md" 
          : "bg-transparent py-6"
      )}
    >
      <div className="flex items-center gap-12">
        <Link href="/home" className="flex items-center gap-2 group shrink-0">
          <Clapperboard className="w-7 h-7 text-primary transition-transform duration-300 group-hover:scale-105" />
          <span className="text-xl font-bold text-white tracking-tighter hidden md:block uppercase">
            StreamVerse
          </span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8 text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={cn(
                  "transition-colors duration-200 hover:text-white relative py-1",
                  isActive ? "text-white" : "text-zinc-400/70"
                )}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden sm:flex items-center gap-5">
          <Search className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-white transition-colors" />
          <div className="relative cursor-pointer group">
            <Bell className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full" />
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end shrink-0 border-r border-white/5 pr-4 mr-1">
          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-0.5">Welcome</span>
          <span className="text-xs font-semibold text-zinc-200 tracking-tight uppercase">{userData?.username || 'User'}</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden border border-white/10 hover:border-white/20 transition-all shadow-sm">
              <Avatar className="h-full w-full">
                <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'user'}/200/200`} alt="Profile" className="object-cover" />
                <AvatarFallback className="bg-zinc-900 text-[10px] font-bold text-zinc-400">
                  {userData?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'S'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-950/95 backdrop-blur-xl border-white/5 shadow-2xl p-1" align="end" sideOffset={10}>
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-bold text-white uppercase">{userData?.username || 'Member'}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Premium Member</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5 mx-1" />
            <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-white/5 cursor-pointer py-2 px-3 rounded-md text-[10px] font-bold uppercase tracking-wider">
              <User className="mr-2 h-3.5 w-3.5" /> Account
            </DropdownMenuItem>
            <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-white/5 cursor-pointer py-2 px-3 rounded-md text-[10px] font-bold uppercase tracking-wider">
              <Settings className="mr-2 h-3.5 w-3.5" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5 mx-1" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-primary hover:bg-primary/10 cursor-pointer font-bold py-2 px-3 rounded-md text-[10px] font-bold uppercase tracking-wider"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
