'use client';

import { useEffect, useState } from 'react';
import RichPostCard from '@/components/feed/RichPostCard';
import AnonymousReportButton from '@/components/reporting/AnonymousReportButton';

interface Post {
  id: string;
  body: string;
  mediaType: 'text' | 'image' | 'video';
  mediaUrls: string[];
  author: { displayName: string; role: string };
  community: { name: string; type: string };
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    fetch('/api/auth/session', { method: 'GET' })
      .then(r => r.ok ? setIsLoggedIn(true) : setIsLoggedIn(false))
      .catch(() => setIsLoggedIn(false));
  }, []);

  // Load feed
  useEffect(() => {
    const loadFeed = async () => {
      const url = cursor 
        ? `/api/feed?limit=10&cursor=${cursor}` 
        : '/api/feed?limit=10';
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.data?.length > 0) {
        setPosts(prev => [...prev, ...data.data]);
        setCursor(data.nextCursor);
      }
      setLoading(false);
    };
    
    loadFeed();
  }, [cursor]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">MUT Social Feed</h1>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <span className="text-sm text-green-600 font-medium">✓ Logged In</span>
          ) : (
            <a href="/auth/login" className="text-sm text-blue-600 hover:underline">Log In</a>
          )}
          <AnonymousReportButton entityType="post" entityId="global" />
        </div>
      </header>

      {/* Feed Content */}
      <main className="max-w-2xl mx-auto py-6 px-4">
        {loading && posts.length === 0 ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <RichPostCard key={post.id} post={post} />
            ))}
            
            {/* Load More Button */}
            {cursor && !loading && (
              <button
                onClick={() => setLoading(true)}
                className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Load More Posts
              </button>
            )}
            
            {!cursor
mkdir -p src/app/feed
cat > src/app/feed/page.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import RichPostCard from '@/components/feed/RichPostCard';
import AnonymousReportButton from '@/components/reporting/AnonymousReportButton';

interface Post {
  id: string;
  body: string;
  mediaType: 'text' | 'image' | 'video';
  mediaUrls: string[];
  author: { displayName: string; role: string };
  community: { name: string; type: string };
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    fetch('/api/auth/session', { method: 'GET' })
      .then(r => r.ok ? setIsLoggedIn(true) : setIsLoggedIn(false))
      .catch(() => setIsLoggedIn(false));
  }, []);

  // Load feed
  useEffect(() => {
    const loadFeed = async () => {
      const url = cursor 
        ? `/api/feed?limit=10&cursor=${cursor}` 
        : '/api/feed?limit=10';
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.data?.length > 0) {
        setPosts(prev => [...prev, ...data.data]);
        setCursor(data.nextCursor);
      }
      setLoading(false);
    };
    
    loadFeed();
  }, [cursor]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">MUT Social Feed</h1>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <span className="text-sm text-green-600 font-medium">✓ Logged In</span>
          ) : (
            <a href="/auth/login" className="text-sm text-blue-600 hover:underline">Log In</a>
          )}
          <AnonymousReportButton entityType="post" entityId="global" />
        </div>
      </header>

      {/* Feed Content */}
      <main className="max-w-2xl mx-auto py-6 px-4">
        {loading && posts.length === 0 ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <RichPostCard key={post.id} post={post} />
            ))}
            
            {/* Load More Button */}
            {cursor && !loading && (
              <button
                onClick={() => setLoading(true)}
                className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Load More Posts
              </button>
            )}
            
            {!cursor && posts.length > 0 && (
              <p className="text-center text-sm text-gray-500 py-4">
                You've reached the end of the feed 🎉
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
