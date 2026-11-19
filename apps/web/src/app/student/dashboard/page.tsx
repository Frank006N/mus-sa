'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// MOCK DATA FOR SHOWCASE
const MOCK_DATA = {
  communities: [
    { id: '1', name: 'Computer Science Students', members: 342, role: 'Member' },
    { id: '2', name: 'MUT Innovation Hub', members: 89, role: 'Admin' },
  ],
  posts: [
    { id: '1', author: 'Dean of Students', content: 'Graduation clearance lists are now updated. Check portal.', time: '2h ago' },
    { id: '2', author: 'CS Department', content: 'Hackathon registration closes this Friday at 5PM!', time: '5h ago' },
  ],
  events: [
    { id: '1', title: 'Innovation Week Pitch Day', date: 'Nov 25, 2026', status: 'Registered' },
    { id: '2', title: 'Career Fair 2026', date: 'Dec 10, 2026', status: 'Interested' },
  ],
  messages: [
    { id: '1', from: 'Project Team Alpha', preview: 'Meeting moved to Room 4B...', time: '10m ago' },
  ]
};

export default function StudentDashboard() {
  const [data, setData] = useState(MOCK_DATA);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, Francis</h1>
        <p className="text-gray-400 mt-1">Here is what is happening in your campus community today.</p>
      </div>

      {/* Stats Grid - ALL CLICKABLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/student/communities" className="block group">
          <StatCard label="My Communities" value={data.communities.length} color="bg-blue-600" />
        </Link>
        <Link href="/student/feed" className="block group">
          <StatCard label="New Posts" value={data.posts.length} color="bg-green-600" />
        </Link>
        <Link href="/student/events" className="block group">
          <StatCard label="Upcoming Events" value={data.events.length} color="bg-purple-600" />
        </Link>
        <Link href="/student/messages" className="block group">
          <StatCard label="Unread Messages" value={data.messages.length} color="bg-orange-600" />
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Feed & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Recent Feed Activity" linkHref="/student/feed">
            {data.posts.map(post => (
              <FeedItem key={post.id} {...post} />
            ))}
          </Section>
          
          <Section title="Your Registered Events" linkHref="/student/events">
            {data.events.map(event => (
              <EventItem key={event.id} {...event} />
            ))}
          </Section>
        </div>

        {/* Right Column: Communities & Messages */}
        <div className="space-y-6">
          <Section title="My Communities" linkHref="/student/communities">
            {data.communities.map(comm => (
              <CommunityItem key={comm.id} {...comm} />
            ))}
          </Section>

          <Section title="Recent Messages" linkHref="/student/messages">
            {data.messages.map(msg => (
              <MessageItem key={msg.id} {...msg} />
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components with Navigation ---

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-gray-500 hover:bg-gray-800 transition-all cursor-pointer h-full">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3 opacity-90`}>
        <span className="text-white font-bold text-lg">{value}</span>
      </div>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
    </div>
  );
}

function Section({ title, children, linkHref }: { title: string; children: React.ReactNode; linkHref?: string }) {
  return (
    <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {linkHref && (
          <Link href={linkHref} className="text-xs text-blue-400 hover:text-blue-300 font-medium">
            View All →
          </Link>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function FeedItem({ author, content, time }: any) {
  return (
    <Link href="/student/feed" className="flex gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors border-b border-gray-700/50 last:border-0 block">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0" />
      <div>
        <p className="text-sm text-white"><span className="font-semibold text-blue-400">{author}</span> • {time}</p>
        <p className="text-sm text-gray-300 mt-1">{content}</p>
      </div>
    </Link>
  );
}

function CommunityItem({ name, members, role }: any) {
  return (
    <Link href="/student/communities" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/30 transition-colors block">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-green-900/50 text-green-400 flex items-center justify-center text-xs font-bold">{name[0]}</div>
        <div>
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-gray-500">{members} members</p>
        </div>
      </div>
      <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">{role}</span>
    </Link>
  );
}

function EventItem({ title, date, status }: any) {
  return (
    <Link href="/student/events" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/30 transition-colors border-l-2 border-purple-500 block">
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${status === 'Registered' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
        {status}
      </span>
    </Link>
  );
}

function MessageItem({ from, preview, time }: any) {
  return (
    <Link href="/student/messages" className="flex gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors block">
      <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0" />
      <div className="overflow-hidden">
        <div className="flex justify-between">
          <p className="text-sm font-medium text-white truncate">{from}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
        <p className="text-xs text-gray-400 truncate mt-0.5">{preview}</p>
      </div>
    </Link>
  );
}
