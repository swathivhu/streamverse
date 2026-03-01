"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Clapperboard, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  /**
   * Guard logic: If the user is already authenticated, they should not 
   * be able to access the login page. Redirect them back to the root dispatch.
   */
  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.email.trim() || !formData.password.trim()) {
      toast({ 
        title: "Missing Credentials", 
        description: "Please provide your identity and access key.", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast({ 
        title: "Access Granted", 
        description: "Welcome back to StreamVerse." 
      });
      // Navigation is handled automatically by the useEffect guard above
    } catch (error: any) {
      console.error("Login attempt failed:", error);
      let message = "Invalid email or password.";
      if (error.code === 'auth/invalid-credential') message = "The credentials provided were rejected by the system.";
      
      toast({ 
        title: "Authentication Failed", 
        description: message, 
        variant: "destructive" 
      });
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || (user && !isUserLoading)) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-3 animate-pulse">
          <Clapperboard className="w-12 h-12 text-primary" />
          <span className="text-4xl font-black text-primary tracking-tighter uppercase">StreamVerse</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-zinc-800 animate-spin" />
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Preparing Environment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black overflow-hidden selection:bg-primary selection:text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40 scale-110 animate-hero-zoom" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&q=80')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black z-10" />
      
      <div className="w-full max-w-md px-4 relative z-20 animate-in fade-in zoom-in-95 duration-1000 slide-in-from-bottom-10">
        <div className="flex justify-center mb-12">
          <Link href="/" className="flex items-center gap-4 group">
            <Clapperboard className="w-14 h-14 text-primary group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(229,9,20,0.4)]" />
            <div className="flex flex-col">
              <span className="text-4xl font-black text-white leading-none tracking-tighter uppercase">
                Stream<span className="text-primary">Verse</span>
              </span>
              <span className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase text-right">Entertainment</span>
            </div>
          </Link>
        </div>

        <Card className="bg-black/90 border-white/5 shadow-2xl backdrop-blur-xl rounded-sm overflow-hidden border-t-2 border-t-primary">
          <CardHeader className="space-y-3 pt-10 px-10">
            <CardTitle className="text-3xl font-black text-white text-center uppercase tracking-tight">Sign In</CardTitle>
            <p className="text-zinc-500 text-center text-[10px] font-black uppercase tracking-widest leading-relaxed">
              Step into the future of <br /> cinematic storytelling
            </p>
          </CardHeader>
          <CardContent className="pt-8 px-10 pb-10">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-3">
                <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]" htmlFor="email">Email Identity</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="IDENTITY@STREAMVERSE.COM" 
                  className="bg-zinc-900/50 border-white/5 text-white h-14 focus:ring-primary focus:border-primary rounded-none transition-all placeholder:text-zinc-800 font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]" htmlFor="password">Access Key</Label>
                  <Link href="#" className="text-[10px] text-zinc-600 hover:text-primary transition-colors font-black uppercase tracking-widest">Forgot?</Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-zinc-900/50 border-white/5 text-white h-14 focus:ring-primary focus:border-primary rounded-none transition-all placeholder:text-zinc-800 font-bold"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 text-sm uppercase tracking-[0.2em] rounded-none transition-all active:scale-95 shadow-xl shadow-primary/20" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-4">
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </span>
                ) : "Enter Vault"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 items-center border-t border-white/5 pt-10 pb-10 bg-white/[0.01]">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
              New to the system? <Link href="/register" className="text-white hover:text-primary transition-colors border-b border-zinc-800 hover:border-primary">Create Profile</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
