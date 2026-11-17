'use client';
import { useState } from 'react';

// COMPLETE HIERARCHICAL DATA STRUCTURE (Matches All Requirements)
const COMMUNITY_DATA = [
  {
    id: 'scit', name: 'School of Computing & IT', type: 'school', members: 1200, desc: 'Official hub for SCIT students.',
    children: [
      { 
        id: 'cs-dept', name: 'Computer Science Dept', type: 'department', members: 450, desc: 'BSc CS & BIT programs.',
        children: [
          { id: 'cs-y1', name: 'BSc Computer Science Y1', type: 'course_group', members: 120, desc: 'First-year fundamentals & study groups.' },
          { id: 'cs-y2', name: 'BSc Computer Science Y2', type: 'course_group', members: 95, desc: 'Data structures & algorithms cohort.' },
          { id: 'cs-y3', name: 'BSc Computer Science Y3', type: 'course_group', members: 88, desc: 'Software engineering & databases.' },
          { id: 'cs-y4', name: 'BSc Computer Science Y4', type: 'course_group', members: 72, desc: 'Final year projects & capstone.' },
          { id: 'bit-y1', name: 'BIT Year 1', type: 'course_group', members: 110, desc: 'Intro to programming & web dev.' },
          { id: 'bit-y2', name: 'BIT Year 2', type: 'course_group', members: 98, desc: 'Database systems & networking.' },
          { id: 'bit-y3', name: 'BIT Year 3', type: 'course_group', members: 85, desc: 'Cloud computing & cybersecurity.' },
          { id: 'bit-y4', name: 'BIT Year 4', type: 'course_group', members: 67, desc: 'Internship prep & industry projects.' },
          { id: 'cyber-club', name: 'Cybersecurity Club', type: 'club', members: 85, desc: 'CTF competitions & ethical hacking.' },
          { id: 'ai-soc', name: 'AI & Machine Learning Society', type: 'club', members: 62, desc: 'Research papers & model building.' },
        ]
      },
      { 
        id: 'it-dept', name: 'Information Technology Dept', type: 'department', members: 380, desc: 'BIT, BSc IT & networking.',
        children: [] // Can add IT courses here if needed
      }
    ]
  },
  {
    id: 'business', name: 'School of Business', type: 'school', members: 980, desc: 'Commerce, finance & entrepreneurship.',
    children: [
      { id: 'acct-dept', name: 'Accounting & Finance Dept', type: 'department', members: 320, desc: 'BCom Accounting & Finance.' },
      { id: 'mkt-dept', name: 'Marketing & Management', type: 'department', members: 280, desc: 'BCom Marketing & HR.' },
      { id: 'ent-soc', name: 'Entrepreneurship Society', type: 'club', members: 110, desc: 'Startup incubator & pitch nights.' }
    ]
  },
  {
    id: 'catholic', name: 'Catholic Action MUT', type: 'religious', members: 350, desc: 'Faith formation & fellowship.',
    children: [
      { id: 'ca-choir', name: 'CA Choir', type: 'subgroup', members: 45, desc: 'Liturgical music ministry. Wed rehearsals.' },
      { id: 'ca-scripture', name: 'CA Scripture Study', type: 'subgroup', members: 38, desc: 'Weekly Bible reflection.' },
      { id: 'ca-outreach', name: 'CA Outreach Ministry', type: 'subgroup', members: 62, desc: 'Community service & hospital visits.' },
      { id: 'ca-youth', name: 'CA Youth Fellowship', type: 'subgroup', members: 89, desc: 'Social events & retreats.' },
      { id: 'ca-liturgy', name: 'CA Liturgy Committee', type: 'subgroup', members: 28, desc: 'Mass planning & altar serving.' }
    ]
  },
  {
    id: 'cu', name: 'Christian Union MUT', type: 'religious', members: 420, desc: 'Interdenominational Christian fellowship.',
    children: [
      { id: 'cu-worship', name: 'CU Worship Team', type: 'subgroup', members: 55, desc: 'Praise & worship ministry.' },
      { id: 'cu-evangelism', name: 'CU Evangelism Team', type: 'subgroup', members: 48, desc: 'Campus missions & gospel sharing.' },
      { id: 'cu-prayer', name: 'CU Prayer Warriors', type: 'subgroup', members: 72, desc: 'Daily prayer meetings.' }
    ]
  },
  {
    id: 'msa', name: 'Muslim Students Association', type: 'religious', members: 380, desc: 'Islamic fellowship & Jummah prayers.',
    children: [
      { id: 'msa-quran', name: 'MSA Quran Circle', type: 'subgroup', members: 42, desc: 'Tajweed classes & memorization.' },
      { id: 'msa-dawah', name: 'MSA Dawah Team', type: 'subgroup', members: 35, desc: 'Islamic awareness campaigns.' }
    ]
  },
  {
    id: 'sda', name: 'SDA Student Fellowship', type: 'religious', members: 180, desc: 'Sabbath worship & health ministries.',
    children: [
      { id: 'sda-pathfinders', name: 'SDA Pathfinders', type: 'subgroup', members: 32, desc: 'Youth development & camping.' }
    ]
  },
  {
    id: 'games', name: 'MUT Games & Sports', type: 'games', members: 650, desc: 'Campus-wide sports & esports.',
    children: [
      { id: 'football', name: 'Football Club', type: 'subgroup', members: 120, desc: 'Men\'s & women\'s teams. Tue/Thu 4PM.' },
      { id: 'volleyball', name: 'Volleyball Club', type: 'subgroup', members: 85, desc: 'Indoor & beach volleyball.' },
      { id: 'basketball', name: 'Basketball Club', type: 'subgroup', members: 78, desc: 'Intramural leagues & tournaments.' },
      { id: 'esports', name: 'Esports Guild', type: 'subgroup', members: 95, desc: 'Valorant, FIFA, Dota 2 teams.' },
      { id: 'athletics', name: 'Athletics Club', type: 'subgroup', members: 62, desc: 'Track & field, cross country.' }
    ]
  },
  {
    id: 'user-created', name: 'Student-Led Groups', type: 'user_created', members: 708, desc: 'Communities created by students like you.',
    children: [
      { id: 'photo-club', name: 'MUT Photography Club', type: 'user_created', members: 145, desc: 'Photo walks & editing workshops.' },
      { id: 'debate-soc', name: 'Debate & Public Speaking', type: 'user_created', members: 98, desc: 'Weekly debates & MUN prep.' },
      { id: 'mental-health', name: 'Mental Health Advocates', type: 'user_created', members: 210, desc: 'Peer support & wellness workshops.' },
      { id: 'enviro-club', name: 'Environmental Conservation', type: 'user_created', members: 167, desc: 'Tree planting & recycling drives.' },
      { id: 'film-club', name: 'Film & Media Production', type: 'user_created', members: 88, desc: 'Short films & campus news.' }
    ]
  }
];

// MOCK CONVERSATIONS FOR GROUPS (Not Parents)
const GROUP_CONVERSATIONS: Record<string, { title: string; replies: number; lastActive: string }[]> = {
  'cs-y1': [{ title: 'Math 101 Assignment Help?', replies: 45, lastActive: '5m ago' }, { title: 'Study group for midterms', replies: 23, lastActive: '1h ago' }],
  'ca-choir': [{ title: 'Rehearsal schedule change', replies: 12, lastActive: '2h ago' }],
  'football': [{ title: 'Match lineup for Saturday', replies: 34, lastActive: '10m ago' }],
  'photo-club': [{ title: 'Best camera settings for portraits', replies: 18, lastActive: '3h ago' }]
};

export default function CommunitiesPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleJoin = (id: string) => {
    setJoined(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      school: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      department: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      course_group: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      club: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      religious: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
      games: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      user_created: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
      subgroup: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  // Recursive Renderer
  const renderNode = (node: any, depth = 0) => {
    const isExpanded = expanded.has(node.id);
    const isJoined = joined.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const conversations = GROUP_CONVERSATIONS[node.id] || [];

    return (
      <div key={node.id} className={`mb-4 ${depth > 0 ? 'ml-8 border-l-2 border-gray-200 dark:border-white/10 pl-4' : ''}`}>
        {/* CLICKABLE CARD */}
        <div 
          onClick={() => hasChildren && toggleExpand(node.id)}
          className={`bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-white/10 p-5 shadow-sm transition-all ${hasChildren ? 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-600' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{node.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${getTypeColor(node.type)}`}>
                  {node.type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{node.desc}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>👥 {node.members.toLocaleString()} members</span>
                {hasChildren && (
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {isExpanded ? '▼ Click to collapse' : `▶ Click to show ${node.children.length} groups`}
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); handleJoin(node.id); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shrink-0 ml-4 ${isJoined ? 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {isJoined ? '✓ Joined' : 'Join Group'}
            </button>
          </div>
        </div>

        {/* EXPANDED CONTENT: CHILDREN + CONVERSATIONS (Only for Groups) */}
        {isExpanded && hasChildren && (
          <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Render Children Recursively */}
            {node.children.map((child: any) => renderNode(child, depth + 1))}
            
            {/* Show Conversations ONLY if this node has no children (i.e., it's a leaf group) OR always show if it's a group */}
            {/* Requirement: "conversations inside the group". We show them under the group card when expanded */}
            {conversations.length > 0 && (
              <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                  💬 Active Conversations in {node.name}
                </h4>
                <div className="space-y-2">
                  {conversations.map((conv: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between bg-white dark:bg-[#1e293b] p-3 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1">{conv.title}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 shrink-0 ml-4">
                        <span className="flex items-center gap-1">💬 {conv.replies}</span>
                        <span>{conv.lastActive}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Campus Communities</h1>
          <p className="text-gray-600 dark:text-gray-400">Click any community to explore its groups, join, and chat.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          ✨ Create Group
        </button>
      </div>

      <div className="space-y-6">
        {COMMUNITY_DATA.map(root => renderNode(root))}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">✨ Create New Community</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">You will automatically become the admin.</p>
            <div className="space-y-4">
              <input type="text" placeholder="Group Name" className="w-full border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white" />
              <textarea rows={3} placeholder="Description" className="w-full border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white resize-none" />
              <select className="w-full border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white">
                <option>Academic / Course</option>
                <option>Club / Society</option>
                <option>Faith / Religious</option>
                <option>Sports / Games</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10">Cancel</button>
              <button className="flex-1 py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600">Create Group</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
