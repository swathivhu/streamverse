"use client";

import { useState } from 'react';
import { generatePersonalizedTrailer, PersonalizedTrailerGenerationOutput } from '@/ai/flows/personalized-trailer-generation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, PlayCircle, Loader2, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function TrailerGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PersonalizedTrailerGenerationOutput | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userData } = useDoc(userRef);

  const handleGenerate = async () => {
    if (!user) {
      toast({ title: "Auth required", description: "Please log in to generate trailers.", variant: "destructive" });
      return;
    }

    setLoading(true);
    
    try {
      const output = await generatePersonalizedTrailer({
        userId: user.uid,
        viewingHistory: userData?.viewingHistory || []
      });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({ title: "AI Generation Error", description: "Could not generate trailer at this time.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl overflow-hidden shadow-2xl rounded-2xl">
        <div className="md:flex">
          <div className="md:w-[40%] bg-primary/5 p-10 flex flex-col justify-center items-center text-center space-y-6 border-r border-zinc-800/50">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center relative">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">AI Trailer Tool</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                Our advanced GenAI engine interprets your <span className="text-primary">viewing habits</span> to curate an exclusive preview just for you.
              </p>
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-black px-10 h-14 text-lg rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(184,29,36,0.4)]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing History...
                </div>
              ) : "Generate Preview"}
            </Button>
          </div>
          
          <div className="md:w-[60%] p-10 flex flex-col justify-center bg-black/20">
            {result ? (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <PlayCircle className="w-6 h-6 text-primary" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">StreamVerse AI Premiere</span>
                  </div>
                  <div className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${result.isPersonalized ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-500'}`}>
                    {result.isPersonalized ? 'Highly Personalized' : 'General Suggestion'}
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative p-8 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
                    <p className="text-2xl md:text-3xl italic font-serif text-zinc-100 leading-relaxed tracking-tight">
                      "{result.trailerDescription}"
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  <History className="w-3 h-3" />
                  <span>AI Reasoning: {result.reasoning}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-700 h-full py-16 space-y-4">
                <div className="w-24 h-24 border-2 border-zinc-800/50 border-dashed rounded-full flex items-center justify-center opacity-40">
                  <PlayCircle className="w-12 h-12" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-zinc-500">Ready for your premiere?</p>
                  <p className="text-sm">Click generate to see what the AI has found for you.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}