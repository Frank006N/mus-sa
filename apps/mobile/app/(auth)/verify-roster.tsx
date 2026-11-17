import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { rosterVerifySchema, type RosterVerifyInput } from '../../lib/auth-schema';

export default function VerifyRoster() {
  const [formData, setFormData] = useState<RosterVerifyInput>({ studentId: '', fullName: '', admissionYear: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Student Status</Text>
      <Text style={styles.subtitle}>Enter details from your official university records.</Text>
      
      <TextInput
        placeholder="Student ID (e.g., AB123)"
        value={formData.studentId}
        onChangeText={(t) => setFormData(p => ({...p, studentId: t.toUpperCase()}))}
        autoCapitalize="characters"
        maxLength={10}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Full Name"
        value={formData.fullName}
        onChangeText={(t) => setFormData(p => ({...p, fullName: t}))}
        autoCapitalize="words"
        style={styles.input}
      />
      
      <TextInput
        placeholder="Admission Year (YYYY)"
        value={formData.admissionYear}
        onChangeText={(t) => setFormData(p => ({...p, admissionYear: t}))}
        keyboardType="numeric"
        maxLength={4}
        style={styles.input}
      />
      
      {error && <Text style={{color:'red',marginBottom:16}}>{error}</Text>}
      
      <TouchableOpacity 
        style={styles.button} 
        disabled={loading}
        onPress={async () => {
          const result = rosterVerifySchema.safeParse(formData);
          if (!result.success) {
            setError(result.error.errors[0].message);
            return;
          }
          setError(null);
          setLoading(true);
          // TODO: Implement roster verification API call
          setTimeout(() => setLoading(false), 2000);
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Complete Verification</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  logo: { width: 128, height: 128, marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32 },
  input: { width: '100%', backgroundColor: '#F3F4F6', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  button: { width: '100%', backgroundColor: '#2563EB', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontWeight: '600' },
  otpInput: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 12, marginBottom: 24, textAlign: 'center', fontSize: 24, letterSpacing: 8 },
});

