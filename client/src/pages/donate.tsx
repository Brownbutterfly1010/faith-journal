import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLocation } from "wouter";
import { AppNavbar } from "@/components/app-navbar";
import { ChevronLeft, Heart } from "lucide-react";

export default function Donate() {
  const [, navigate] = useLocation();

  const donations = [
    { amount: 3, label: "Small Coffee ☕", link: "https://buymeacoffee.com/ThandoBrown" },
    { amount: 5, label: "Medium Coffee ☕☕", link: "https://buymeacoffee.com/ThandoBrown" },
    { amount: 10, label: "Large Coffee ☕☕☕", link: "https://buymeacoffee.com/ThandoBrown" },
    { amount: 20, label: "Coffee & Pastry 🥐", link: "https://buymeacoffee.com/ThandoBrown" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pb-32">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-serif font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              Support Faith Journal
            </h1>
            <p className="text-sm text-gray-500 mt-1">Help us keep this ministry free</p>
          </div>
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="icon"
            className="text-purple-600"
            data-testid="button-back-donate"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Welcome Message */}
        <Card className="mb-8 border-purple-100 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Heart className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-foreground/90 leading-relaxed">
                  Your support helps us maintain this free spiritual companion platform. Every coffee fuels our mission to help people deepen their faith journey. Thank you for believing in this ministry!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donation Options */}
        <div className="space-y-3 mb-8 animate-fade-in">
          <h2 className="text-lg font-serif font-semibold mb-4">Choose Your Support Level</h2>
          {donations.map((donation) => (
            <a
              key={donation.amount}
              href={donation.link}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <Button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-lg py-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                data-testid={`button-donate-${donation.amount}`}
              >
                ☕ {donation.label} — ${donation.amount}
              </Button>
            </a>
          ))}
        </div>

        {/* One-Time Gift */}
        <Card className="border-purple-100 animate-fade-in">
          <CardHeader>
            <h3 className="font-serif text-lg">Custom Amount</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Want to give a custom amount? Visit our Buy Me a Coffee page.</p>
            <a
              href="https://buymeacoffee.com/ThandoBrown"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <Button
                variant="outline"
                className="w-full border-purple-200 hover:bg-purple-50 text-purple-700"
                data-testid="button-custom-donation"
              >
                Visit Buy Me a Coffee →
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Thank You Message */}
        <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200 text-center animate-fade-in">
          <p className="text-sm text-purple-900">
            Thank you for your generous support! Your contribution helps us continue this mission.
          </p>
        </div>
      </div>

      <AppNavbar />
    </div>
  );
}
