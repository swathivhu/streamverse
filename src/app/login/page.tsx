"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { hashPassword } from '@/lib/crypto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Clapperboard } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.username || !formData.password) {
      toast({ title: "Error", description: "Username and password are required.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, "users", formData.username);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        toast({ title: "Error", description: "User not found.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const userData = userSnap.data();
      const inputHash = await hashPassword(formData.password);

      if (inputHash === userData.password) {
        toast({ title: "Login Successful", description: "Welcome back to StreamVerse!" });
        
        // Store session (simplified for scaffold)
        localStorage.setItem('streamverse_user', JSON.stringify({
          userId: userData.userId,
          username: userData.username,
          email: userData.email,
          viewingHistory: userData.viewingHistory || []
        }));

        router.push('/home');
      } else {
        toast({ title: "Login Failed", description: "Invalid password.", variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
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
              <Label className="text-white" htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="Enter your username" 
                className="bg-zinc-800 border-zinc-700 text-white h-12"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
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
                  Checking...
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