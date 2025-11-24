import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppNavbar } from "@/components/app-navbar";
import { Trash2, Wand2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type Entry = {
  title: string;
  content: string;
  date: string;
  suggestion?: string;
};

export default function EntriesAll() {
  const [, navigate] = useLocation();
  const [isSpinning, setIsSpinning] = useState(false);
  const { toast } = useToast();

  const handleChatClick = () => {
    setIsSpinning(true);
    setTimeout(() => navigate('/chat'), 300);
  };

  const { data: entries = [] } = useQuery<Entry[]>({
    queryKey: ['/api/entries'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (date: string) => {
      return await apiRequest('DELETE', `/api/entries/${encodeURIComponent(date)}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/entries'] });
      toast({
        title: "Entry deleted",
      });
    }
  });

  const handleDelete = (date: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteMutation.mutate(date);
    }
  };

  const sortedEntries = [...entries].reverse();

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            All Your Entries
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse through all your faith journal reflections
          </p>
        </div>

        {/* Entries List */}
        {sortedEntries.length === 0 ? (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <svg className="w-20 h-20 mb-4 opacity-30" viewBox="0 0 24 24" fill="none">
                <path d="M3 6.5C3 5.67157 3.67157 5 4.5 5H19.5C20.3284 5 21 5.67157 21 6.5V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6.5Z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7 7V17" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              <h3 className="text-xl font-semibold mb-2">No entries yet</h3>
              <p className="text-muted-foreground">Start journaling on the home page</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedEntries.map((entry) => (
              <Card key={entry.date} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-serif font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {entry.title}
                      </h3>
                      <small className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </small>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(entry.date)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="whitespace-pre-wrap text-foreground/90 text-sm leading-relaxed">{entry.content}</p>
                  
                  {entry.suggestion && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs font-semibold text-purple-600 mb-2">Elara's Guidance:</p>
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 rounded-lg border border-purple-200">
                        <p className="text-sm italic text-purple-900">{entry.suggestion}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Elara Chat Button */}
      <button
        onClick={handleChatClick}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-[#7a1fc3] to-[#61219a] rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center z-40 group"
        data-testid="button-elara-chat"
        title="Chat with Elara"
      >
        <Wand2 className={`w-8 h-8 text-white ${isSpinning ? 'animate-spin' : 'group-hover:animate-spin'}`} />
      </button>

      <AppNavbar />
    </div>
  );
}
