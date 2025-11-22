import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppNavbar } from "@/components/app-navbar";
import { Trash2, Star, ExternalLink } from "lucide-react";
import { SiSpotify } from "react-icons/si";
import { queryClient } from "@/lib/queryClient";
import movieBannerImg from "@assets/IMG_2028_1763793279448.jpeg";

interface Playlist {
  id: string;
  name: string;
  url: string;
  description: string;
  date: string;
}

interface Movie {
  title: string;
  description: string;
  studio: string;
  cover: string;
  rating: number;
  imdbUrl?: string;
}

const FEATURED_PLAYLIST_ID = "62IwPlp6UWpgqWVKfAVgV7";

const CHRISTIAN_MOVIES: Movie[] = [
  {
    title: "The Chosen",
    description: "A series about the lives of the disciples of Jesus Christ.",
    studio: "Dallas Jenkins Productions",
    cover: "https://m.media-amazon.com/images/M/MV5BZjZmZjZkZjQtMTdjOC00OWFkLWI5YjAtZTU4OGQ1NjQ1MzlhXkEyXkFqcGc@._V1_SX300.jpg",
    rating: 8.8,
    imdbUrl: "https://www.imdb.com/title/tt11618662/"
  },
  {
    title: "The Case for Christ",
    description: "A true story of faith, doubt, and transformation.",
    studio: "Faith Movies",
    cover: "https://m.media-amazon.com/images/M/MV5BOTA0OTM2MGItZWFiYS00NjBjLWI3MjItOTk4ZGE4MjMxYzljXkEyXkFqcGc@._V1_SX300.jpg",
    rating: 7.0,
    imdbUrl: "https://www.imdb.com/title/tt4889194/"
  },
  {
    title: "God's Not Dead",
    description: "A college student defends his faith in philosophy class.",
    studio: "Faith Movies",
    cover: "https://m.media-amazon.com/images/M/MV5BMzMyODc2ZjMtZmM1YS00YzExLWJlZTEtOTkzMGJiZjA2ZTBjXkEyXkFqcGc@._V1_SX300.jpg",
    rating: 5.4,
    imdbUrl: "https://www.imdb.com/title/tt2528814/"
  },
  {
    title: "War Room",
    description: "A powerful story about the impact of prayer on families.",
    studio: "Kendrick Brothers / Sony Pictures",
    cover: "https://m.media-amazon.com/images/M/MV5BMTZjZTA0ZTItZWY3Ny00YzEyLWJhODMtMzQzOWM3ZjM0OTMyXkEyXkFqcGc@._V1_SX300.jpg",
    rating: 8.3,
    imdbUrl: "https://www.imdb.com/title/tt5650358/"
  },
  {
    title: "I Can Only Imagine",
    description: "The inspiring true story of Bart Millard and his hit song.",
    studio: "Lionsgate / Roadside Attractions",
    cover: "https://m.media-amazon.com/images/M/MV5BNjI4ZjZkZjctMDkyOS00YjIyLTg5MzgtM2YzYTEzOWM5MjJjXkEyXkFqcGc@._V1_SX300.jpg",
    rating: 8.2,
    imdbUrl: "https://www.imdb.com/title/tt7529248/"
  },
  {
    title: "Fireproof",
    description: "A firefighter's marriage is tested by faith and commitment.",
    studio: "Kendrick Brothers / Sony Pictures",
    cover: "https://m.media-amazon.com/images/M/MV5BZGU4YzBiNDctY2Y5YS00YjNlLWIyMDktMWY3YzI4ZDJkZTc1XkEyXkFqcGc@._V1_SX300.jpg",
    rating: 7.3,
    imdbUrl: "https://www.imdb.com/title/tt1129569/"
  },
  {
    title: "Courageous",
    description: "A group of men commit to a resolution to be devoted fathers.",
    studio: "Kendrick Brothers / Sony Pictures",
    cover: "https://m.media-amazon.com/images/M/MV5BMzU4ZTViNTctZjI4MC00MDMyLWI5ODMtMDk2NWM4M2I4MDQyXkEyXkFqcGc@._V1_SX300.jpg",
    rating: 7.5,
    imdbUrl: "https://www.imdb.com/title/tt1631707/"
  },
  {
    title: "Heaven Is for Real",
    description: "A son's near-death experience reveals the reality of heaven.",
    studio: "Sony Pictures",
    cover: "https://m.media-amazon.com/images/M/MV5BMzAwMjgyN2YtMzYxYS00MzAxLTlmZmItMjJhZjA2ZjQ1YjQyXkEyXkFqcGc@._V1_SX300.jpg",
    rating: 6.9,
    imdbUrl: "https://www.imdb.com/title/tt2101129/"
  },
  {
    title: "Faith Like Potatoes",
    description: "A former criminal transforms his life through faith.",
    studio: "Affirm Films",
    cover: "https://m.media-amazon.com/images/M/MV5BMTU2MzM1MTgtOTA4NC00OGQ3LWI5ZjgtMWZlZjliMTQ0ZWMyXkEyXkFqcGc@._V1_SX300.jpg",
    rating: 7.8,
    imdbUrl: "https://www.imdb.com/title/tt0908854/"
  },
  {
    title: "Risen",
    description: "A Roman tribune investigates the resurrection of Jesus.",
    studio: "Sony Pictures",
    cover: "https://m.media-amazon.com/images/M/MV5BZjg0MDQ5MDItNWY4Yy00ZTQ4LThhNTMtN2YzMGQ5YmRmM2JiXkEyXkFqcGc@._V1_SX300.jpg",
    rating: 7.1,
    imdbUrl: "https://www.imdb.com/title/tt4581056/"
  }
];

export default function Media() {
  const { data: playlists = [] } = useQuery<Playlist[]>({
    queryKey: ['/api/playlists'],
    queryFn: async () => {
      const res = await fetch('/api/playlists');
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/playlists/${id}`, { method: 'DELETE' });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playlists'] });
    },
  });

  // Get today's movie based on date
  const getTodaysMovie = () => {
    const today = new Date().getDate();
    return CHRISTIAN_MOVIES[today % CHRISTIAN_MOVIES.length];
  };

  const todaysMovie = getTodaysMovie();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pb-32">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Featured
          </h1>
          <p className="text-gray-600 text-lg">
            Music & Inspiration
          </p>
        </div>

        {/* Featured Playlist Island */}
        <div className="mb-8">
          <Card className="bg-white border-purple-100 overflow-hidden">
            <CardContent className="p-6">
              <iframe
                src={`https://open.spotify.com/embed/playlist/${FEATURED_PLAYLIST_ID}`}
                width="100%"
                height="380"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                data-testid="iframe-featured-playlist"
              />
            </CardContent>
          </Card>
        </div>

        {/* Movie of the Day Island */}
        <div className="mb-8">
          <Card className="bg-white border-purple-100 overflow-hidden">
            <CardContent className="p-0">
              {/* Movie Banner - Full Width Header */}
              <div className="h-64 bg-purple-100 flex items-center justify-center border-b border-purple-100">
                <img 
                  src={movieBannerImg}
                  alt="Faith Movies"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Movie Details */}
              <div className="p-6">
                <h3 className="text-2xl font-serif font-bold text-purple-700 mb-1">{todaysMovie.title}</h3>
                <p className="text-xs text-gray-600 font-medium mb-3">{todaysMovie.studio}</p>
                
                {/* IMDb Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(todaysMovie.rating / 2)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-yellow-600">IMDb {todaysMovie.rating}/10</span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{todaysMovie.description}</p>
                
                {todaysMovie.imdbUrl && (
                  <a
                    href={todaysMovie.imdbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                    data-testid={`link-imdb-${todaysMovie.title}`}
                  >
                    View on IMDb
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <p className="text-xs text-purple-600 font-medium mt-3">Updated daily</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Your Playlists Section - Island Style */}
        {playlists.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-4 text-purple-700">Your Playlists</h2>
            <div className="space-y-4">
              {playlists.map((playlist) => (
                <Card key={playlist.id} className="bg-white border-purple-100 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1" data-testid={`text-playlist-name-${playlist.id}`}>
                          {playlist.name}
                        </h3>
                        {playlist.description && (
                          <p className="text-sm text-gray-600 mb-3">{playlist.description}</p>
                        )}
                        <a
                          href={playlist.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                          data-testid={`link-playlist-${playlist.id}`}
                        >
                          Open in Spotify
                        </a>
                        <p className="text-xs text-gray-400 mt-2">Added {new Date(playlist.date).toLocaleDateString()}</p>
                      </div>
                      <Button
                        onClick={() => deleteMutation.mutate(playlist.id)}
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:bg-red-50"
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-playlist-${playlist.id}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <AppNavbar />
    </div>
  );
}
