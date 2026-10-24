import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, 
  SafeAreaView, Dimensions, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const IS_TABLET = width >= 768;

// Blueprint §2.1 Navigation Items
const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home-outline' },
  { id: 'services', label: 'Services', icon: 'grid-outline' },
  { id: 'communities', label: 'Communities', icon: 'people-outline' },
  { id: 'support', label: 'Support', icon: 'heart-outline' },
  { id: 'profile', label: 'Profile', icon: 'person-outline' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Responsive Button Component (Blueprint §4.1)
  const ResponsiveButton = ({ title, onPress, variant = 'primary', icon }) => {
    const baseStyle = [
      styles.button,
      variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
      IS_TABLET && styles.tabletButton
    ];
    
    return (
      <TouchableOpacity style={baseStyle} onPress={onPress} activeOpacity={0.8}>
        {icon && <Ionicons name={icon} size={20} color={variant === 'primary' ? '#fff' : '#059669'} style={styles.buttonIcon} />}
        <Text style={[
          styles.buttonText,
          variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText
        ]}>{title}</Text>
      </TouchableOpacity>
    );
  };

  // Screen Content Based on Active Tab
  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.welcomeTitle}>Welcome to MUT Community</Text>
            <Text style={styles.welcomeSubtitle}>Verified identity • Authoritative information • Confidential support</Text>
            
            <View style={styles.quickActionsGrid}>
              <ResponsiveButton title="Verify Registration" icon="checkmark-circle-outline" onPress={() => {}} />
              <ResponsiveButton title="Official Announcements" icon="megaphone-outline" onPress={() => {}} variant="secondary" />
              <ResponsiveButton title="Service Directory" icon="search-outline" onPress={() => setActiveTab('services')} variant="secondary" />
              <ResponsiveButton title="Welfare Support" icon="shield-checkmark-outline" onPress={() => setActiveTab('support')} variant="secondary" />
            </View>
          </View>
        );
      
      case 'services':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Service Directory</Text>
            <Text style={styles.sectionDesc}>Searchable campus services with eligibility & requirements</Text>
            <ResponsiveButton title="Graduation Clearance" icon="document-text-outline" onPress={() => {}} />
            <ResponsiveButton title="Library Services" icon="book-outline" onPress={() => {}} variant="secondary" />
            <ResponsiveButton title="Student Affairs" icon="business-outline" onPress={() => {}} variant="secondary" />
          </View>
        );
      
      case 'communities':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>School of Business Communities</Text>
            <Text style={styles.sectionDesc}>Hierarchical structure: School → Department → Class</Text>
            <ResponsiveButton title="Department of Accounting" icon="school-outline" onPress={() => {}} />
            <ResponsiveButton title="ACCT101 Cohort" icon="people-outline" onPress={() => {}} variant="secondary" />
            <ResponsiveButton title="MKT201 Digital Marketing" icon="people-outline" onPress={() => {}} variant="secondary" />
          </View>
        );
      
      case 'support':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.warningTitle}>️ Not an Emergency Channel</Text>
            <Text style={styles.warningText}>For immediate danger, contact Campus Security: +254 XXX XXX XXX</Text>
            <ResponsiveButton title="Confidential Welfare Intake" icon="lock-closed-outline" onPress={() => {}} />
            <ResponsiveButton title="Report Concern" icon="alert-circle-outline" onPress={() => {}} variant="secondary" />
          </View>
        );
      
      default:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Text style={styles.sectionDesc}>Verified identity & institutional membership</Text>
            <ResponsiveButton title="View Verification Status" icon="badge-outline" onPress={() => {}} />
            <ResponsiveButton title="My Communities" icon="list-outline" onPress={() => setActiveTab('communities')} variant="secondary" />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header with Menu Toggle */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} style={styles.menuToggle}>
          <Ionicons name={isMenuOpen ? "close" : "menu"} size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MUT Social Community</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Full-Screen Overlay Menu (Blueprint §2.1) */}
      {isMenuOpen && (
        <View style={styles.menuOverlay}>
          <ScrollView style={styles.menuContent}>
            {NAV_ITEMS.map(item => (
              <TouchableOpacity 
                key={item.id}
                style={[
                  styles.menuItem,
                  activeTab === item.id && styles.activeMenuItem
                ]}
                onPress={() => {
                  setActiveTab(item.id);
                  setIsMenuOpen(false);
                }}
              >
                <Ionicons 
                  name={item.icon} 
                  size={24} 
                  color={activeTab === item.id ? '#059669' : '#374151'} 
                  style={styles.menuIcon}
                />
                <Text style={[
                  styles.menuLabel,
                  activeTab === item.id && styles.activeMenuLabel
                ]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            
            <View style={styles.menuDivider} />
            <Text style={styles.menuSectionTitle}>Account</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <Ionicons name="log-out-outline" size={24} color="#EF4444" style={styles.menuIcon} />
              <Text style={[styles.menuLabel, {color: '#EF4444'}]}>Sign Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Main Content Area */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      {/* Bottom Navigation Bar (Tablet hides, mobile shows) */}
      {!IS_TABLET && (
        <View style={styles.bottomNav}>
          {NAV_ITEMS.slice(0, 4).map(item => (
            <TouchableOpacity 
              key={item.id}
              style={styles.navItem}
              onPress={() => setActiveTab(item.id)}
            >
              <Ionicons 
                name={activeTab === item.id ? item.icon.replace('-outline', '') : item.icon} 
                size={24} 
                color={activeTab === item.id ? '#059669' : '#6B7280'} 
              />
              <Text style={[
                styles.navLabel,
                activeTab === item.id && styles.activeNavLabel
              ]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

// Responsive Styles (Blueprint §4.1 Accessibility)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  menuToggle: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  placeholder: { width: 36 },
  
  // Menu Overlay
  menuOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100 },
  menuContent: { marginTop: 60, backgroundColor: '#fff', flex: 1, padding: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, borderRadius: 8, marginBottom: 4 },
  activeMenuItem: { backgroundColor: '#ECFDF5' },
  menuIcon: { marginRight: 16 },
  menuLabel: { fontSize: 16, color: '#374151', fontWeight: '500' },
  activeMenuLabel: { color: '#059669', fontWeight: '600' },
  menuDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 },
  menuSectionTitle: { fontSize: 12, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  
  // Content
  mainContent: { flex: 1 },
  contentContainer: { padding: 20 },
  welcomeTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
  welcomeSubtitle: { fontSize: 15, color: '#4B5563', lineHeight: 22, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  sectionDesc: { fontSize: 14, color: '#6B7280', marginBottom: 20, lineHeight: 20 },
  warningTitle: { fontSize: 18, fontWeight: '700', color: '#DC2626', marginBottom: 8 },
  warningText: { fontSize: 14, color: '#7F1D1D', marginBottom: 20, lineHeight: 20 },
  
  // Quick Actions Grid
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  // Buttons
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10, marginBottom: 12, minWidth: IS_TABLET ? '48%' : '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  tabletButton: { marginBottom: 16 },
  primaryButton: { backgroundColor: '#059669' },
  secondaryButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB' },
  buttonIcon: { marginRight: 8 },
  buttonText: { fontSize: 15, fontWeight: '600' },
  primaryButtonText: { color: '#fff' },
  secondaryButtonText: { color: '#059669' },
  
  // Bottom Nav
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingBottom: 8, paddingTop: 8 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  navLabel: { fontSize: 11, color: '#6B7280', marginTop: 4 },
  activeNavLabel: { color: '#059669', fontWeight: '600' }
});
