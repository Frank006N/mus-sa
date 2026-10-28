import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { getCommunitiesForStudent } from '../data/mock-communities';

export default function NewPostScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const preselectedScope = params.scope as 'class' | 'department' | 'school' | undefined;
  
  const [content, setContent] = useState('');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
  const [allowComments, setAllowComments] = useState(true);
  const [loading, setLoading] = useState(false);

  // Get student's eligible communities
  const [studentRegNo, setStudentRegNo] = useState<string | null>(null);
  const [eligibleCommunities, setEligibleCommunities] = useState<any[]>([]);

  useState(() => {
    SecureStore.getItemAsync('mock_student').then(data => {
      if (data) {
        const student = JSON.parse(data);
        setStudentRegNo(student.regNo);
        setEligibleCommunities(getCommunitiesForStudent(student.regNo));
        
        // Auto-select most specific community if not preselected
        if (!preselectedScope && eligibleCommunities.length > 0) {
          const classComm = eligibleCommunities.find((c: any) => c.scope === 'class');
          if (classComm) setSelectedCommunityId(classComm.id);
        }
      }
    });
  });

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter post content');
      return;
    }
    if (!selectedCommunityId) {
      Alert.alert('Error', 'Please select a community');
      return;
    }

    setLoading(true);
    // MOCK: Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    Alert.alert(
      'Post Published',
      `Your post has been shared in the selected community. It will appear in the peer feed below official announcements.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
    setLoading(false);
  };

  const filteredCommunities = preselectedScope 
    ? eligibleCommunities.filter(c => c.scope === preselectedScope)
    : eligibleCommunities;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Post</Text>
      
      {/* Community Selector */}
      <Text style={styles.label}>Post to:</Text>
      <View style={styles.communitySelector}>
        {filteredCommunities.map(comm => (
          <TouchableOpacity
            key={comm.id}
            style={[
              styles.communityChip,
              selectedCommunityId === comm.id && styles.communityChipActive
            ]}
            onPress={() => setSelectedCommunityId(comm.id)}
          >
            <Text style={[
              styles.communityChipText,
              selectedCommunityId === comm.id && styles.communityChipTextActive
            ]}>
              {comm.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content Input */}
      <TextInput
        placeholder="What's happening in your community?"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={6}
        style={styles.textInput}
        editable={!loading}
      />

      {/* Comment Toggle */}
      <TouchableOpacity 
        style={styles.toggleRow}
        onPress={() => setAllowComments(!allowComments)}
      >
        <View style={[styles.toggle, allowComments && styles.toggleActive]}>
          <View style={[styles.toggleKnob, allowComments && styles.toggleKnobActive]} />
        </View>
        <Text style={styles.toggleLabel}>Allow comments</Text>
      </TouchableOpacity>

      {/* Community Rules Notice */}
      <View style={styles.rulesNotice}>
        <Text style={styles.rulesText}>
          Community rules apply. Posts must be respectful and relevant. 
          Official notices can only be published by authorized roles.
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handlePost}
        disabled={loading || !content.trim() || !selectedCommunityId}
      >
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  communitySelector: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  communityChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginRight: 8, marginBottom: 8, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  communityChipActive: { backgroundColor: '#059669', borderColor: '#059669' },
  communityChipText: { fontSize: 13, color: '#4B5563', fontWeight: '500' },
  communityChipTextActive: { color: '#FFF' },
  textInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 14, fontSize: 15, minHeight: 120, textAlignVertical: 'top', marginBottom: 16 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  toggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: '#D1D5DB', marginRight: 10, justifyContent: 'center', paddingHorizontal: 2 },
  toggleActive: { backgroundColor: '#059669' },
  toggleKnob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  toggleKnobActive: { alignSelf: 'flex-end' },
  toggleLabel: { fontSize: 14, color: '#374151' },
  rulesNotice: { backgroundColor: '#FEF3C7', borderRadius: 8, padding: 12, marginBottom: 20 },
  rulesText: { fontSize: 12, color: '#92400E', lineHeight: 18 },
  button: { backgroundColor: '#059669', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' }
});
