import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MOCK_SERVICES = [
  { id: '1', name: 'Graduation Clearance', purpose: 'Verify completion requirements', location: 'Admin Block, Room 104', eligibility: 'Final year students', documents: ['Transcript', 'Fee clearance'], owner: 'Registrar', reviewed: '2026-10-15' },
  { id: '2', name: 'Library Borrowing', purpose: 'Access academic resources', location: 'Main Library, Ground Floor', eligibility: 'All verified students', documents: ['Student ID'], owner: 'Library Services', reviewed: '2026-10-20' },
  { id: '3', name: 'Welfare Counseling', purpose: 'Confidential support services', location: 'Student Affairs, Block C', eligibility: 'All students', documents: ['None required'], owner: 'Dean of Students', reviewed: '2026-10-18' },
];

export default function ServicesScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'eligible'>('all');

  const filtered = MOCK_SERVICES.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.purpose.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Service Directory</Text>
      
      <TextInput
        placeholder="Search services, offices, documents..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />
      
      <View style={styles.filters}>
        <TouchableOpacity 
          style={[styles.filterChip, filter === 'all' && styles.filterActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterChip, filter === 'eligible' && styles.filterActive]}
          onPress={() => setFilter('eligible')}
        >
          <Text style={[styles.filterText, filter === 'eligible' && styles.filterTextActive]}>Eligible for me</Text>
        </TouchableOpacity>
      </View>

      {filtered.map(service => (
        <TouchableOpacity key={service.id} style={styles.serviceCard}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.servicePurpose}>{service.purpose}</Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text style={styles.detailText}>{service.location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={14} color="#6B7280" />
            <Text style={styles.detailText}>Bring: {service.documents.join(', ')}</Text>
          </View>
          
          <Text style={styles.owner}>Owner: {service.owner} • Reviewed: {service.reviewed}</Text>
        </TouchableOpacity>
      ))}
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 16 },
  searchInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, fontSize: 15, marginBottom: 12 },
  filters: { flexDirection: 'row', marginBottom: 16 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, backgroundColor: '#F3F4F6' },
  filterActive: { backgroundColor: '#2563EB' },
  filterText: { fontSize: 13, color: '#4B5563', fontWeight: '500' },
  filterTextActive: { color: '#FFF' },
  serviceCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  servicePurpose: { fontSize: 14, color: '#4B5563', marginBottom: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailText: { fontSize: 13, color: '#6B7280', marginLeft: 6 },
  owner: { fontSize: 11, color: '#9CA3AF', marginTop: 8, fontStyle: 'italic' }
});
