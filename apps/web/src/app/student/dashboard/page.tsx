'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Newspaper, ShoppingBag, Users, HelpCircle,
  Bell, Search, Plus, LogOut, Heart, MessageCircle as MsgCircle, Share2, 
  ShieldAlert, Send, CheckCircle2, Clock, Lock, GraduationCap,
  Video, Music, Image as ImageIcon, MapPin, Phone, ExternalLink, Tag,
  AlertTriangle, X, ChevronLeft, Settings, Moon, Sun, Eye, User as UserIcon, Mail, Key, Volume2, Smartphone,
  Cross, Church, Guitar, Tent, ArrowRight, BookOpen, CalendarDays
} from 'lucide-react';
import { authService, User as UserType, UNIVERSITY_OFFICES } from '@/lib/auth';
import { useTheme } from '@/context/ThemeContext';

// --- REAL IMAGE SOURCES ---
const IMG = {
  feed_video: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80',
  feed_audio: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
  feed_image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
  market_salon: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
  market_repair: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80',
  market_product: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
  avatar_default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
  business_school: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
  computing_school: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
  catholic_action: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=600&q=80',
  christian_union: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&q=80',
  music_club: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80',
  scouts: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&q=80',
};

// --- HIERARCHICAL DATA STRUCTURE ---
interface SubGroup { 
  id: string; name: string; members: number; status: 'joined'|'pending'|'not_joined'; requiresApproval: boolean; 
}

interface Community { 
  id: string; name: string; type: 'academic'|'society'; icon: any; image: string; 
  description: string; totalMembers: number; groups: SubGroup[]; 
}

interface Post { id: number; author: string; role: string; time: string; content: string; likes: number; comments: number; mediaType?: 'image'|'video'|'audio'; mediaUrl?: string; tags?: string[]; }
interface MarketItem { id: number; seller: string; title: string; price: string; location: string; contact: string; type: 'product'|'service'; image: string; description: string; rating: number; }
interface Announcement { id: number; title: string; content: string; date: string; priority: 'high'|'normal'; }
interface IssueReport { id: number; type: 'public'|'anonymous'; title: string; content: string; author: string; time: string; responses: number; status: 'open'|'resolved'; office?: string; }

const MOCK_FEED: Post[] = [
  { id: 1, author: 'Dance Crew MUT', role: 'student', time: '2h ago', content: 'New choreography drop! 🔥 #MUTTalent #Dance', likes: 567, comments: 89, mediaType: 'video', mediaUrl: IMG.feed_video, tags: ['Talent','Dance'] },
  { id: 2, author: 'Sarah K.', role: 'student', time: '4h ago', content: 'Acoustic cover of "Suzanne" 🎸 Dorm room session.', likes: 234, comments: 45, mediaType: 'audio', mediaUrl: IMG.feed_audio, tags: ['Music','Cover'] },
  { id: 3, author: 'Art Club', role: 'student', time: '6h ago', content: 'Charcoal sketch of main campus gate. 4 hours!', likes: 890, comments: 120, mediaType: 'image', mediaUrl: IMG.feed_image, tags: ['Art','Sketch'] },
];

const MOCK_MARKET: MarketItem[] = [
  { id: 1, seller: 'Glow Salon', title: 'Box Braids & Hair Treatment', price: 'KES 1,500', location: 'Gate B, Shop 4', contact: '0712-345-678', type: 'service', image: IMG.market_salon, description: 'Professional braiding. Student discount available.', rating: 4.8 },
  { id: 2, seller: 'Tech Fix Hub', title: 'Laptop Screen Replacement', price: 'From KES 3,500', location: 'Computing Lab 2', contact: '0722-987-654', type: 'service', image: IMG.market_repair, description: 'Same-day repair. Warranty included.', rating: 4.9 },
  { id: 3, seller: 'Jane\'s Thrift', title: 'Vintage Denim Jacket', price: 'KES 800', location: 'Hostel Block C, Rm 12', contact: 'DM for pickup', type: 'product', image: IMG.market_product, description: 'Size M, excellent condition.', rating: 4.5 },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 1, title: 'Exam Timetable Released', content: 'Final exams begin Nov 15th. Check portal for venues.', date: 'Today, 9AM', priority: 'high' },
  { id: 2, title: 'Library Hours Extended', content: 'Open until 10 PM during exam period.', date: 'Yesterday', priority: 'normal' },
];

const MOCK_ISSUES: IssueReport[] = [
  { id: 1, type: 'public', title: 'WiFi Down in Block C?', content: 'Anyone else notice WiFi down all morning?', author: 'John D.', time: '1h ago', responses: 12, status: 'open' },
  { id: 2, type: 'anonymous', title: 'Security Concern at Gate A', content: 'Unauthorized persons entering after 8 PM.', author: 'Anonymous', time: '3h ago', responses: 0, status: 'open', office: 'Campus Security' },
];

const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'school-business', name: 'School of Business', type: 'academic', icon: BookOpen, image: IMG.business_school,
    description: 'All business students. Groups organized by course and year.', totalMembers: 450,
    groups: [
      { id: 'bcom-y1', name: 'B.Com Year 1', members: 145, status: 'joined', requiresApproval: true },
      { id: 'bcom-y2', name: 'B.Com Year 2', members: 132, status: 'not_joined', requiresApproval: true },
      { id: 'bsc-finance-y1', name: 'BSc Finance Year 1', members: 98, status: 'not_joined', requiresApproval: true },
    ]
  },
  {
    id: 'school-computing', name: 'School of Computing', type: 'academic', icon: BookOpen, image: IMG.computing_school,
    description: 'CS, IT, and Software Engineering students.', totalMembers: 380,
    groups: [
      { id: 'cs-y1', name: 'Computer Science Y1', members: 120, status: 'not_joined', requiresApproval: true },
      { id: 'it-y2', name: 'Information Tech Y2', members: 95, status: 'joined', requiresApproval: true },
    ]
  },
  {
    id: 'catholic-action', name: 'Catholic Action', type: 'society', icon: Cross, image: IMG.catholic_action,
    description: 'Faith-based community. Sub-groups for worship and service.', totalMembers: 89,
    groups: [
      { id: 'ca-choir', name: 'CA Choir', members: 35, status: 'not_joined', requiresApproval: false },
      { id: 'ca-liturgical', name: 'Liturgical Dancers', members: 22, status: 'joined', requiresApproval: false },
    ]
  },
  {
    id: 'christian-union', name: 'Christian Union', type: 'society', icon: Church, image: IMG.christian_union,
    description: 'Interdenominational Christian fellowship.', totalMembers: 210,
    groups: [
      { id: 'cu-worship', name: 'Worship Team', members: 45, status: 'joined', requiresApproval: true },
      { id: 'cu-evangelism', name: 'Evangelism Squad', members: 60, status: 'not_joined', requiresApproval: false },
    ]
  },
  {
    id: 'music-club', name: 'Music Club', type: 'society', icon: Guitar, image: IMG.music_club,
    description: 'For musicians and music lovers. Instrument-specific groups.', totalMembers: 67,
    groups: [
      { id: 'mc-guitar', name: 'Guitar Ensemble', members: 25, status: 'pending', requiresApproval: true },
      { id: 'mc-vocals', name: 'Vocalists Group', members: 30, status: 'not_joined', requiresApproval: true },
    ]
  },
  {
    id: 'scouts', name: 'Scouts Association', type: 'society', icon: Tent, image: IMG.scouts,
    description: 'Leadership, camping, and community service.', totalMembers: 45,
    groups: [
      { id: 'sc-outdoor', name: 'Outdoor Adventures', members: 28, status: 'not_joined', requiresApproval: true },
      { id: 'sc-service', name: 'Community Service', members: 17, status: 'joined', requiresApproval: false },
    ]
  },
];

const NAV = [
  { id: 'feed', label: 'Feed', icon: Newspaper },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  { id: 'communities', label: 'Communities', icon: Users },
  { id: 'issues', label: 'Issues & Reports', icon: HelpCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function ActiveIcon({ tabId }: { tabId: string }) {
  const item = NAV.find(n => n.id === tabId);
  if (!item?.icon) return null;
  const Icon = item.icon;
  return <Icon size={32} className="text-emerald-600 dark:text-emerald-400" />;
}

// --- SETTINGS SUB-COMPONENTS ---
function PrivacySettings() {
  const [whoCanMessage, setWhoCanMessage] = useState('everyone');
  const [whoCanViewPosts, setWhoCanViewPosts] = useState('followers');
  const [showRegNo, setShowRegNo] = useState(false);
  const [allowTagging, setAllowTagging] = useState(true);

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Eye size={20}/> Visibility & Privacy</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Who can message me?</label>
            <select value={whoCanMessage} onChange={e=>setWhoCanMessage(e.target.value)} className="w-full p-3 rounded-xl">
              <option value="everyone">Everyone</option><option value="followers">Followers Only</option><option value="noone">No One</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Who can view my posts?</label>
            <select value={whoCanViewPosts} onChange={e=>setWhoCanViewPosts(e.target.value)} className="w-full p-3 rounded-xl">
              <option value="everyone">Everyone</option><option value="followers">Followers Only</option><option value="private">Only Me</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div><p className="text-sm font-medium">Show Registration Number</p><p className="text-xs text-gray-500">Display RegNo on your profile</p></div>
            <button onClick={()=>setShowRegNo(!showRegNo)} className={`w-12 h-6 rounded-full transition-colors relative ${showRegNo?'bg-emerald-500':'bg-gray-300 dark:bg-gray-600'}`}><span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${showRegNo?'left-7':'left-1'}`}/></button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div><p className="text-sm font-medium">Allow Tagging</p><p className="text-xs text-gray-500">Let others tag you in posts</p></div>
            <button onClick={()=>setAllowTagging(!allowTagging)} className={`w-12 h-6 rounded-full transition-colors relative ${allowTagging?'bg-emerald-500':'bg-gray-300 dark:bg-gray-600'}`}><span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${allowTagging?'left-7':'left-1'}`}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [mentionNotifs, setMentionNotifs] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(true);

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Volume2 size={20}/> Notifications</h3>
        <div className="space-y-3">
          {[
            { label: 'Push Notifications', desc: 'Get alerts on your device', state: pushNotifs, setter: setPushNotifs, icon: Smartphone },
            { label: 'Email Notifications', desc: 'Receive updates via email', state: emailNotifs, setter: setEmailNotifs, icon: Mail },
            { label: 'Mentions & Tags', desc: 'When someone mentions you', state: mentionNotifs, setter: setMentionNotifs, icon: UserIcon },
            { label: 'Community Updates', desc: 'New posts in joined groups', state: communityUpdates, setter: setCommunityUpdates, icon: Users },
          ].map(({label,desc,state,setter,icon:Icon}) => (
            <div key={label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3"><Icon size={18} className="text-gray-400"/><div><p className="text-sm font-medium">{label}</p><p className="text-xs text-gray-500">{desc}</p></div></div>
              <button onClick={()=>setter(!state)} className={`w-12 h-6 rounded-full transition-colors relative ${state?'bg-emerald-500':'bg-gray-300 dark:bg-gray-600'}`}><span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${state?'left-7':'left-1'}`}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountSettings({ user }: { user: UserType }) {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><UserIcon size={20}/> Account Information</h3>
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"><p className="text-xs text-gray-500 mb-1">Email</p><p className="text-sm font-medium">{user.email}</p></div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"><p className="text-xs text-gray-500 mb-1">Registration Number</p><p className="text-sm font-medium font-mono">{user.regNo || 'Not verified'}</p></div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"><p className="text-xs text-gray-500 mb-1">Role</p><p className="text-sm font-medium capitalize">{user.role}</p></div>
        </div>
      </div>
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Key size={20}/> Security</h3>
        <button className="w-full py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Change Password</button>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('feed');
  const [user, setUser] = useState<UserType | null>(null);
  
  // Navigation State: Community -> Group
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<SubGroup | null>(null);
  
  const [regNoInput, setRegNoInput] = useState('');
  const [showRegModal, setShowRegModal] = useState(false);
  const [joinStatus, setJoinStatus] = useState<'idle'|'requesting'|'pending'>('idle');
  const [postContent, setPostContent] = useState('');
  const [marketSearch, setMarketSearch] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueType, setIssueType] = useState<'public'|'anonymous'>('public');
  const [selectedOffice, setSelectedOffice] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [issueContent, setIssueContent] = useState('');
  const [settingsSubTab, setSettingsSubTab] = useState('privacy');

  useEffect(() => {
    const s = authService.getSession();
    if (!s || s.role !== 'student') { router.push('/auth/login'); return; }
    setUser(s);
    if (!s.regNo) setShowRegModal(true);
  }, [router]);

  const handleJoinRequest = () => {
    if (!user?.regNo && selectedGroup?.requiresApproval) { setShowRegModal(true); return; }
    setJoinStatus('requesting');
    setTimeout(() => setJoinStatus('pending'), 1500);
  };

  const handleRegNoSubmit = () => {
    if (authService.updateRegNo(regNoInput)) { setShowRegModal(false); setUser(authService.getSession()); }
    else alert('Invalid format. Use AB123/4567/2789');
  };

  const handleSubmitIssue = () => {
    if (!issueTitle.trim() || !issueContent.trim()) return;
    if (issueType === 'anonymous' && !selectedOffice) { alert('Please select an office.'); return; }
    const office = UNIVERSITY_OFFICES.find(o => o.id === selectedOffice);
    alert(`${issueType==='anonymous'?'Anonymous report':'Public question'} submitted${office?` to ${office.name}`:''}.`);
    setShowIssueModal(false); setIssueTitle(''); setIssueContent(''); setSelectedOffice('');
  };

  const filteredMarket = MOCK_MARKET.filter(item =>
    item.title.toLowerCase().includes(marketSearch.toLowerCase()) ||
    item.seller.toLowerCase().includes(marketSearch.toLowerCase()) ||
    item.location.toLowerCase().includes(marketSearch.toLowerCase())
  );

  if (!user) return <div className="min-h-screen flex items-center justify-center"><p className="animate-pulse text-emerald-600 font-medium">Loading...</p></div>;

  const AnnouncementsWidget = () => (
    <div className="glass-card rounded-2xl p-5 mb-6">
      <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><ShieldAlert size={16} className="text-emerald-600"/> Official Announcements</h3>
      <div className="space-y-3">
        {MOCK_ANNOUNCEMENTS.map(ann => (
          <div key={ann.id} className="bg-white/60 dark:bg-gray-700/40 rounded-xl p-3 border border-emerald-100/50 dark:border-emerald-800/30 hover:bg-white/80 dark:hover:bg-gray-700/60 transition-colors">
            <div className="flex items-center justify-between mb-1"><h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">{ann.title}</h4><span className="text-[10px] text-gray-500">{ann.date}</span></div>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">{ann.content}</p>
            {ann.priority==='high' && <span className="inline-block mt-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[9px] rounded-full font-bold">HIGH PRIORITY</span>}
          </div>
        ))}
      </div>
    </div>
  );

  // Determine current view context
  const currentContext = selectedGroup 
    ? `${selectedCommunity?.name} › ${selectedGroup.name}` 
    : selectedCommunity 
      ? selectedCommunity.name 
      : activeTab==='settings' 
        ? `Settings › ${settingsSubTab==='privacy'?'Privacy':settingsSubTab==='notifications'?'Notifications':'Account'}`
        : activeTab==='issues' ? 'Issues & Reporting' : activeTab;

  const currentSubtitle = selectedGroup
    ? `${selectedGroup.members} Members • ${selectedGroup.requiresApproval ? 'Approval Required' : 'Open Join'}`
    : selectedCommunity
      ? `${selectedCommunity.type === 'academic' ? 'Academic Community' : 'Student Society'} • ${selectedCommunity.totalMembers} Total Members`
      : `Welcome back, ${user.name.split(' ')[0]}`;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 glass-sidebar fixed h-full hidden lg:flex flex-col z-10">
        <div className="p-6 border-b border-white/60 dark:border-gray-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30">MUT</div>
            <div className="min-w-0"><h1 className="font-bold text-gray-900 dark:text-gray-100 truncate">MUT Student</h1><p className="text-xs text-gray-500 truncate">{user.regNo||'RegNo Missing'}</p></div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSelectedCommunity(null); setSelectedGroup(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 active:scale-[0.97] ${
                activeTab===item.id && !selectedCommunity && !selectedGroup
                  ? 'bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/30 scale-[1.02]' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/40 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}>
              <item.icon size={20} className={activeTab===item.id && !selectedCommunity && !selectedGroup ? 'text-white' : 'text-gray-400 dark:text-gray-500'}/><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/60 dark:border-gray-700/60 space-y-2">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/40 transition-colors">
            {theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}
            <span>{theme==='dark'?'Light Mode':'Dark Mode'}</span>
          </button>
          <button onClick={()=>setShowRegModal(true)} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left text-xs text-gray-500 hover:text-emerald-600 transition-colors"><GraduationCap size={16}/>{user.regNo?'Update RegNo':'Add RegNo'}</button>
          <button onClick={()=>setShowIssueModal(true)} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors border border-purple-100 dark:border-purple-800"><AlertTriangle size={18}/><span>Issues & Reports</span></button>
          <button onClick={()=>{authService.logout();router.push('/auth/login')}} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm transition-colors"><LogOut size={18}/><span>Sign Out</span></button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 min-h-screen max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentContext}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{currentSubtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {activeTab==='marketplace'&&(
              <div className="relative">
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400"/>
                <input type="text" placeholder="Search products, services..." value={marketSearch} onChange={e=>setMarketSearch(e.target.value)} className="pl-9 pr-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-48 lg:w-64 shadow-sm"/>
              </div>
            )}
            <button className="p-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 relative shadow-sm active:scale-95 transition-transform"><Bell size={20}/><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"/></button>
          </div>
        </div>

        {/* FEED */}
        {activeTab==='feed'&&!selectedCommunity&&(
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="glass-card rounded-2xl p-4">
              <div className="flex gap-3">
                <img src={IMG.avatar_default} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md shrink-0"/>
                <textarea value={postContent} onChange={e=>setPostContent(e.target.value)} placeholder="Share your talent, meme, or thought..." className="flex-1 bg-transparent outline-none text-sm py-2 resize-none min-h-[60px] dark:text-gray-100"/>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 rounded-lg transition-colors active:scale-90" title="Video"><Video size={18}/></button>
                  <button className="p-2 hover:bg-pink-50 dark:hover:bg-pink-900/20 text-pink-600 rounded-lg transition-colors active:scale-90" title="Audio"><Music size={18}/></button>
                  <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors active:scale-90" title="Image"><ImageIcon size={18}/></button>
                  <button className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 rounded-lg transition-colors active:scale-90" title="Tag"><Tag size={18}/></button>
                </div>
                <button disabled={!postContent.trim()} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full text-sm font-medium transition-all shadow-lg shadow-emerald-600/20 active:scale-95">Post</button>
              </div>
            </div>
            {MOCK_FEED.map(post=>(
              <div key={post.id} className="glass-card rounded-2xl p-5 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img src={IMG.avatar_default} alt={post.author} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md"/>
                    <div><p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{post.author}</p><p className="text-xs text-gray-500">{post.time}</p></div>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">{post.tags?.map(tag=><span key={tag} className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-[10px] rounded-full font-medium">#{tag}</span>)}</div>
                </div>
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed mb-3">{post.content}</p>
                {post.mediaType&&post.mediaUrl&&(
                  <div className="w-full rounded-xl mb-4 overflow-hidden shadow-md relative group">
                    <img src={post.mediaUrl} alt="Media" className="w-full h-64 object-cover"/>
                    {post.mediaType==='video'&&<div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"><div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg"><Video size={24} className="text-emerald-700 ml-1"/></div></div>}
                    {post.mediaType==='audio'&&<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent"><div className="flex items-center gap-3 text-white"><Music size={20}/><div className="flex-1 h-1 bg-white/30 rounded-full"><div className="w-1/3 h-full bg-emerald-400 rounded-full"/></div><span className="text-xs font-mono">0:45 / 3:20</span></div></div>}
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                  <button className="flex items-center gap-2 hover:text-red-500 transition-colors active:scale-90"><Heart size={16}/>{post.likes}</button>
                  <button className="flex items-center gap-2 hover:text-emerald-600 transition-colors active:scale-90"><MsgCircle size={16}/>{post.comments}</button>
                  <button className="flex items-center gap-2 hover:text-blue-500 transition-colors active:scale-90"><Share2 size={16}/>Share</button>
                  <button className="flex items-center gap-2 hover:text-purple-500 transition-colors active:scale-90"><Users size={16}/>Follow</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MARKETPLACE WITH MEDIA CREATOR */}
        {activeTab==='marketplace'&&!selectedCommunity&&(
          <div className="max-w-6xl mx-auto">
            {/* CREATE LISTING CARD */}
            <div className="glass-card rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0"><ShoppingBag size={20}/></div>
                <div><h3 className="font-bold text-gray-900 dark:text-gray-100">List Your Business or Product</h3><p className="text-xs text-gray-500">Add photos, videos, prices, and location</p></div>
              </div>
              <textarea placeholder="Describe your product or service..." className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-sm resize-none min-h-[80px] mb-3" />
              <div className="flex flex-wrap gap-2 mb-3">
                <button className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-lg text-xs font-medium hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors active:scale-95"><Video size={14}/> Add Video</button>
                <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors active:scale-95"><ImageIcon size={14}/> Add Photos</button>
                <button className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300 rounded-lg text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors active:scale-95"><MapPin size={14}/> Add Location</button>
                <button className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300 rounded-lg text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors active:scale-95"><Tag size={14}/> Set Price</button>
              </div>
              <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors active:scale-[0.98]">Create Listing</button>
            </div>

            {/* EXISTING LISTINGS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarket.map(item=>(
                <div key={item.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="h-48 relative overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-sm">{item.price}</div>
                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-[10px] text-white font-medium uppercase tracking-wider">{item.type}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><MapPin size={14} className="text-emerald-500 shrink-0"/><span className="truncate">{item.location}</span></div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><Phone size={14} className="text-emerald-500 shrink-0"/><span>{item.contact}</span></div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">★ {item.rating}</div>
                      <a href={`tel:${item.contact.replace(/\D/g,'')}`} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold transition-colors active:scale-95">Contact <ExternalLink size={12}/></a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredMarket.length===0&&<div className="text-center py-20"><ShoppingBag size={48} className="mx-auto text-gray-300 mb-4"/><h3 className="font-bold text-gray-900 dark:text-gray-100">No listings found</h3></div>}
          </div>
        )}

        {/* COMMUNITIES - HIERARCHICAL VIEW */}
        {activeTab==='communities'&&(
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
            {!selectedCommunity ? (
              /* LEVEL 1: COMMUNITY LIST */
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 mt-2">Academic Communities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {MOCK_COMMUNITIES.filter(c=>c.type==='academic').map(comm=>(
                    <div key={comm.id} onClick={()=>setSelectedCommunity(comm)} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer active:scale-[0.98]">
                      <div className="h-32 relative">
                        <img src={comm.image} alt={comm.name} className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                        <div className="absolute bottom-3 left-4 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center"><comm.icon size={18} className="text-emerald-700"/></div>
                          <span className="text-white font-bold text-sm drop-shadow-md">{comm.name}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{comm.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{comm.groups.length} Groups</span>
                          <ArrowRight size={16} className="text-gray-400"/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Student Societies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_COMMUNITIES.filter(c=>c.type==='society').map(comm=>(
                    <div key={comm.id} onClick={()=>setSelectedCommunity(comm)} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer active:scale-[0.98]">
                      <div className="h-32 relative">
                        <img src={comm.image} alt={comm.name} className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                        <div className="absolute bottom-3 left-4 flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            comm.id==='catholic-action'?'bg-blue-500/90 text-white':
                            comm.id==='christian-union'?'bg-indigo-500/90 text-white':
                            comm.id==='music-club'?'bg-purple-500/90 text-white':
                            'bg-orange-500/90 text-white'
                          }`}><comm.icon size={18}/></div>
                          <span className="text-white font-bold text-sm drop-shadow-md">{comm.name}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{comm.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{comm.groups.length} Groups</span>
                          <ArrowRight size={16} className="text-gray-400"/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : !selectedGroup ? (
              /* LEVEL 2: GROUPS INSIDE SELECTED COMMUNITY */
              <div className="flex-1">
                <button onClick={()=>setSelectedCommunity(null)} className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1 mb-4 glass-card px-4 py-2 rounded-xl w-fit active:scale-95 transition-transform"><ChevronLeft size={16}/>Back to Communities</button>
                
                {/* Community Banner */}
                <div className="glass-card rounded-2xl overflow-hidden mb-6">
                  <div className="h-40 relative">
                    <img src={selectedCommunity.image} alt={selectedCommunity.name} className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"/>
                    <div className="absolute bottom-4 left-6 flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedCommunity.type==='academic'?'bg-white/90 text-emerald-700':
                        selectedCommunity.id==='catholic-action'?'bg-blue-500/90 text-white':
                        selectedCommunity.id==='christian-union'?'bg-indigo-500/90 text-white':
                        selectedCommunity.id==='music-club'?'bg-purple-500/90 text-white':
                        'bg-orange-500/90 text-white'
                      }`}><selectedCommunity.icon size={24}/></div>
                      <div>
                        <h3 className="text-white font-bold text-xl drop-shadow-md">{selectedCommunity.name}</h3>
                        <p className="text-white/80 text-sm drop-shadow-md">{selectedCommunity.totalMembers} Members • {selectedCommunity.groups.length} Groups</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedCommunity.description}</p>
                  </div>
                </div>

                {/* Groups Grid */}
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Groups in {selectedCommunity.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCommunity.groups.map(group=>(
                    <div key={group.id} onClick={()=>setSelectedGroup(group)} className="glass-card rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer active:scale-[0.98]">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                          {selectedCommunity.type==='academic' ? <CalendarDays size={24}/> : <Users size={24}/>}
                        </div>
                        {group.status==='joined'&&<CheckCircle2 size={20} className="text-emerald-500"/>}
                        {group.status==='pending'&&<Clock size={20} className="text-amber-500"/>}
                        {group.status==='not_joined'&&<Lock size={20} className="text-gray-300"/>}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{group.name}</h3>
                      <p className="text-xs text-gray-500 mb-4">{group.members} Members</p>
                      {group.requiresApproval&&<span className="px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full text-[10px] font-medium">Admin Approval Required</span>}
                      {!group.requiresApproval&&<span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] font-medium">Open Join</span>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* LEVEL 3: GROUP DETAIL WITH JOIN FLOW */
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={()=>setSelectedGroup(null)} className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1 glass-card px-4 py-2 rounded-xl active:scale-95 transition-transform"><ChevronLeft size={16}/>{selectedCommunity?.name}</button>
                  <span className="text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedGroup.name}</span>
                </div>
                
                <div className="glass-card rounded-2xl p-8 text-center">
                  {selectedGroup.status==='joined'?(
                    <div className="py-4"><CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-3"/><h3 className="font-bold text-gray-900 dark:text-gray-100">You are a member</h3><p className="text-sm text-gray-500 mt-1">Access all content and announcements below.</p></div>
                  ):selectedGroup.status==='pending'?(
                    <div className="py-4"><Clock size={48} className="mx-auto text-amber-500 mb-3"/><h3 className="font-bold text-gray-900 dark:text-gray-100">Request Pending</h3><p className="text-sm text-gray-500 mt-1">Using RegNo: {user.regNo}</p></div>
                  ):(
                    <div className="py-4">
                      <Lock size={48} className="mx-auto text-gray-300 mb-3"/>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Join {selectedGroup.name}</h3>
                      <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                        {selectedGroup.requiresApproval 
                          ? 'This group requires admin approval. Your verified registration number will be submitted for review.'
                          : 'This group allows instant joining. Click below to become a member.'}
                      </p>
                      {selectedGroup.requiresApproval ? (
                        user.regNo ? (
                          <button onClick={handleJoinRequest} disabled={joinStatus==='requesting'} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl font-semibold transition-all inline-flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95">{joinStatus==='requesting'?'Sending...':<><>Request to Join</><Send size={16}/></>}</button>
                        ) : (
                          <button onClick={()=>setShowRegModal(true)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all inline-flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">Add RegNo First <GraduationCap size={16}/></button>
                        )
                      ) : (
                        <button onClick={()=>{setJoinStatus('requesting');setTimeout(()=>setJoinStatus('joined'),1000)}} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all inline-flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95">Join Now <CheckCircle2 size={16}/></button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RIGHT SIDEBAR - ALWAYS VISIBLE IN COMMUNITIES */}
            <div className="w-full lg:w-80 shrink-0">
              <AnnouncementsWidget/>
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-3 text-sm uppercase tracking-wider">
                  {selectedCommunity ? `${selectedCommunity.name} Stats` : 'Platform Stats'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Total Members</span><span className="font-semibold text-gray-900 dark:text-gray-100">{selectedCommunity?.totalMembers || '1,247'}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Active Today</span><span className="font-semibold text-emerald-600">342</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">New Posts</span><span className="font-semibold text-blue-600">+28</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ISSUES & REPORTING */}
        {activeTab==='issues'&&!selectedCommunity&&(
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div><h3 className="font-bold text-gray-900 dark:text-gray-100">Have a concern or question?</h3><p className="text-sm text-gray-500 mt-1">Ask publicly or report anonymously to admins.</p></div>
              <button onClick={()=>setShowIssueModal(true)} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 whitespace-nowrap active:scale-95"><Plus size={18}/>New Issue / Question</button>
            </div>
            <div className="space-y-4">
              {MOCK_ISSUES.map(issue=>(
                <div key={issue.id} className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${issue.type==='anonymous'?'bg-purple-100 dark:bg-purple-900/20 text-purple-600':'bg-blue-100 dark:bg-blue-900/20 text-blue-600'}`}>{issue.type==='anonymous'?<AlertTriangle size={20}/>:<HelpCircle size={20}/>}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{issue.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${issue.type==='anonymous'?'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300':'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'}`}>{issue.type==='anonymous'?'Anonymous Report':'Public Question'}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${issue.status==='open'?'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300':'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'}`}>{issue.status}</span>
                        {issue.office&&<span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">→ {issue.office}</span>}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{issue.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500"><span className="font-medium">{issue.author}</span><span>•</span><span>{issue.time}</span><span>•</span><span className="flex items-center gap-1"><MsgCircle size={12}/>{issue.responses} responses</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab==='settings'&&!selectedCommunity&&(
          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-2xl p-2 mb-6 flex gap-1 overflow-x-auto">
              {[
                {id:'privacy',label:'Privacy',icon:Eye},
                {id:'notifications',label:'Notifications',icon:Bell},
                {id:'account',label:'Account',icon:UserIcon},
              ].map(tab=>(
                <button key={tab.id} onClick={()=>setSettingsSubTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap active:scale-95 ${settingsSubTab===tab.id?'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20':'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/40'}`}>
                  <tab.icon size={16}/>{tab.label}
                </button>
              ))}
            </div>
            {settingsSubTab==='privacy'&&<PrivacySettings/>}
            {settingsSubTab==='notifications'&&<NotificationSettings/>}
            {settingsSubTab==='account'&&<AccountSettings user={user}/>}
          </div>
        )}
      </main>

      {/* REGNO MODAL */}
      {showRegModal&&(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-emerald-600 p-6 text-white"><h3 className="text-lg font-bold flex items-center gap-2"><GraduationCap size={20}/>Verify Registration</h3><p className="text-emerald-100 text-sm mt-1">Required to join communities and groups.</p></div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Registration Number</label>
                <input value={regNoInput} onChange={e=>setRegNoInput(e.target.value.toUpperCase())} placeholder="AB123/4567/2789" className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono uppercase tracking-wider"/>
                <p className="text-[10px] text-gray-500 mt-2">Format: 2 Letters + 3 Digits / 4 Digits / 4 Digits</p>
              </div>
              <div className="flex gap-3">
                <button onClick={()=>setShowRegModal(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-sm active:scale-95 transition-transform">Cancel</button>
                <button onClick={handleRegNoSubmit} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm shadow-lg shadow-emerald-200 active:scale-95 transition-transform">Verify</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ISSUES MODAL WITH OFFICE SELECTOR */}
      {showIssueModal&&(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex items-center justify-between">
              <div><h3 className="text-lg font-bold flex items-center gap-2"><AlertTriangle size={20}/>Issues & Reporting</h3><p className="text-purple-100 text-sm mt-1">Ask publicly or report anonymously to a specific office.</p></div>
              <button onClick={()=>setShowIssueModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-90"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={()=>{setIssueType('public');setSelectedOffice('')}} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${issueType==='public'?'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300':'border-gray-200 dark:border-gray-600 text-gray-500 hover:border-gray-300'}`}><HelpCircle size={20} className="mx-auto mb-1"/>Public Question<p className="text-[10px] font-normal mt-1 opacity-70">Visible to everyone</p></button>
                <button onClick={()=>setIssueType('anonymous')} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${issueType==='anonymous'?'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300':'border-gray-200 dark:border-gray-600 text-gray-500 hover:border-gray-300'}`}><AlertTriangle size={20} className="mx-auto mb-1"/>Anonymous Report<p className="text-[10px] font-normal mt-1 opacity-70">Direct to specific office</p></button>
              </div>
              {issueType==='anonymous'&&(
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Address To (Office)</label>
                  <select value={selectedOffice} onChange={e=>setSelectedOffice(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white dark:bg-gray-700 appearance-none cursor-pointer">
                    <option value="">Select an office...</option>
                    {UNIVERSITY_OFFICES.map(office=><option key={office.id} value={office.id}>{office.icon} {office.name}</option>)}
                  </select>
                  {selectedOffice&&(()=>{const office=UNIVERSITY_OFFICES.find(o=>o.id===selectedOffice);if(!office)return null;return(
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-3 flex items-start gap-3">
                      <div className="text-2xl">{office.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-purple-900 dark:text-purple-200 text-sm">{office.name}</p>
                        <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">{office.description}</p>
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-purple-600 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-900/40 px-2 py-1 rounded-md w-fit"><span className="font-mono">{office.email}</span><span className="opacity-60">• Admin-only visible</span></div>
                      </div>
                    </div>
                  )})()}
                  <p className="text-[10px] text-gray-500 flex items-center gap-1"><ShieldAlert size={10}/>Your RegNo and identity are NEVER shared with the recipient office</p>
                </div>
              )}
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Title</label><input value={issueTitle} onChange={e=>setIssueTitle(e.target.value)} placeholder={issueType==='anonymous'?(selectedOffice?`Issue for ${UNIVERSITY_OFFICES.find(o=>o.id===selectedOffice)?.name}...`:'Brief description...'):'What\'s your question?'} className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"/></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Details</label><textarea value={issueContent} onChange={e=>setIssueContent(e.target.value)} rows={4} placeholder={issueType==='anonymous'?'Describe the issue in detail. Include dates, locations, evidence.':'Provide context so others can help...'} className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none"/></div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setShowIssueModal(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-sm active:scale-95 transition-transform">Cancel</button>
                <button onClick={handleSubmitIssue} disabled={issueType==='anonymous'&&!selectedOffice} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"><Send size={16}/>{issueType==='anonymous'?'Send Anonymous Report':'Post Question'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
