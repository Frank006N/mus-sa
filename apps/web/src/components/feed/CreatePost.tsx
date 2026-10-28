'use client';

import { useState, useRef } from 'react';
import { Image, Video, Link, Camera, X, Send, Loader2 } from 'lucide-react';

export default function CreatePost({ userId, username }: { userId: string; username: string }) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setMedia(prev => [...prev, { url: data.url, type: data.type }]);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed. Check network.');
    } finally {
      setLoading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && media.length === 0) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: userId,
          content,
          type: media.length > 0 ? media[0].type === 'video' ? 'video' : 'image' : 'text',
          mediaUrls: media.map(m => m.url),
        }),
      });
      
      if (res.ok) {
        setContent('');
        setMedia([]);
        window.location.reload();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to post');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center shrink-0">
          <span className="text-emerald-400 font-bold text-sm">{username?.[0]?.toUpperCase()}</span>
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's happening, ${username}?`}
            className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none min-h-[80px] text-lg"
            maxLength={280}
          />
          
          {media.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {media.map((m, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden border border-gray-700">
                  {m.type === 'video' ? (
                    <video src={m.url} controls className="w-full max-h-48 object-cover" />
                  ) : (
                    <img src={m.url} alt="Preview" className="w-full max-h-48 object-cover" />
                  )}
                  <button 
                    onClick={() => removeMedia(i)}
                    className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
            <div className="flex items-center gap-1">
              {/* Hidden file inputs with proper capture attributes */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*,video/*" 
                className="hidden" 
              />
              <input 
                type="file" 
                ref={cameraInputRef} 
                onChange={handleFileSelect} 
                accept="image/*" 
                capture="environment" 
                className="hidden" 
              />
              
              <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-800 rounded-full text-emerald-400 transition-colors" title="Add photo/video">
                <Image size={20} />
              </button>
              <button onClick={() => cameraInputRef.current?.click()} className="p-2 hover:bg-gray-800 rounded-full text-emerald-400 transition-colors" title="Take photo">
                <Camera size={20} />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-full text-emerald-400 transition-colors" title="Add link">
                <Link size={20} />
              </button>
              <span className="text-xs text-gray-500 ml-2">{content.length}/280</span>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={(!content.trim() && media.length === 0) || loading}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-full font-bold flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
