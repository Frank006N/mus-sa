import { View, Text, StyleSheet } from 'react-native';

export default function RosterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Roster</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
      <Text style={styles.description}>View and manage your class roster once Supabase API is connected.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: '600', color: '#2563EB', marginBottom: 8 },
  description: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
});
