import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BlogArticle = {
  id: number;
  date: string;
  title: string;
  verse: string;
  content: string;
  reflection: string;
};

export default function Admin() {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [title, setTitle] = useState("");
  const [verse, setVerse] = useState("");
  const [content, setContent] = useState("");
  const [reflection, setReflection] = useState("");

  const { data: articles = [] } = useQuery<BlogArticle[]>({
    queryKey: ['/api/devotions'],
    enabled: isAuthenticated,
  });

  const postMutation = useMutation({
    mutationFn: async (data: Omit<BlogArticle, 'id'>) => {
      return await apiRequest('POST', '/api/devotions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devotions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/devotions/today'] });
      setTitle("");
      setVerse("");
      setContent("");
      setReflection("");
      toast({
        title: "Article published!",
        description: "Your article has been added to the blog.",
      });
    },
    onError: () => {
      toast({
        title: "Error publishing article",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleLogin = () => {
    // Simple password check (you can change "admin123" to your desired password)
    if (password === "admin123") {
      setIsAuthenticated(true);
      setPassword("");
      toast({
        title: "Welcome!",
        description: "You're now logged in to the admin panel.",
      });
    } else {
      toast({
        title: "Incorrect password",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }
    postMutation.mutate({
      title,
      verse,
      content,
      reflection,
      date: new Date().toISOString().split('T')[0]
    } as any);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-6 h-6 text-purple-600" />
              <h1 className="text-2xl font-serif font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                Admin Access
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Enter your password to post articles
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              data-testid="input-admin-password"
              autoFocus
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#7a1fc3] to-[#61219a]"
              data-testid="button-admin-login"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-serif font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              Admin Panel
            </h1>
            <Button
              variant="outline"
              onClick={() => setIsAuthenticated(false)}
              data-testid="button-admin-logout"
            >
              Logout
            </Button>
          </div>
          <p className="text-muted-foreground text-lg">
            Publish new articles to the blog
          </p>
        </div>

        {/* New Article Form */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-serif font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              New Article
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Article Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold"
              data-testid="input-admin-title"
            />
            <Input
              placeholder="Bible Verse (optional)"
              value={verse}
              onChange={(e) => setVerse(e.target.value)}
              data-testid="input-admin-verse"
            />
            <Textarea
              placeholder="Article Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
              data-testid="textarea-admin-content"
            />
            <Textarea
              placeholder="Reflection (optional)"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="min-h-[120px] resize-none"
              data-testid="textarea-admin-reflection"
            />
            <Button
              onClick={handlePublish}
              disabled={postMutation.isPending}
              className="w-full bg-gradient-to-r from-[#7a1fc3] to-[#61219a]"
              data-testid="button-admin-publish"
            >
              {postMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Article'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Published Articles */}
        <div>
          <h3 className="text-2xl font-serif font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Published Articles
          </h3>

          {articles.length === 0 ? (
            <Card className="py-12">
              <CardContent className="text-center">
                <p className="text-muted-foreground">No articles published yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {new Date(article.date).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <h4 className="text-xl font-serif font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {article.title}
                      </h4>
                      {article.verse && <p className="text-sm font-semibold text-purple-600 mt-1">{article.verse}</p>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{article.content}</p>
                    {article.reflection && <p className="text-sm text-muted-foreground italic">{article.reflection}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
