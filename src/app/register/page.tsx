"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { hashPassword } from '@/lib/crypto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Clapperboard } from 'lucide-react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (Object.values(formData).some(val => !val)) {
      toast({ title: "Error", description: "All fields are mandatory.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ title: "Error", description: "Invalid email format.", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (formData.phone.length !== 10 || isNaN(Number(formData.phone))) {
      toast({ title: "Error", description: "Phone number must be 10 digits.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, "users", formData.username);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        toast({ title: "Error", description: "Username already taken.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const hashedPassword = await hashPassword(formData.password);
      
      await setDoc(userDocRef, {
        userId: formData.userId,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: hashedPassword,
        viewingHistory: ['Interstellar Journey', 'The Dark Night', 'Robot Dreams'], // Initial history for AI demo
        createdAt: new Date().toISOString(),
      });

      toast({ title: "Success", description: "Registration successful! You can now log in." });
      router.push('/login');
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60" />
      <Card className="w-full max-w-md bg-black/80 border-none relative z-10 p-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-2 rounded-lg">
              <Clapperboard className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white">Join StreamVerse</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white" htmlFor="userId">User ID</Label>
              <Input 
                id="userId" 
                placeholder="Unique ID" 
                className="bg-zinc-800 border-zinc-700 text-white"
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white" htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="Choose a username" 
                className="bg-zinc-800 border-zinc-700 text-white"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white" htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                className="bg-zinc-800 border-zinc-700 text-white"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white" htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="10 digit number" 
                className="bg-zinc-800 border-zinc-700 text-white"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white" htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="bg-zinc-800 border-zinc-700 text-white"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg transition-all" disabled={loading}>
              {loading ? "Registering..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-zinc-400 text-sm">
            Already a member? <Link href="/login" className="text-white hover:underline">Log in now</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}