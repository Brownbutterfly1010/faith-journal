import { useLocation } from "wouter";
import { BookOpen, Home, Sparkles, Book, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppNavbar() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/entries', label: 'Entries', icon: BookOpen },
    { path: '/bible', label: 'Bible', icon: Book },
    { path: '/authors-blog', label: 'Blog', icon: Sparkles },
    { path: '/media', label: 'Featured', icon: Star }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Button
              key={path}
              asChild
              variant="ghost"
              className={`flex flex-col items-center gap-2 h-20 rounded-none ${
                isActive(path) 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <a href={path} className="flex flex-col items-center gap-2 w-full h-full justify-center no-underline">
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{label}</span>
              </a>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
