"use client";

import { useState } from 'react';
import { generatePersonalizedTrailer, PersonalizedTrailerGenerationOutput } from '@/ai/flows/personalized-trailer-generation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, PlayCircle, Loader2 } from 'lucide-react';
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
    <div className="py-8">
      <Card className="bg-zinc-900/20 border-white/5 overflow-hidden rounded-xl">
        <div className="md:flex">
          <div className="md:w-[40%] bg-white/[0.02] p-8 flex flex-col justify-center items-center text-center space-y-6 border-r border-white/5">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">AI Premiere</h3>
              <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider leading-relaxed">
                Curated movie previews based on your unique history.
              </p>
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-10 text-xs uppercase tracking-widest rounded-md transition-transform active:scale-95"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Curating...
                </div>
              ) : "Generate"}
            </Button>
          </div>
          
          <div className="md:w-[60%] p-8 flex flex-col justify-center bg-transparent min-h-[250px]">
            {result ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-primary" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">StreamVerse AI</span>
                  </div>
                  <div className={`text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${result.isPersonalized ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-500'}`}>
                    {result.isPersonalized ? 'Personalized' : 'General'}
                  </div>
                </div>
                <div className="relative">
                  <p className="text-lg md:text-xl font-medium text-zinc-100 leading-tight uppercase tracking-tight italic">
                    "{result.trailerDescription}"
                  </p>
                </div>
                <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
                  Reasoning: {result.reasoning}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-800 space-y-4">
                <PlayCircle className="w-10 h-10 opacity-20" />
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Ready for your preview?</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
