'use client';
import { useState } from 'react';

interface Props {
  postId: string;
  initialLikes: number;
  initialComments: number;
}

export default function PostInteractions({ postId, initialLikes, initialComments }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{id: string; text: string; author: string}[]>([]);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    // TODO: POST /api/posts/${postId}/like
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    const newComment = { id: Date.now().toString(), text: commentText, author: 'You' };
    setComments([newComment, ...comments]);
    setCommentText('');
    // TODO: POST /api/posts/${postId}/comments
  };

  const openCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.capture = 'environment'; // Triggers mobile camera
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) console.log('Captured media:', file.name);
    };
    input.click();
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800 mt-2">
      <div className="flex gap-6">
        {/* Like Button */}
        <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
          <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          <span className="text-sm">{likes}</span>
        </button>

        {/* Comment Toggle */}
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span className="text-sm">{initialComments + comments.length}</span>
        </button>

        {/* Camera Capture Button */}
        <button onClick={openCamera} className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors" title="Reply with photo/video">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>

      {/* Comment Section Dropdown */}
      {showComments && (
        <div className="absolute bottom-full left-0 w-full bg-[#16181c] border border-gray-800 rounded-t-xl p-4 mb-1 shadow-2xl z-20">
          <div className="space-y-3 max-h-40 overflow-y-auto mb-3">
            {comments.map(c => (
              <div key={c.id} className="text-sm"><span className="font-bold text-white">{c.author}: </span><span className="text-gray-300">{c.text}</span></div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..." 
              className="flex-1 bg-gray-900 text-white rounded-full px-4 py-2 text-sm border border-gray-700 focus:border-blue-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            />
            <button onClick={handleComment} className="text-blue-500 font-bold text-sm px-3">Post</button>
          </div>
        </div>
      )}
    </div>
  );
}
