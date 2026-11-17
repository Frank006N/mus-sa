'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// REAL MUT STUDENT PERSONAS
const AUTHORS = [
  { id: 'u1', name: 'Brian Ochieng', handle: '@brian.ochieng', role: 'student', avatar: 'BO', color: 'from-blue-500 to-cyan-500' },
  { id: 'u2', name: 'Amina Hassan', handle: '@amina.hassan', role: 'student', avatar: 'AH', color: 'from-pink-500 to-rose-500' },
  { id: 'u3', name: 'Kevin Mutua', handle: '@kevin.mutua', role: 'student', avatar: 'KM', color: 'from-orange-500 to-red-500' },
  { id: 'u4', name: 'Sarah Admin', handle: '@admin.mut', role: 'admin', avatar: 'SA', color: 'from-emerald-500 to-teal-500' },
  { id: 'u5', name: 'Grace Wambui', handle: '@grace.wambui', role: 'student', avatar: 'GW', color: 'from-violet-500 to-purple-500' },
];

// AUTHENTIC CAMPUS CULTURE CONTENT (MEMES, DANCE, FASHION, CARS, POLITICS)
const INITIAL_POSTS = [
  { 
    id: 'p1', authorId: 'u1', 
    body: 'When the lecturer says "this will be on the exam" but you were busy watching TikTok 😭💀 #MUTLife #ExamSeason', 
    mediaType: 'video' as const, 
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    likes: 342, comments: 89, time: '1h ago' 
  },
  { 
    id: 'p2', authorId: 'u2', 
    body: 'Fit check before Monday lectures 🔥✨ Who else is serving looks on campus today? Drop your outfit pics below! 👇 #MUTFashion #OOTD', 
    mediaType: 'image' as const, 
    mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop',
    likes: 567, comments: 124, time: '3h ago' 
  },
  { 
    id: 'p3', authorId: 'u3', 
    body: 'New whip just dropped at the parking lot 🚗💨 BMW M4 Competition. Who wants a ride to town this weekend? DM for rates 😎 #MUTCars #CarCulture', 
    mediaType: 'image' as const, 
    mediaUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    likes: 891, comments: 203, time: '5h ago' 
  },
  { 
    id: 'p4', authorId: 'u4', 
    body: '📢 OFFICIAL: Student Council elections are NEXT WEEK! Manifestos due by Friday. Remember: Your vote shapes our campus. Register at the Dean\'s office. #MUTPolitics #StudentCouncil', 
    mediaType: undefined, 
    mediaUrl: undefined,
    likes: 234, comments: 67, time: '6h ago' 
  },
  { 
    id: 'p5', authorId: 'u5', 
    body: 'Dance crew practice session was FIRE today 🔥🕺 New choreo dropping next week! Who\'s joining the performance at the cultural festival? #MUTDance #CampusVibes', 
    mediaType: 'video' as const, 
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    likes: 445, comments: 98, time: '8h ago' 
  },
  { 
    id: 'p6', authorId: 'u1', 
    body: 'POV: You see your ex walking past the cafeteria with their new partner 💀😂 The awkwardness is REAL #MUTDrama #CampusTea', 
    mediaType: 'image' as const, 
    mediaUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
    likes: 1203, comments: 342, time: '10h ago' 
  },
  { 
    id: 'p7', authorId: 'u2', 
    body: 'Thrift haul from River Road! 🛍️ Got this vintage jacket for KES 800. Styling it for tomorrow\'s presentation. Thrifting is the ultimate student hack! #MUTFashion #ThriftFlip', 
    mediaType: 'image' as const, 
    mediaUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=1000&fit=crop',
    likes: 389, comments: 76, time: '12h ago' 
  },
  { 
    id: 'p8', authorId: 'u3', 
    body: 'Mercedes vs BMW debate in the parking lot got HEATED today 😤🚗 Which side are you on? Comment below! #MUTCars #CarWars', 
    mediaType: 'video' as const, 
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    likes: 678, comments: 234, time: '14h ago' 
  },
];

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set(['u4']));
  const [newPost, setNewPost] = useState('');

  const getAuthor = (id: string) => AUTHORS.find(a => a.id === id)!;

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
        setPosts(p => p.map(x => x.id === postId ? { ...x, likes: x.likes - 1 } : x));
      } else {
        next.add(postId);
        setPosts(p => p.map(x => x.id === postId ? { ...x, likes: x.likes + 1 } : x));
      }
      return next;
    });
  };

  const handleFollow = (userId: string) => {
    setFollowingUsers(prev => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const author = getAuthor('u1');
    setPosts([{ 
      id: `p${Date.now()}`, authorId: author.id, body: newPost, 
      likes: 0, comments: 0, time: 'Just now' 
    }, ...posts]);
    setNewPost('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Composer */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-white/10 p-4 shadow-sm">
        <textarea
          value={newPost} onChange={e => setNewPost(e.target.value)}
          placeholder="Share your campus moment..."
          className="w-full bg-transparent border-none resize-none focus:ring-0 text-lg dark:text-white placeholder-gray-400"
          rows={3}
        />
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">🖼️ Gallery</button>
            <button className="px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">📷 Camera</button>
          </div>
          <button onClick={handlePost} disabled={!newPost.trim()} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            Post
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {posts.map((post) => {
        const author = getAuthor(post.authorId);
        const isLiked = likedPosts.has(post.id);
        const isFollowing = followingUsers.has(author.id);

        return (
          <article key={post.id} className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Author Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10">
              <div 
                className="flex items-center gap-3 cursor-pointer group" 
                onClick={() => router.push(`/student/profile/${author.id}`)}
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${author.color} flex items-center justify-center text-white font-bold text-sm ring-2 ring-transparent group-hover:ring-blue-400 transition-all`}>
                  {author.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{author.name}</p>
                    {author.role === 'admin' && <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded-full font-bold">ADMIN</span>}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{author.handle} · {post.time}</p>
                </div>
              </div>
              <button 
                onClick={() => handleFollow(author.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isFollowing ? 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isFollowing ? 'Following' : '+ Follow'}
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="mb-3 whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed text-[15px]">{post.body}</p>
              
              {post.mediaType === 'video' && post.mediaUrl && (
                <video controls className="w-full rounded-lg mb-3 max-h-[500px] bg-black shadow-md" poster="">
                  <source src={post.mediaUrl} type="video/mp4" />
                </video>
              )}
              {post.mediaType === 'image' && post.mediaUrl && (
                <img src={post.mediaUrl} alt="Post content" className="w-full rounded-lg mb-3 max-h-[500px] object-cover shadow-md" loading="lazy" />
              )}
              
              {/* Actions */}
              <div className="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-white/10">
                <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}>
                  {isLiked ? '❤️' : '🤍'} {post.likes.toLocaleString()}
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  💬 {post.comments.toLocaleString()} Comments
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors ml-auto">
                  ↗️ Share
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
