import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppNavbar } from "@/components/app-navbar";
import { X } from "lucide-react";
import bannerImg from "@assets/IMG_2024_1763791299911.jpeg";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  content: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Finding Peace in Scripture",
    author: "Sarah Mitchell",
    date: "November 20, 2025",
    excerpt: "Discover how daily devotion to God's word brings peace to our hearts.",
    content: "In times of uncertainty, turning to Scripture provides us with wisdom and comfort. When we read God's word daily, we invite His presence into our lives, allowing His peace to wash over us. The Psalmist reminds us that 'Great peace have those who love your law, and nothing can make them stumble.' This journey of discovering peace through Scripture is not just about reading words on a page—it's about opening our hearts to transformation. As we meditate on God's truth, we begin to understand His character more deeply. We learn that He is faithful, loving, and ever-present in our lives. Through consistent engagement with Scripture, we develop a deeper relationship with our Creator. Each verse becomes a personal message from God, speaking directly to our circumstances and needs. The peace that comes from this connection is not a peace that the world can offer. It's a supernatural peace that guards our hearts and minds. When we are troubled, anxious, or afraid, we can turn to Scripture and find comfort in God's promises. This practice has sustained believers throughout the ages and continues to be a source of strength and hope today."
  },
  {
    id: "2",
    title: "The Power of Prayer",
    author: "James Johnson",
    date: "November 18, 2025",
    excerpt: "Learn how consistent prayer transforms our relationship with God.",
    content: "Prayer is not just asking; it's a conversation with our Creator. Through prayer, we align our will with God's, opening ourselves to His guidance and grace. Many of us approach prayer as a checklist—a series of requests to be made and then forgotten. But true prayer is much more profound. It's a relationship-building exercise that changes not only our circumstances but also our hearts. When we pray with authenticity and vulnerability, we invite God into the deepest parts of our lives. We share our fears, our hopes, our dreams, and our struggles. And in return, we experience God's love, compassion, and wisdom. Prayer can take many forms. It might be the quiet whisper of gratitude as you sip your morning coffee. It could be the urgent cry for help during a crisis. It might be the joyful celebration of answered prayers or the honest confusion when things don't turn out as expected. All of these prayers matter. God hears each one and responds in ways that are always for our ultimate good. The Bible encourages us to 'pray without ceasing,' not because God needs to hear our constant requests, but because our constant connection to Him transforms us. As we develop a consistent prayer life, we become more attuned to God's voice, more confident in His promises, and more aligned with His purposes."
  },
  {
    id: "3",
    title: "Living Out Your Faith",
    author: "Emma Thompson",
    date: "November 15, 2025",
    excerpt: "Practical ways to demonstrate your Christian faith in everyday life.",
    content: "Faith is not just a belief—it's a lifestyle. Living out your faith means serving others, showing love, and being a light in this world. In our daily lives, we encounter countless opportunities to demonstrate our faith. These might be small moments of kindness, acts of service, or speaking truth with compassion. It might be choosing forgiveness over bitterness, choosing integrity in business dealings, or choosing to comfort someone who is suffering. Living out our faith can be challenging in a world that often operates by different values. We might face pressure to compromise our principles, to prioritize profit over people, or to remain silent when we should speak. Yet Jesus calls us to be bold witnesses of His love and truth. One of the most powerful ways to live out our faith is through authentic relationships. When others see us living with integrity, treating people with dignity and respect, and extending grace to those who have wronged us, they see Christ in action. Our lives become a testimony to God's transforming power. Additionally, living out our faith involves active service. Jesus taught us to feed the hungry, clothe the naked, visit the prisoner, and care for the sick. These are not optional suggestions—they are commands rooted in love. As we serve others, we serve Christ Himself. Finally, living out our faith requires constant prayer, study of Scripture, and connection to a community of believers. We cannot do this alone. We need encouragement from others, accountability, and the strength that comes from worshipping together."
  },
];

export default function AuthorsBlog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pb-32">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Blog
          </h1>
          <p className="text-gray-600 text-lg">
            Christian Insights & Stories
          </p>
        </div>

        {/* Banner Island */}
        <div className="mb-8">
          <Card className="bg-white border-purple-100 overflow-hidden">
            <CardContent className="p-0">
              <div className="h-48 bg-purple-100 flex items-center justify-center border-b border-purple-100">
                <img 
                  src={bannerImg} 
                  alt="Faith Journey" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-lg font-serif font-bold text-gray-900 mb-2">Inspiring Stories</h2>
                <p className="text-sm text-gray-600">Faith-filled articles and devotions to strengthen your Christian journey.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blog Posts */}
        <div className="space-y-4">
          {BLOG_POSTS.map((post) => (
            <Card key={post.id} className="bg-white border-purple-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedPost(post)}>
              <CardContent className="pt-6 pb-6">
                <div className="mb-3">
                  <h2 className="text-xl font-serif font-bold text-gray-900 mb-2 hover:text-purple-700 transition-colors" data-testid={`text-blog-title-${post.id}`}>
                    {post.title}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mb-3">
                    <span className="text-purple-600">{post.author}</span> • {post.date}
                  </p>
                </div>
                <p className="text-gray-600 mb-3">{post.excerpt}</p>
                <p className="text-xs text-purple-600 font-medium">Click to read more →</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Full Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pb-32">
          <Card className="bg-white border-purple-100 max-w-2xl w-full max-h-96 overflow-y-auto">
            <CardContent className="pt-6 pb-6">
              {/* Close Button */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">{selectedPost.title}</h2>
                  <p className="text-xs text-gray-500 font-medium mt-2">
                    <span className="text-purple-600">{selectedPost.author}</span> • {selectedPost.date}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  data-testid="button-close-modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              {/* Close Button Only */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedPost(null)}
                  variant="default"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  data-testid="button-close-post"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AppNavbar />
    </div>
  );
}
