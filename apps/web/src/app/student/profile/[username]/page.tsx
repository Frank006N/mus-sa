'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PostCard from '@/components/feed/PostCard';
import { ArrowLeft, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  joined_date?: string;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile data
        const profileRes = await fetch(`/api/users/${username}`);
        if (!profileRes.ok) throw new Error('User not found');
        const profileData = await profileRes.json();
        setProfile(profileData);
        
        // Fetch user's posts
        const postsRes = await fetch(`/api/posts?authorId=${profileData.id}`);
        const postsData = await postsRes.json();
        setPosts(postsData);
        
        // Check if current user is following this profile
        const followRes = await fetch(`/api/follow/check?targetId=${profileData.id}`);
        const followData = await followRes.json();
        setIsFollowing(followData.isFollowing);
        setCurrentUserId(followData.currentUserId);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (username) fetchData();
  }, [username]);

  const handleFollowToggle = async () => {
    if (!profile || !currentUserId) return;
    
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          followerId: currentUserId, 
          followingId: profile.id 
        }),
      });
      
      if (res.ok) {
        setIsFollowing(!isFollowing);
        setProfile(prev => prev ? {
          ...prev,
          followers_count: isFollowing 
            ? prev.followers_count - 1 
            : prev.followers_count + 1
        } : null);
      }
    } catch (err) {
      console.error('Follow action failed:', err);
    }
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

  if (!profile) {
    return (
      <DashboardLayout role="student" userEmail="">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-2">User not found</h2>
          <button onClick={() => router.back()} className="text-emerald-400 hover:underline">
            Go back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" userEmail="">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Profile Header */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-emerald-600/20 flex items-center justify-center text-3xl font-bold text-emerald-400">
                {profile.display_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.display_name}</h1>
                <p className="text-gray-500">@{profile.username}</p>
              </div>
            </div>
            
            <button
              onClick={handleFollowToggle}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                isFollowing 
                  ? 'bg-transparent border border-gray-600 text-white hover:border-red-500 hover:text-red-500' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
          
          {profile.bio && (
            <p className="mt-4 text-white whitespace-pre-wrap">{profile.bio}</p>
          )}
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
            <span><strong className="text-white">{profile.following_count}</strong> <span className="text-gray-500">Following</span></span>
            <span><strong className="text-white">{profile.followers_count}</strong> <span className="text-gray-500">Followers</span></span>
            <span><strong className="text-white">{profile.posts_count}</strong> <span className="text-gray-500">Posts</span></span>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-0 divide-y divide-gray-800">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No posts yet
            </div>
          ) : (
            posts.map(post => (
              <PostCard 
                key={post.id} 
                post={{
                  ...post,
                  authorUsername: profile.username,
                  authorDisplayName: profile.display_name
                }} 
                currentUserId={currentUserId} 
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
