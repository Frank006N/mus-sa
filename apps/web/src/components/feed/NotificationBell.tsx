'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationBell({ userId }: { userId: string }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    const es = new EventSource(`/api/notifications/stream?userId=${userId}`);
    eventSourceRef.current = es;
    
    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'init') {
        setUnreadCount(data.count);
      } else if (data.type === 'update') {
        setUnreadCount(data.notifications.length);
        // Optional: Show toast notification here
      }
    };
    
    es.onerror = () => {
      console.warn('SSE connection lost. Reconnecting...');
      es.close();
      // Browser will auto-reconnect, but we can add custom logic here
    };
    
    return () => es.close();
  }, [userId]);

  return (
    <button className="relative p-2 hover:bg-gray-800 rounded-full transition-colors">
      <Bell size={22} className="text-gray-300" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
