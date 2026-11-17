'use client';
import { useState, useRef } from 'react';

export default function TweetComposer() {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePost = async () => {
    if (!content.trim()) return;
    setIsPosting(true);
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: content }), // Add mediaUrls logic later
      });
      
      if (res.ok) {
        setContent('');
        window.location.reload(); // Simple refresh to show new post
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-[#16181c] border-b border-gray-800 p-4">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex-shrink-0" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening at MUT?"
            className="w-full bg-transparent text-xl text-white placeholder-gray-500 border-none focus:ring-0 resize-none min-h-[100px]"
          />
          
          {/* Media Preview Area */}
          <div className="mb-3 rounded-2xl overflow-hidden bg-gray-900/50 border border-gray-800 hidden" id="media-preview">
            {/* Images/Videos appear here */}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <div className="flex gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 text-green-500 hover:bg-green-500/10 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" multiple />
              
              <button className="p-2 text-green-500 hover:bg-green-500/10 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
              </button>
            </div>
            
            <button 
              onClick={handlePost}
              disabled={!content.trim() || isPosting}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2 rounded-full transition-all"
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
