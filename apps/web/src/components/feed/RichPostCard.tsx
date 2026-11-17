'use client';

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

export default function RichPostCard({ post }: { post: Post }) {
  const timeAgo = new Date(post.createdAt).toLocaleDateString('en-KE', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <article className="bg-white border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {post.author.displayName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{post.author.displayName}</p>
            <p className="text-xs text-gray-500">
              {post.community.name} • {timeAgo}
            </p>
          </div>
        </div>
        <AnonymousReportButton entityType={post.mediaType === 'video' ? 'video' : 'post'} entityId={post.id} />
      </div>

      {/* Body Text */}
      <p className="text-gray-800 text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.body}</p>

      {/* Rich Media Render */}
      {post.mediaType === 'video' && post.mediaUrls[0] && (
        <div className="relative rounded-xl overflow-hidden bg-black mb-3 aspect-video">
          <video 
            src={post.mediaUrls[0]} 
            controls 
            className="w-full h-full object-cover"
            preload="metadata"
          />
          <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full">
            VIDEO
          </span>
        </div>
      )}

      {post.mediaType === 'image' && post.mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden mb-3">
          {post.mediaUrls.slice(0, 4).map((url, i) => (
            <img key={i} src={url} alt={`Post media ${i+1}`} className="w-full h-48 object-cover" />
          ))}
        </div>
      )}

      {/* Engagement Bar */}
      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
        <button className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1">
          ❤️ {post.likeCount || 0}
        </button>
        <button className="text-xs text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1">
          💬 {post.commentCount || 0}
        </button>
        <span className="text-[10px] text-gray-400 ml-auto uppercase tracking-wider">
          {post.mediaType}
        </span>
      </div>
    </article>
  );
}

// ADD THIS COMPONENT INSIDE RichPostCard.tsx BEFORE THE CLOSING TAG
function SocialActions({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [following, setFollowing] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    // TODO: Call /api/posts/{id}/like endpoint
  };

  return (
    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
      <div className="flex items-center gap-4">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {likeCount}
        </button>
        
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {post.commentCount || 0}
        </button>
        
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
      
      <button 
        onClick={() => setFollowing(!following)}
        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
          following 
            ? 'bg-gray-100 text-gray-600 border border-gray-200' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {following ? 'Following' : '+ Follow'}
      </button>
    </div>
  );
}

// ADD <SocialActions post={post} /> JUST BEFORE THE CLOSING </article> TAG IN RichPostCard
