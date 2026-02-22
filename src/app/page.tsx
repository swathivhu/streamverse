"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2, Clapperboard } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        router.push('/home');
      } else {
        router.push('/login');
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
        <p className="text-zinc-600 text-sm font-medium">Verifying session...</p>
      </div>
    </div>
  );
}
