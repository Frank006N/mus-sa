'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Send } from 'lucide-react';

interface PostData {
  id: string;
  content: string;
  type: string;
  mediaUrls?: string | null;
  linkPreview?: string | null;
  createdAt: number | Date;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatar?: string | null;
  likeCount: number;
  commentCount: number;
  repostCount: number;
}

interface Comment {
  id: string;
  content: string;
  createdAt: number;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatar?: string | null;
}

export default function PostCard({ post, currentUserId }: { post: PostData; currentUserId: string }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const previousLiked = liked;
    const previousCount = likeCount;
    
    setLiked(!previousLiked);
    setLikeCount(prev => previousLiked ? prev - 1 : prev + 1);

    try {
      await fetch('/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, userId: currentUserId }),
      });
    } catch (err) {
      setLiked(previousLiked);
      setLikeCount(previousCount);
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${post.id}`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setCommentLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId: post.id, 
          authorId: currentUserId, 
          content: newComment 
        }),
      });
      
      if (res.ok) {
        setNewComment('');
        setComments(prev => [{
          id: 'temp-' + Date.now(),
          content: newComment,
          createdAt: Math.floor(Date.now() / 1000),
          authorUsername: 'you',
          authorDisplayName: 'You',
        }, ...prev]);
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  const timeAgo = (date: number | Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  const renderMedia = () => {
    if (!post.mediaUrls) return null;
    try {
      const urls = JSON.parse(post.mediaUrls) as string[];
      return urls.map((url, i) => (
        <div key={i} className="mt-3 rounded-xl overflow-hidden border border-gray-800">
          {post.type === 'video' ? (
            <video src={url} controls className="w-full max-h-[500px] object-cover bg-black" />
          ) : (
            <img src={url} alt="Post media" className="w-full max-h-[500px] object-cover" />
          )}
        </div>
      ));
    } catch { return null; }
  };

  const renderLinkPreview = () => {
    if (!post.linkPreview) return null;
    try {
      const preview = JSON.parse(post.linkPreview);
      return (
        <a href={preview.url} target="_blank" rel="noopener noreferrer" 
           className="mt-3 block p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors">
          <p className="text-sm text-gray-400 truncate">{preview.url}</p>
          <p className="font-medium text-white mt-1">{preview.title}</p>
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{preview.description}</p>
        </a>
      );
    } catch { return null; }
  };

  return (
    <article className="border-b border-gray-800 p-4 hover:bg-gray-900/30 transition-colors cursor-pointer"
             onClick={() => router.push(`/student/profile/${post.authorUsername}`)}>
      <div className="flex gap-3">
        <div className="shrink-0">
          <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold">
            {post.authorDisplayName?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white hover:underline">{post.authorDisplayName}</span>
              <span className="text-gray-500">@{post.authorUsername}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">{timeAgo(post.createdAt)}</span>
            </div>
            <button className="p-2 hover:bg-gray-800 rounded-full text-gray-500 transition-colors" onClick={e => e.stopPropagation()}>
              <MoreHorizontal size={18} />
            </button>
          </div>

          <p className="mt-1 text-white whitespace-pre-wrap leading-relaxed">{post.content}</p>
          {renderMedia()}
          {renderLinkPreview()}

          <div className="flex items-center justify-between mt-3 max-w-md">
            <button 
              className="group flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors" 
              onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); if (!showComments) loadComments(); }}
            >
              <div className="p-2 rounded-full group-hover:bg-blue-400/10"><MessageCircle size={18} /></div>
              <span className="text-sm">{post.commentCount || 0}</span>
            </button>

            <button className="group flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors" onClick={e => e.stopPropagation()}>
              <div className="p-2 rounded-full group-hover:bg-emerald-400/10"><Repeat2 size={18} /></div>
              <span className="text-sm">{post.repostCount || 0}</span>
            </button>

            <button onClick={handleLike} 
                    className={`group flex items-center gap-2 transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
              <div className="p-2 rounded-full group-hover:bg-red-500/10">
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
              </div>
              <span className="text-sm">{likeCount}</span>
            </button>

            <button className="group flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors" onClick={e => e.stopPropagation()}>
              <div className="p-2 rounded-full group-hover:bg-blue-400/10"><Share size={18} /></div>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-800" onClick={e => e.stopPropagation()}>
              <form onSubmit={handleSubmitComment} className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                  Y
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-full py-2 pl-4 pr-12 text-white placeholder-gray-500 focus:border-emerald-500 outline-none text-sm"
                    disabled={commentLoading}
                  />
                  <button 
                    type="submit"
                    disabled={!newComment.trim() || commentLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-2">No comments yet. Be the first!</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-xs font-bold shrink-0">
                        {comment.authorDisplayName?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-white text-sm">{comment.authorDisplayName}</span>
                          <span className="text-gray-500 text-xs">@{comment.authorUsername}</span>
                          <span className="text-gray-600 text-xs">· {timeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-0.5 break-words">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}