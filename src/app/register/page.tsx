
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Clapperboard } from 'lucide-react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.username || !formData.email || !formData.phone || !formData.password) {
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
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Store additional details in Firestore (using the recommended non-blocking pattern)
      const userRef = doc(db, "users", user.uid);
      const userData = {
        id: user.uid,
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phone,
        registrationDate: new Date().toISOString(),
        viewingHistory: ['Interstellar Journey', 'The Dark Night', 'Robot Dreams'],
      };

      // Non-blocking write to Firestore
      setDoc(userRef, userData).catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      toast({ title: "Success", description: "Account created successfully!" });
      router.push('/home');
    } catch (error: any) {
      // Map Firebase error codes to user-friendly messages
      let errorMessage = "Could not complete registration.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already associated with an account.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "The password is too weak. Please use at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "The email address is invalid.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/password accounts are not enabled.";
      }

      toast({ 
        title: "Registration Failed", 
        description: errorMessage, 
        variant: "destructive" 
      });
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
