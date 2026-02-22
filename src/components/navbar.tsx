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
          ? "bg-black border-b border-white/5 py-3 shadow-2xl" 
          : "bg-gradient-to-b from-black/80 to-transparent py-6"
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-8 md:px-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/home" className="flex items-center gap-2 group shrink-0">
            <Clapperboard className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xl font-black text-primary tracking-tighter hidden md:block uppercase">
              StreamVerse
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold tracking-[0.1em] uppercase">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={cn(
                    "transition-colors duration-200 hover:text-white relative py-1",
                    isActive ? "text-white" : "text-zinc-400"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_rgba(229,9,20,0.8)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:flex items-center gap-5">
            <Search className="w-5 h-5 text-zinc-400 cursor-pointer hover:text-white transition-colors" />
            <div className="relative cursor-pointer group">
              <Bell className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-black" />
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end shrink-0 border-r border-white/10 pr-4 mr-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Welcome back</span>
            <span className="text-[11px] font-black text-white tracking-wider uppercase">{userData?.username || 'User'}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-md p-0 overflow-hidden border border-white/10 hover:border-white/30 transition-all shadow-xl">
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'user'}/200/200`} alt="Profile" className="object-cover" />
                  <AvatarFallback className="bg-zinc-900 text-xs font-bold text-zinc-400">
                    {userData?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'S'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#141414] border-white/10 shadow-2xl p-2" align="end" sideOffset={12}>
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-black text-white uppercase">{userData?.username || 'Member'}</p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Premium Subscriber</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5 mx-1" />
              <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-white/5 cursor-pointer py-3 px-3 rounded-md text-[10px] font-bold uppercase tracking-widest">
                <User className="mr-2 h-4 w-4 text-zinc-500" /> Account
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-white/5 cursor-pointer py-3 px-3 rounded-md text-[10px] font-bold uppercase tracking-widest">
                <Settings className="mr-2 h-4 w-4 text-zinc-500" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5 mx-1" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-primary hover:text-primary hover:bg-primary/5 cursor-pointer py-3 px-3 rounded-md text-[10px] font-bold uppercase tracking-widest"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
