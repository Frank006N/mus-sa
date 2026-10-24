import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { getCommunitiesForStudent } from '../data/mock-communities';

export default function ProfileScreen() {
  const [student, setStudent] = useState<any>(null);
  const [communities, setCommunities] = useState<any[]>([]);

  useEffect(() => {
    SecureStore.getItemAsync('mock_student').then(data => {
      if (data) {
        const s = JSON.parse(data);
        setStudent(s);
        setCommunities(getCommunitiesForStudent(s.regNo));
      }
    });
  }, []);

  if (!student) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Verified Identity Header */}
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>{student.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{student.name}</Text>
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={14} color="#059669" />
          <Text style={styles.verifiedText}>VERIFIED MUT STUDENT</Text>
        </View>
        <Text style={styles.regNo}>{student.regNo}</Text>
      </View>

      {/* Institutional Membership (NOT Followers) */}
      <Text style={styles.sectionTitle}>My Communities</Text>
      <View style={styles.communitiesList}>
        {communities.map(comm => (
          <View key={comm.id} style={styles.communityItem}>
            <View style={[
              styles.scopeIndicator,
              comm.scope === 'school' ? styles.scopeSchool :
              comm.scope === 'department' ? styles.scopeDept :
              styles.scopeClass
            ]} />
            <View style={styles.communityInfo}>
              <Text style={styles.communityName}>{comm.name}</Text>
              <Text style={styles.communityScope}>{comm.scope.toUpperCase()}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </View>
        ))}
      </View>

      {/* Account Info */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Account</Text>
      <View style={styles.accountItem}>
        <Ionicons name="mail-outline" size={20} color="#6B7280" />
        <Text style={styles.accountText}>{student.studentEmail || 'No MUT email on file'}</Text>
      </View>
      <View style={styles.accountItem}>
        <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
        <Text style={styles.accountText}>Role: Student Member</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  loadingText: { fontSize: 14, color: '#6B7280' },
  header: { alignItems: 'center', marginBottom: 24 },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarLargeText: { color: '#FFF', fontSize: 32, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 6 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 4 },
  verifiedText: { fontSize: 11, fontWeight: '700', color: '#059669', marginLeft: 4, letterSpacing: 0.5 },
  regNo: { fontSize: 13, color: '#6B7280', fontFamily: 'monospace' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  communitiesList: { backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden' },
  communityItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  scopeIndicator: { width: 4, height: 32, borderRadius: 2, marginRight: 12 },
  scopeSchool: { backgroundColor: '#2563EB' },
  scopeDept: { backgroundColor: '#7C3AED' },
  scopeClass: { backgroundColor: '#059669' },
  communityInfo: { flex: 1 },
  communityName: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 },
  communityScope: { fontSize: 11, color: '#6B7280', fontWeight: '600' },
  accountItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 8 },
  accountText: { fontSize: 14, color: '#374151', marginLeft: 12 }
});
