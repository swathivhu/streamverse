"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Clapperboard } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast({ title: "Error", description: "Email and password are required.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast({ title: "Login Successful", description: "Welcome back to StreamVerse!" });
      router.push('/home');
    } catch (error: any) {
      console.error(error);
      let message = "Invalid email or password.";
      if (error.code === 'auth/user-not-found') message = "No account found with this email.";
      if (error.code === 'auth/wrong-password') message = "Incorrect password.";
      
      toast({ title: "Login Failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60" />
      <Card className="w-full max-w-md bg-black/80 border-none relative z-10 p-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-2 rounded-lg">
              <Clapperboard className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white" htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="Enter your email" 
                className="bg-zinc-800 border-zinc-700 text-white h-12"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white" htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="bg-zinc-800 border-zinc-700 text-white h-12"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg transition-all" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 items-center">
          <p className="text-zinc-400 text-sm">
            New to StreamVerse? <Link href="/register" className="text-white hover:underline">Sign up now</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
