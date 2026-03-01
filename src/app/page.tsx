"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2, Clapperboard } from 'lucide-react';

/**
 * RootPage acts as the primary traffic controller for StreamVerse.
 * It observes the global authentication state and dispatches users
 * to either the secure /home dashboard or the /login gateway.
 */
export default function RootPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // Only attempt redirection once the initial auth state is determined
    if (!isUserLoading) {
      if (user) {
        // Authenticated users are sent to the home experience
        router.replace('/home');
      } else {
        // Unauthenticated users are sent to login
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-2 animate-pulse">
        <Clapperboard className="w-12 h-12 text-primary" />
        <span className="text-4xl font-black text-primary tracking-tighter uppercase">StreamVerse</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 text-zinc-700 animate-spin" />
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Verifying Identity</p>
      </div>
    </div>
  );
}
