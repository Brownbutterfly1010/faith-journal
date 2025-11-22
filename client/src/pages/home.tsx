import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AppNavbar } from "@/components/app-navbar";
import { Loader2, Trash2 } from "lucide-react";

type Entry = {
  title: string;
  content: string;
  date: string;
  suggestion?: string;
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const { data: entries = [] } = useQuery<Entry[]>({
    queryKey: ['/api/entries'],
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      return await apiRequest('POST', '/api/entries', data);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/entries'] });
      setTitle("");
      setContent("");
      toast({
        title: "Entry saved! ✅",
        description: "Elara has suggested a verse for your reflection.",
      });
    },
    onError: () => {
      toast({
        title: "Error saving entry",
        description: "Please try again.",
        variant: "destructive",
      });
    }
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

  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate({ title: title || "Untitled", content });
  };

  const handleDelete = (date: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteMutation.mutate(date);
    }
  };

  const lastThreeEntries = [...entries].reverse().slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white to-gray-50 flex items-center justify-center shadow-sm border border-border">
              <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 34c0 0 7-10 18-10 11 0 20 11 20 11s-4-1-9 2c-5 3-27-3-29-3z" fill="#7a1fc3" />
                <path d="M43 22c0 0 4-3 9-1 0 0-4 2-6 5 0 0-3-2-3-4z" fill="#9b55d9" />
                <path d="M18 36c6-3 12-1 15 0 4 2 12 6 17 9 0 0-2 3-7 2-5-1-20-6-25-8-5-2-2-3 0-3z" fill="#7a1fc3"/>
                <path d="M29 18c0 0-7 6-13 6 0 0 8-7 13-6z" fill="#caa7f0"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Faith Journal with Elara
          </h1>
          <p className="text-muted-foreground text-lg">
            Your sacred space for reflection and divine guidance
          </p>
        </div>

        {/* Entry Form */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Input
              placeholder="Untitled"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4 text-lg font-semibold border-none shadow-none focus-visible:ring-0"
              data-testid="input-title"
            />
            <Textarea
              placeholder="Start writing your entry... Elara will suggest a verse for you"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none border-border"
              data-testid="textarea-content"
            />
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex-1 bg-gradient-to-r from-[#7a1fc3] to-[#61219a] hover:opacity-90"
                data-testid="button-save"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Entry'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <div>
          <h2 className="text-3xl font-serif font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Recent Reflections
          </h2>

          {lastThreeEntries.length === 0 ? (
            <Card className="py-16">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <svg className="w-20 h-20 mb-4 opacity-30" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6.5C3 5.67157 3.67157 5 4.5 5H19.5C20.3284 5 21 5.67157 21 6.5V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6.5Z" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M7 7V17" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                <h3 className="text-xl font-semibold mb-2">Begin your faith journey</h3>
                <p className="text-muted-foreground">Write your first entry to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {lastThreeEntries.map((entry) => (
                <Card key={entry.date} className="overflow-hidden" data-testid={`card-entry-${entry.date}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-serif font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {entry.title}
                        </h3>
                        <small className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </small>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(entry.date)}
                        data-testid={`button-delete-${entry.date}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="whitespace-pre-wrap text-foreground/90 text-sm">{entry.content}</p>
                    
                    {entry.suggestion && (
                      <div className="pt-4 border-t border-border mt-4">
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-sm italic text-purple-900 leading-relaxed">{entry.suggestion}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <AppNavbar />
    </div>
  );
}
