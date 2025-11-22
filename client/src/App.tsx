import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import EntriesAll from "@/pages/entries-all";
import Bible from "@/pages/bible";
import Media from "@/pages/media";
import AuthorsBlog from "@/pages/authors-blog";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/entries" component={EntriesAll}/>
      <Route path="/bible" component={Bible}/>
      <Route path="/media" component={Media}/>
      <Route path="/authors-blog" component={AuthorsBlog}/>
      <Route path="/admin" component={Admin}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
