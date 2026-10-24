import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { verifyIdentity } from '../data/mock-roster';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    if (!identifier.trim()) {
      Alert.alert('Error', 'Please enter your Registration Number or MUT Email');
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const student = verifyIdentity(identifier);
    if (student) {
      await SecureStore.setItemAsync('mock_student', JSON.stringify(student));
      router.replace('/(tabs)/home');
    } else {
      Alert.alert(
        'Verification Failed',
        'This Registration Number or Email is not found in the School of Business roster. Please contact the Dean of Students Office.',
        [{ text: 'OK' }]
      );
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    // MOCK: Simulate Google Sign-In returning an email
    // IN PRODUCTION: Use expo-auth-session + Google OAuth
    Alert.alert(
      'Google Sign-In (Mock)',
      'In production, this opens Google OAuth. For now, enter the associated email manually to test verification.',
      [{ text: 'OK', onPress: () => setIdentifier('john.doe@gmail.com') }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MUT Community</Text>
      <Text style={styles.subtitle}>Sign in to access School of Business communities, services, and support.</Text>
      
      {/* Primary Input: Reg No OR Email */}
      <TextInput
        placeholder="Registration Number or MUT Email"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        editable={!loading}
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Google Sign-In Button */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} disabled={loading}>
        <Image 
          source={{ uri: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' }} 
          style={styles.googleIcon} 
        />
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      <Text style={styles.helpText}>
        Your account will be verified against the official university roster. 
        Personal emails are accepted but must match a registered student record.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#4B5563', lineHeight: 22, marginBottom: 32, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 16, fontSize: 16, marginBottom: 16, backgroundColor: '#F9FAFB' },
  button: { backgroundColor: '#059669', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 12, color: '#6B7280', fontSize: 13 },
  
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 14, backgroundColor: '#fff' },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  googleText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  
  helpText: { marginTop: 24, fontSize: 12, color: '#6B7280', textAlign: 'center', lineHeight: 18 }
});
