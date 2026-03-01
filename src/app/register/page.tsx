
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
import { Clapperboard, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (isSubmitting) return;

    // Strict validation
    if (!formData.username.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password.trim()) {
      toast({ title: "Validation Error", description: "All sectors must be populated.", variant: "destructive" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ title: "Validation Error", description: "Identity format is invalid.", variant: "destructive" });
      return;
    }

    if (formData.phone.length < 10) {
      toast({ title: "Validation Error", description: "Access line must be at least 10 digits.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Initiating profile creation for:", formData.email);
      
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      console.log("Auth success. UID:", user.uid);

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
        console.error("Firestore non-blocking error:", error);
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      toast({ title: "Identity Verified", description: "Welcome to StreamVerse. Access granted." });
      
      // Redirect after a short delay for visual stability
      setTimeout(() => {
        router.push('/home');
      }, 500);

    } catch (error: any) {
      console.error("Registration fatal error:", error);
      let errorMessage = "Profile creation failed. Please check your credentials.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This identity is already active in the system.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Access key strength is insufficient.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Identity format is rejected.";
      }

      toast({ 
        title: "System Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
      setIsSubmitting(false); // Allow retry on failure
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden selection:bg-primary selection:text-white">
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 animate-hero-zoom" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
      
      <div className="w-full max-w-md px-4 relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center mb-8">
           <Link href="/" className="flex items-center gap-3">
            <Clapperboard className="w-12 h-12 text-primary shadow-[0_0_20px_rgba(229,9,20,0.3)]" />
            <span className="text-3xl font-black text-white uppercase tracking-tighter">StreamVerse</span>
          </Link>
        </div>

        <Card className="bg-black/80 border-white/5 shadow-2xl backdrop-blur-xl rounded-sm border-t-2 border-t-primary">
          <CardHeader className="text-center pt-10">
            <CardTitle className="text-3xl font-black text-white uppercase tracking-tight">Create Profile</CardTitle>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-2">Initialize your cinematic identity</p>
          </CardHeader>
          <CardContent className="pt-8 px-10">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest" htmlFor="username">Public Handle</Label>
                <Input 
                  id="username" 
                  placeholder="CHOOSE_IDENTITY" 
                  className="bg-zinc-900/50 border-white/5 text-white h-12 rounded-none placeholder:text-zinc-800 font-bold"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest" htmlFor="email">Email Identity</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="ID@STREAMVERSE.COM" 
                  className="bg-zinc-900/50 border-white/5 text-white h-12 rounded-none placeholder:text-zinc-800 font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest" htmlFor="phone">Access Line</Label>
                <Input 
                  id="phone" 
                  placeholder="10 DIGIT STRING" 
                  className="bg-zinc-900/50 border-white/5 text-white h-12 rounded-none placeholder:text-zinc-800 font-bold"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest" htmlFor="password">Access Key</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-zinc-900/50 border-white/5 text-white h-12 rounded-none placeholder:text-zinc-800 font-bold"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black py-7 text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-primary/20 mt-4 rounded-none" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin" /> Initializing...
                  </span>
                ) : "Create Identity"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pb-10 pt-6">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
              Existing identity? <Link href="/login" className="text-white hover:text-primary transition-colors border-b border-zinc-800 hover:border-primary">Log in here</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
