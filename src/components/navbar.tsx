"use client";

import { useState } from 'react';
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
    <nav className="fixed top-0 z-50 w-full bg-black border-b border-white/5 h-20 flex items-center shadow-2xl transition-all duration-300">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-20 w-full flex items-center justify-between h-full">
        <div className="flex items-center gap-10 h-full">
          <Link href="/home" className="flex items-center gap-2 group shrink-0 py-2">
            <Clapperboard className="w-8 h-8 text-primary" />
            <span className="text-2xl font-black text-primary tracking-tighter uppercase">
              StreamVerse
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 h-full text-[15px] font-semibold tracking-widest uppercase">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={cn(
                    "transition-colors duration-200 relative flex items-center h-full",
                    isActive ? "text-white" : "text-zinc-400 hover:text-zinc-100"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[4px] bg-primary shadow-[0_0_15px_rgba(229,9,20,0.6)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-8 h-full">
          <div className="flex items-center gap-6">
            <Search className="w-5 h-5 text-white cursor-pointer hover:text-zinc-300 transition-colors" />
            <div className="relative cursor-pointer group">
              <Bell className="w-5 h-5 text-white group-hover:text-zinc-300 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-black" />
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end shrink-0 pl-4">
            <span className="text-[11px] font-semibold text-white tracking-widest uppercase">{userData?.username || 'MEMBER'}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-md p-0 overflow-hidden hover:opacity-80 transition-opacity">
                <Avatar className="h-full w-full rounded-md border border-white/10">
                  <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'user'}/200/200`} alt="Profile" className="object-cover" />
                  <AvatarFallback className="bg-zinc-900 text-xs font-bold text-zinc-400">
                    {userData?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'S'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-black border-zinc-800 shadow-2xl p-2" align="end" sideOffset={12}>
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-black text-white uppercase">{userData?.username || 'Member'}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Premium Subscription</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-900 cursor-pointer py-3 px-3 rounded-md text-[11px] font-bold uppercase tracking-widest">
                <User className="mr-3 h-4 w-4" /> Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-900 cursor-pointer py-3 px-3 rounded-md text-[11px] font-bold uppercase tracking-widest">
                <Settings className="mr-3 h-4 w-4" /> Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-primary focus:text-primary focus:bg-primary/10 cursor-pointer py-3 px-3 rounded-md text-[11px] font-bold uppercase tracking-widest"
              >
                <LogOut className="mr-3 h-4 w-4" /> Sign Out of StreamVerse
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
