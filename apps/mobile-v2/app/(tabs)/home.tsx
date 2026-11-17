import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

// Mock data matching Blueprint Section 6.1 requirements
const MOCK_ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'School of Business Orientation Schedule',
    body: 'Mandatory orientation for all Year 1 students begins Oct 28. Attendance required for registration clearance.',
    author: 'Dean of Students Office',
    scope: 'school',
    isOfficial: true,
    publishedAt: '2026-10-23T09:00:00Z',
    expiresAt: '2026-10-28T23:59:59Z',
    audience: 'Year 1 Students'
  },
  {
    id: '2', 
    title: 'Library Extended Hours During Exams',
    body: 'Main library open until 10 PM weekdays through Nov 15. Quiet study zones available on floors 2-3.',
    author: 'Library Services',
    scope: 'school',
    isOfficial: true,
    publishedAt: '2026-10-22T14:30:00Z',
    audience: 'All Students'
  },
  {
    id: '3',
    title: 'Study Group Formation - Accounting 101',
    body: 'Looking for 3-4 members for weekly study sessions. Tuesdays 4-6 PM in Block B Room 204.',
    author: 'John Mwangi (Class Rep)',
    scope: 'class',
    isOfficial: false,
    publishedAt: '2026-10-23T11:15:00Z',
    audience: 'ACCT101-2026'
  }
];


const MOCK_PEER_POSTS = [
  {
    id: 'p1',
    author: 'John Doe',
    handle: '@sb123',
    content: 'Anyone have notes for ACCT101 Chapter 5? The depreciation methods are confusing.',
    communityName: 'ACCT101',
    timestamp: '2 hours ago',
    repliesCount: 3,
    likesCount: 7,
    sharesCount: 1
  },
  {
    id: 'p2',
    author: 'Jane Smith',
    handle: '@sb456',
    content: 'Reminder: MKT201 group presentations are next Tuesday. Don\'t forget to submit your slides by Monday!',
    communityName: 'MKT201',
    timestamp: '5 hours ago',
    repliesCount: 8,
    likesCount: 15,
    sharesCount: 4
  }
];

export default function HomeScreen() {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.name}>Business Student</Text>
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={14} color="#10B981" />
          <Text style={styles.badgeText}>Verified • School of Business</Text>
        </View>
      </View>

      {/* Official Announcements Section (Blueprint 6.1) */}
      <Text style={styles.sectionTitle}>Official Announcements</Text>
      {announcements.filter(a => a.isOfficial).map(item => (
        <TouchableOpacity key={item.id} style={styles.officialCard}>
          <View style={styles.officialBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#fff" />
            <Text style={styles.officialBadgeText}>OFFICIAL</Text>
          </View>
          <Text style={styles.officialTitle}>{item.title}</Text>
          <Text style={styles.officialBody}>{item.body}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.date}>{new Date(item.publishedAt).toLocaleDateString()}</Text>
          </View>
          {item.audience && (
            <View style={styles.audienceTag}>
              <Text style={styles.audienceText}>For: {item.audience}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      {/* Community Posts Section (Peer Content) */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Community Discussions</Text>
      {announcements.filter(a => !a.isOfficial).map(item => (
        <TouchableOpacity key={item.id} style={styles.peerCard}>
          <Text style={styles.peerTitle}>{item.title}</Text>
          <Text style={styles.peerBody}>{item.body}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.peerAuthor}>{item.author}</Text>
            <Text style={styles.date}>{new Date(item.publishedAt).toLocaleDateString()}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Quick Actions Grid (Blueprint 2.1 Services) */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Quick Access</Text>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="people-outline" size={24} color="#2563EB" />
          </View>
          <Text style={styles.actionTitle}>My Communities</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="search-outline" size={24} color="#059669" />
          </View>
          <Text style={styles.actionTitle}>Service Directory</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="help-circle-outline" size={24} color="#D97706" />
          </View>
          <Text style={styles.actionTitle}>Welfare Support</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
            <Ionicons name="map-outline" size={24} color="#7C3AED" />
          </View>
          <Text style={styles.actionTitle}>Campus Map</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  header: { marginBottom: 24, marginTop: 8 },
  greeting: { fontSize: 16, color: '#6B7280', marginBottom: 4 },
  name: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#059669', marginLeft: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  
  // Official Announcement Styling (Blueprint 6.1)
  officialCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#2563EB', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  officialBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563EB', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
  officialBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700', marginLeft: 4, letterSpacing: 0.5 },
  officialTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  officialBody: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 10 },
  audienceTag: { backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginTop: 4 },
  audienceText: { fontSize: 11, color: '#2563EB', fontWeight: '600' },
  
  // Peer Post Styling
  peerCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  peerTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 },
  peerBody: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 8 },
  peerAuthor: { fontSize: 12, color: '#6B7280', fontStyle: 'italic' },
  
  // Shared Meta
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  date: { fontSize: 11, color: '#9CA3AF' },
  
  // Action Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  iconBox: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionTitle: { fontSize: 13, fontWeight: '600', color: '#374151', textAlign: 'center' }
});
