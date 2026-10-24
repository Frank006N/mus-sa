import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnnouncementProps {
  title: string;
  body: string;
  author: string;
  publishedAt: string;
  audience?: string;
  expiresAt?: string;
}

export default function OfficialAnnouncementCard({ title, body, author, publishedAt, audience, expiresAt }: AnnouncementProps) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.badge}>
        <Ionicons name="shield-checkmark" size={12} color="#fff" />
        <Text style={styles.badgeText}>OFFICIAL</Text>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      
      <View style={styles.metaRow}>
        <Text style={styles.author}>{author}</Text>
        <Text style={styles.date}>{new Date(publishedAt).toLocaleDateString()}</Text>
      </View>
      
      {audience && (
        <View style={styles.audienceTag}>
          <Text style={styles.audienceText}>For: {audience}</Text>
        </View>
      )}
      
      {expiresAt && (
        <Text style={styles.expiry}>Expires: {new Date(expiresAt).toLocaleDateString()}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12, 
    borderLeftWidth: 4, 
    borderLeftColor: '#2563EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#2563EB', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 6, 
    alignSelf: 'flex-start', 
    marginBottom: 8 
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700', marginLeft: 4, letterSpacing: 0.5 },
  title: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  body: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 10 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  date: { fontSize: 11, color: '#9CA3AF' },
  audienceTag: { backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginTop: 4 },
  audienceText: { fontSize: 11, color: '#2563EB', fontWeight: '600' },
  expiry: { fontSize: 11, color: '#DC2626', marginTop: 6, fontStyle: 'italic' }
});
