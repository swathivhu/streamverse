
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      // Error handling is centralized, but we can log for debugging if needed
    }
  };

  return (
    <nav className={`fixed top-0 z-50 w-full px-4 md:px-12 transition-all duration-500 flex items-center justify-between ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-2xl py-2' : 'bg-transparent py-4'}`}>
      <div className="flex items-center gap-10">
        <Link href="/home" className="flex items-center gap-2 group">
          <Clapperboard className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
          <span className="text-2xl font-black text-primary tracking-tighter hidden md:block uppercase">StreamVerse</span>
        </Link>
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link href="/home" className="text-white hover:text-white transition-colors">Home</Link>
          <Link href="#" className="hover:text-white transition-colors">TV Shows</Link>
          <Link href="#" className="hover:text-white transition-colors">Movies</Link>
          <Link href="#" className="hover:text-white transition-colors">New & Popular</Link>
          <Link href="#" className="hover:text-white transition-colors">My List</Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden sm:flex items-center gap-6 mr-2">
          <Search className="w-5 h-5 text-zinc-300 cursor-pointer hover:text-white transition-colors" />
          <Bell className="w-5 h-5 text-zinc-300 cursor-pointer hover:text-white transition-colors" />
        </div>

        {/* Personalized Greeting */}
        <div className="hidden md:flex flex-col items-end mr-2">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Welcome back</span>
          <span className="text-sm font-bold text-white tracking-tight">{userData?.username || 'Streamer'}</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-md p-0 overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all hover:scale-105 active:scale-95 group">
              <Avatar className="h-10 w-10 rounded-none">
                <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'user'}/200/200`} alt="Profile" />
                <AvatarFallback className="rounded-none bg-zinc-800 text-xs font-bold text-primary">
                  {userData?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-zinc-950/95 backdrop-blur-xl border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200" align="end" sideOffset={10}>
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary font-black">
                      {userData?.username?.[0]?.toUpperCase() || 'S'}
                   </div>
                   <div className="flex flex-col">
                      <p className="text-sm font-black leading-none text-white uppercase tracking-tight">{userData?.username || 'Member'}</p>
                      <p className="text-[10px] leading-none text-zinc-500 mt-1 font-medium italic">
                        Premium Subscriber
                      </p>
                   </div>
                </div>
                <p className="text-[10px] text-zinc-600 truncate pt-2 border-t border-zinc-900">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-900" />
            <div className="p-1">
              <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-zinc-900 cursor-pointer py-3 rounded-sm transition-colors group">
                <User className="mr-3 h-4 w-4 text-zinc-500 group-focus:text-primary transition-colors" />
                <span className="font-medium">Edit Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-zinc-900 cursor-pointer py-3 rounded-sm transition-colors group">
                <Settings className="mr-3 h-4 w-4 text-zinc-500 group-focus:text-primary transition-colors" />
                <span className="font-medium">Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-zinc-900 cursor-pointer py-3 rounded-sm transition-colors group">
                <HelpCircle className="mr-3 h-4 w-4 text-zinc-500 group-focus:text-primary transition-colors" />
                <span className="font-medium">Help Center</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-zinc-900" />
            <div className="p-1">
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-primary focus:text-primary focus:bg-primary/10 cursor-pointer font-black py-4 rounded-sm transition-all uppercase text-xs tracking-widest justify-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out of StreamVerse</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
