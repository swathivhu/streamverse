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
    <div className="px-4 md:px-12 py-12">
      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-primary/10 p-8 flex flex-col justify-center items-center text-center space-y-4">
            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
            <h3 className="text-2xl font-bold text-white">AI Trailer Preview</h3>
            <p className="text-zinc-400 text-sm">Our AI analyzes your viewing history to suggest what you might like next in high-octane trailer snippets.</p>
            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-12"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Snippet"}
            </Button>
          </div>
          
          <div className="md:w-2/3 p-8 flex flex-col justify-center">
            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-6 h-6 text-primary" />
                  <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">Suggested For You</span>
                </div>
                <div className="p-6 bg-black rounded-xl border border-zinc-800">
                  <p className="text-xl md:text-2xl italic font-serif text-white leading-relaxed">
                    "{result.trailerDescription}"
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
                  <span className="px-2 py-1 bg-zinc-800 rounded">
                    Personalized: {result.isPersonalized ? "YES" : "NO"}
                  </span>
                  <span className="px-2 py-1 bg-zinc-800 rounded">
                    Logic: {result.reasoning}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-600 h-full py-12">
                <PlayCircle className="w-16 h-16 mb-4 opacity-20" />
                <p>Click the button to generate a snippet based on your history.</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
