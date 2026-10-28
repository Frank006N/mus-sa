'use client';

import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PostCard from '@/components/feed/PostCard';
import { ChevronDown } from 'lucide-react';

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('demo-user'); // Replace with real session ID
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts/feed');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch feed:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // Auto-scroll to next post on swipe/click (TikTok behavior)
  const scrollToNextPost = () => {
    if (!feedRef.current || posts.length === 0) return;
    const container = feedRef.current;
    const currentScroll = container.scrollTop;
    const viewportHeight = container.clientHeight;
    const nextScroll = currentScroll + viewportHeight;
    
    container.scrollTo({
      top: nextScroll,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="student" userEmail="">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" userEmail="">
      {/* TikTok-style full-height scroll container */}
      <div 
        ref={feedRef}
        className="h-[calc(100vh-4rem)] overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        onClick={scrollToNextPost}
      >
        {posts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
            <p className="text-lg mb-4">Your feed is empty</p>
            <p className="text-sm">Follow people or create your first post!</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div 
              key={post.id} 
              className="h-full snap-start flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()} // Prevent auto-scroll when interacting with post
            >
              <div className="w-full max-w-md">
                <PostCard post={post} currentUserId={currentUserId} />
                
                {/* Scroll indicator for last post */}
                {index === posts.length - 1 && (
                  <div className="flex justify-center mt-8 animate-bounce">
                    <ChevronDown size={24} className="text-gray-500" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
