import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Home from "@/pages/home";
import EntriesAll from "@/pages/entries-all";
import Bible from "@/pages/bible";
import Media from "@/pages/media";
import AuthorsBlog from "@/pages/authors-blog";
import Admin from "@/pages/admin";
import Chat from "@/pages/chat";
import Donate from "@/pages/donate";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/entries" component={EntriesAll}/>
      <Route path="/bible" component={Bible}/>
      <Route path="/media" component={Media}/>
      <Route path="/authors-blog" component={AuthorsBlog}/>
      <Route path="/chat" component={Chat}/>
      <Route path="/donate" component={Donate}/>
      <Route path="/admin" component={Admin}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function NameModal() {
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("userDisplayName");
    if (!savedName) {
      setShowModal(true);
    }
  }, []);

  const handleSubmit = () => {
    if (name.trim()) {
      localStorage.setItem("userDisplayName", name.trim());
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <Card className="w-96 animate-slide-up border-0 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold mb-3 bg-gradient-to-r from-[#7a1fc3] to-[#9b55d9] bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome to Faith Journal
            </h2>
            <p className="text-gray-500">Let's get to know you better</p>
          </div>
          <div className="space-y-4">
            <Input
              placeholder="What's your name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
              data-testid="input-name-modal"
              className="text-center text-lg"
            />
            <Button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-[#7a1fc3] to-[#61219a] hover:opacity-90 text-white font-semibold"
              data-testid="button-start-journal"
            >
              Start My Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NameModal />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
