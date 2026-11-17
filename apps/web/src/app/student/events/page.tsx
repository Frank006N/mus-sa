'use client';
import { useEffect, useState } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'event' | 'announcement';
  organizer: string;
}

export default function EventsPage() {
  const [items, setItems] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'event' | 'announcement'>('all');

  useEffect(() => {
    // Mock data - replace with API call when backend ready
    const mockData: Event[] = [
      { id: '1', title: 'Career Fair 2026', description: 'Meet top employers from tech, finance, and engineering sectors. Bring your CV!', date: '2026-11-25', time: '9:00 AM - 4:00 PM', location: 'Main Auditorium', type: 'event', organizer: 'Career Services' },
      { id: '2', title: 'Exam Schedule Released', description: 'December 2026 semester exam timetable is now available. Check your portal for personal schedule.', date: '2026-11-20', time: 'All Day', location: 'Student Portal', type: 'announcement', organizer: 'Academic Registrar' },
      { id: '3', title: 'Cybersecurity Workshop', description: 'Hands-on CTF competition and ethical hacking demo. Open to all SCIT students.', date: '2026-11-28', time: '2:00 PM - 5:00 PM', location: 'Computer Lab 3', type: 'event', organizer: 'Cybersecurity Club' },
      { id: '4', title: 'Hostel Maintenance Notice', description: 'Block B water supply will be interrupted on Nov 22, 8AM-2PM for pipe repairs. Store water in advance.', date: '2026-11-22', time: '8:00 AM - 2:00 PM', location: 'Hostels Block B', type: 'announcement', organizer: 'Housing Office' },
      { id: '5', title: 'Entrepreneurship Pitch Night', description: 'Present your startup idea to investors. Top 3 teams win seed funding. Register by Nov 24.', date: '2026-11-30', time: '6:00 PM - 9:00 PM', location: 'Innovation Hub', type: 'event', organizer: 'Entrepreneurship Society' },
    ];
    setItems(mockData);
  }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Events & Announcements</h1>
        <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-1">
          {(['all', 'event', 'announcement'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}{f === 'all' ? '' : f === 'event' ? 's' : 's'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className={`bg-white rounded-xl border p-5 flex gap-4 ${item.type === 'announcement' ? 'border-yellow-300 bg-yellow-50/50' : 'border-gray-200'}`}>
            <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 ${item.type === 'announcement' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
              <span className="text-xs font-bold uppercase">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
              <span className="text-xl font-bold">{new Date(item.date).getDate()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${item.type === 'announcement' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>{item.type}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span>🕐 {item.time}</span>
                <span>📍 {item.location}</span>
                <span>👤 {item.organizer}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
