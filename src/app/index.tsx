import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/auth-context';
import { useJobs } from '@/hooks/use-jobs';
import { useDebounce } from '@/hooks/use-debounce';
import { JobCard } from '@/components/job-card';
import { SearchBar } from '@/components/search-bar';
import { JobListSkeletonGroup } from '@/components/job-card-skeleton';
import { JobListEmpty } from '@/components/job-list-empty';
import { JobListError } from '@/components/job-list-error';
import { Colors, Spacing } from '@/constants/theme';
import { Job } from '@/types/job';

export default function HomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const isDark = scheme === 'dark';

  const { user, profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 350);

  // TanStack Query hook with live Supabase database search
  const {
    jobs,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useJobs(debouncedSearchQuery);

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
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const renderEmptyState = useCallback(() => {
    if (isLoading) {
      return <JobListSkeletonGroup />;
    }
    if (isError) {
      return (
        <JobListError
          message={error?.message}
          onRetry={() => {
            refetch();
          }}
        />
      );
    }
    return (
      <JobListEmpty
        searchQuery={debouncedSearchQuery || searchQuery}
        onClearSearch={() => setSearchQuery('')}
      />
    );
  }, [isLoading, isError, error?.message, debouncedSearchQuery, searchQuery, refetch]);

  const renderJobItem = useCallback(
    ({ item }: { item: Job }) => (
      <JobCard
        job={item}
        onPress={(selectedJob) => {
          router.push({
            pathname: '/job/[id]',
            params: { id: selectedJob.id },
          });
        }}
      />
    ),
    [router]
  );

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* 
        Fixed Top Header Section: App Bar, Search Input, and Results Heading.
        Placed outside FlatList to guarantee that the SearchBar and TextInput NEVER
        unmount, remount, or lose keyboard focus when typing or when list data updates.
      */}
      <View style={styles.headerContainer}>
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
            <View>
              <Text style={[styles.brandTitle, { color: colors.text }]}>JobFinder</Text>
              <Text style={[styles.greetingSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Find your next career move
              </Text>
            </View>
          </View>

          {/* User Pill with Sign Out */}
          <View style={styles.userControlsGroup}>
            <View
              style={[
                styles.userAvatar,
                { backgroundColor: isDark ? '#3730A3' : '#4F46E5' },
              ]}>
              <Text style={styles.userAvatarText}>{initials || 'U'}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.signOutButton,
                { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
              ]}
              onPress={handleSignOut}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Sign out of JobFinder">
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stable Search Input Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by title, company, or city..."
            onClear={() => setSearchQuery('')}
          />
        </View>

        {/* Section Subheading & Result Counter */}
        <View style={styles.subheadingRow}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            {searchQuery.trim().length > 0 ? 'Search Results' : 'Explore Jobs'}
          </Text>
          {!isLoading && !isError && (
            <View
              style={[
                styles.countPill,
                { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
              ]}>
              <Text style={[styles.countText, { color: isDark ? '#818CF8' : '#4F46E5' }]}>
                {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Scrollable Job Listing Feed */}
      <FlatList
        data={isLoading || isError ? [] : jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetch();
            }}
            tintColor={isDark ? '#818CF8' : '#4F46E5'}
            colors={['#4F46E5']}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    gap: Spacing.three,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  brandIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  greetingSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  userControlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  signOutButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    marginTop: Spacing.one,
  },
  subheadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.one,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.six,
  },
});
