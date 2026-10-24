import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function VerifyOtp() {
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP Code</Text>
      <Text style={styles.subtitle}>We sent a 6-digit code to {email}</Text>
      
      <TextInput
        placeholder="000000"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        maxLength={6}
        style={styles.otpInput}
      />
      
      <TouchableOpacity 
        style={styles.button} 
        disabled={code.length !== 6 || loading}
        onPress={async () => {
          setLoading(true);
          // TODO: Implement Supabase OTP verify
          setTimeout(() => setLoading(false), 2000);
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify Code</Text>
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

