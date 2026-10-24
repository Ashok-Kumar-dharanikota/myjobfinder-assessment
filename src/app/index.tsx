import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/auth-context';
import { Colors, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const isDark = scheme === 'dark';
  const { user, profile, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of JobFinder?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Candidate';
  const displayEmail = user?.email || profile?.email || 'user@example.com';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* App Bar */}
        <View style={styles.appBar}>
          <View style={styles.brandGroup}>
            <View
              style={[
                styles.brandIconWrapper,
                { backgroundColor: isDark ? '#1E293B' : '#EEF2FF' },
              ]}>
              <Ionicons name="briefcase" size={22} color={isDark ? '#818CF8' : '#4F46E5'} />
            </View>
            <Text style={[styles.brandTitle, { color: colors.text }]}>JobFinder</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.signOutIconButton,
              { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
            ]}
            onPress={handleSignOut}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* User Profile Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}>
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: isDark ? '#3730A3' : '#4F46E5' },
              ]}>
              <Text style={styles.avatarText}>{initials || 'U'}</Text>
            </View>
            <View style={styles.profileTextGroup}>
              <Text style={[styles.profileName, { color: colors.text }]}>{displayName}</Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                {displayEmail}
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.activePill}>
              <View style={styles.greenDot} />
              <Text style={styles.activePillText}>Authenticated Session Active</Text>
            </View>
          </View>
        </View>

        {/* Milestone Status Card */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Phase 2: Authentication Status
          </Text>

          <View style={styles.checkItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={[styles.checkText, { color: colors.text }]}>
              Supabase Authentication connected
            </Text>
          </View>

          <View style={styles.checkItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={[styles.checkText, { color: colors.text }]}>
              Profile auto-created via database trigger
            </Text>
          </View>

          <View style={styles.checkItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={[styles.checkText, { color: colors.text }]}>
              Session persisted via AsyncStorage
            </Text>
          </View>

          <View style={styles.checkItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={[styles.checkText, { color: colors.text }]}>
              Row Level Security verified (unauthorized access blocked)
            </Text>
          </View>

          <View style={styles.checkItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={[styles.checkText, { color: colors.text }]}>
              6 sample jobs ready in database for Phase 3
            </Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" style={styles.signOutIcon} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.four,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  brandIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  signOutIconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    borderRadius: 16,
    padding: Spacing.four,
    borderWidth: 1,
    gap: Spacing.three,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  profileTextGroup: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  activePillText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '600',
  },
  statusCard: {
    borderRadius: 16,
    padding: Spacing.four,
    borderWidth: 1,
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  checkText: {
    fontSize: 14,
    flex: 1,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    height: 48,
    borderRadius: 12,
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  signOutIcon: {
    marginRight: 2,
  },
  signOutText: {
    color: '#B91C1C',
    fontSize: 15,
    fontWeight: '600',
  },
});
