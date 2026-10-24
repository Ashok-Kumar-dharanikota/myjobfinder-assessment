import React, { useState } from 'react';
import {
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useJobDetail } from '@/hooks/use-job-detail';
import { Colors, Spacing } from '@/constants/theme';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const isDark = scheme === 'dark';

  const { job, isLoading, isError, error, refetch } = useJobDetail(id);

  // Animated pulse for loading skeleton
  const [pulseAnim] = useState(() => new Animated.Value(0.3));
  React.useEffect(() => {
    if (!isLoading) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [isLoading, pulseAnim]);

  const handleContactPress = () => {
    if (job?.contact_email) {
      Linking.openURL(`mailto:${job.contact_email}?subject=Application for ${job.title}`).catch(
        () => {}
      );
    }
  };

  const getWorkplaceBadgeStyle = () => {
    switch (job?.workplace_type) {
      case 'Remote':
        return {
          bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
          text: isDark ? '#34D399' : '#059669',
          border: isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0',
        };
      case 'Hybrid':
        return {
          bg: isDark ? 'rgba(99, 102, 241, 0.15)' : '#EEF2FF',
          text: isDark ? '#A5B4FC' : '#4F46E5',
          border: isDark ? 'rgba(99, 102, 241, 0.3)' : '#C7D2FE',
        };
      case 'On-site':
      default:
        return {
          bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB',
          text: isDark ? '#FBBF24' : '#D97706',
          border: isDark ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A',
        };
    }
  };

  const workplaceStyle = getWorkplaceBadgeStyle();
  const companyInitials = job?.company
    ? job.company
        .split(' ')
        .map((w) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'CO';

  // --- Render Loading Skeleton ---
  if (isLoading) {
    const skeletonColor = isDark ? '#334155' : '#E2E8F0';
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
            ]}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={isDark ? '#F8FAFC' : '#0F172A'}
            />
          </TouchableOpacity>
          <Text style={[styles.topBarTitle, { color: colors.text }]}>Job Details</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonCard}>
            <Animated.View
              style={[
                styles.skeletonAvatar,
                { backgroundColor: skeletonColor, opacity: pulseAnim },
              ]}
            />
            <Animated.View
              style={[
                styles.skeletonTitle,
                { backgroundColor: skeletonColor, opacity: pulseAnim },
              ]}
            />
            <Animated.View
              style={[
                styles.skeletonSubtitle,
                { backgroundColor: skeletonColor, opacity: pulseAnim },
              ]}
            />
            <View style={styles.skeletonRow}>
              <Animated.View
                style={[
                  styles.skeletonPill,
                  { backgroundColor: skeletonColor, opacity: pulseAnim },
                ]}
              />
              <Animated.View
                style={[
                  styles.skeletonPill,
                  { backgroundColor: skeletonColor, opacity: pulseAnim },
                ]}
              />
            </View>
          </View>

          <Animated.View
            style={[
              styles.skeletonSection,
              { backgroundColor: skeletonColor, opacity: pulseAnim },
            ]}
          />
          <Animated.View
            style={[
              styles.skeletonSectionSmall,
              { backgroundColor: skeletonColor, opacity: pulseAnim },
            ]}
          />
        </View>
      </SafeAreaView>
    );
  }

  // --- Render Error State ---
  if (isError) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
            ]}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={isDark ? '#F8FAFC' : '#0F172A'}
            />
          </TouchableOpacity>
          <Text style={[styles.topBarTitle, { color: colors.text }]}>Job Details</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.feedbackContainer}>
          <View
            style={[
              styles.feedbackIconCircle,
              { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2' },
            ]}>
            <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
          </View>
          <Text style={[styles.feedbackTitle, { color: colors.text }]}>
            Failed to Load Job
          </Text>
          <Text style={[styles.feedbackSubtitle, { color: colors.textSecondary }]}>
            {error?.message || 'Unable to retrieve this position from the database.'}
          </Text>

          <View style={styles.feedbackActionsRow}>
            <TouchableOpacity
              onPress={() => refetch()}
              style={[
                styles.primaryButton,
                { backgroundColor: isDark ? '#3730A3' : '#4F46E5' },
              ]}>
              <Ionicons name="reload" size={16} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              style={[
                styles.secondaryButton,
                { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
              ]}>
              <Text
                style={[
                  styles.secondaryButtonText,
                  { color: isDark ? '#CBD5E1' : '#475569' },
                ]}>
                Back to Feed
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // --- Render Not Found State ---
  if (!job) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
            ]}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={isDark ? '#F8FAFC' : '#0F172A'}
            />
          </TouchableOpacity>
          <Text style={[styles.topBarTitle, { color: colors.text }]}>Job Details</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.feedbackContainer}>
          <View
            style={[
              styles.feedbackIconCircle,
              { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
            ]}>
            <Ionicons
              name="search-outline"
              size={40}
              color={isDark ? '#818CF8' : '#4F46E5'}
            />
          </View>
          <Text style={[styles.feedbackTitle, { color: colors.text }]}>
            Job Not Found
          </Text>
          <Text style={[styles.feedbackSubtitle, { color: colors.textSecondary }]}>
            This position may have been closed, deleted, or the identifier is invalid.
          </Text>

          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.primaryButton,
              { backgroundColor: isDark ? '#3730A3' : '#4F46E5', marginTop: Spacing.two },
            ]}>
            <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Return to Job Feed</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- Render Complete Job Details ---
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top App Bar with Back Navigation */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
          ]}
          accessibilityLabel="Back to jobs feed">
          <Ionicons
            name="chevron-back"
            size={22}
            color={isDark ? '#F8FAFC' : '#0F172A'}
          />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.text }]}>Job Details</Text>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header Hero Card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}>
          <View style={styles.heroTopRow}>
            <View
              style={[
                styles.companyAvatar,
                { backgroundColor: isDark ? '#334155' : '#EEF2FF' },
              ]}>
              <Text
                style={[
                  styles.avatarText,
                  { color: isDark ? '#818CF8' : '#4F46E5' },
                ]}>
                {companyInitials}
              </Text>
            </View>

            <View
              style={[
                styles.workplaceBadge,
                {
                  backgroundColor: workplaceStyle.bg,
                  borderColor: workplaceStyle.border,
                },
              ]}>
              <Text style={[styles.workplaceBadgeText, { color: workplaceStyle.text }]}>
                {job.workplace_type}
              </Text>
            </View>
          </View>

          <Text style={[styles.jobTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {job.title}
          </Text>

          <Text style={[styles.companyName, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            {job.company}
          </Text>

          {/* Location & Employment Type Meta */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons
                name="location-outline"
                size={16}
                color={isDark ? '#94A3B8' : '#64748B'}
              />
              <Text style={[styles.metaText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                {job.location}
              </Text>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <Ionicons
                name="time-outline"
                size={16}
                color={isDark ? '#94A3B8' : '#64748B'}
              />
              <Text style={[styles.metaText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                {job.employment_type}
              </Text>
            </View>
          </View>
        </View>

        {/* Compensation Banner */}
        <View
          style={[
            styles.compensationCard,
            {
              backgroundColor: isDark ? '#0F172A' : '#F0FDF4',
              borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : '#BBF7D0',
            },
          ]}>
          <View style={styles.compensationLeft}>
            <View
              style={[
                styles.compensationIconWrap,
                { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#DCFCE7' },
              ]}>
              <Ionicons name="cash-outline" size={20} color="#10B981" />
            </View>
            <View>
              <Text style={[styles.compensationLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Estimated Compensation
              </Text>
              <Text style={[styles.compensationValue, { color: isDark ? '#34D399' : '#059669' }]}>
                {job.salary_range}
              </Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View
          style={[
            styles.contentCard,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={isDark ? '#818CF8' : '#4F46E5'}
            />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Role Overview
            </Text>
          </View>
          <Text style={[styles.bodyText, { color: isDark ? '#CBD5E1' : '#334155' }]}>
            {job.description}
          </Text>
        </View>

        {/* Requirements Section */}
        {job.requirements && job.requirements.length > 0 && (
          <View
            style={[
              styles.contentCard,
              {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#E2E8F0',
              },
            ]}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color={isDark ? '#818CF8' : '#4F46E5'}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Requirements & Qualifications
              </Text>
            </View>

            <View style={styles.listContainer}>
              {job.requirements.map((req, idx) => (
                <View key={idx} style={styles.checklistItem}>
                  <View
                    style={[
                      styles.bulletPoint,
                      { backgroundColor: isDark ? '#3730A3' : '#EEF2FF' },
                    ]}>
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={isDark ? '#A5B4FC' : '#4F46E5'}
                    />
                  </View>
                  <Text
                    style={[styles.checklistText, { color: isDark ? '#CBD5E1' : '#334155' }]}>
                    {req}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Responsibilities Section */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <View
            style={[
              styles.contentCard,
              {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#E2E8F0',
              },
            ]}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons
                name="list-outline"
                size={18}
                color={isDark ? '#818CF8' : '#4F46E5'}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Key Responsibilities
              </Text>
            </View>

            <View style={styles.listContainer}>
              {job.responsibilities.map((resp, idx) => (
                <View key={idx} style={styles.checklistItem}>
                  <View
                    style={[
                      styles.bulletPoint,
                      { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
                    ]}>
                    <Ionicons
                      name="arrow-forward"
                      size={11}
                      color={isDark ? '#94A3B8' : '#64748B'}
                    />
                  </View>
                  <Text
                    style={[styles.checklistText, { color: isDark ? '#CBD5E1' : '#334155' }]}>
                    {resp}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact Employer Section */}
        {job.contact_email && (
          <View
            style={[
              styles.contentCard,
              {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#E2E8F0',
              },
            ]}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={isDark ? '#818CF8' : '#4F46E5'}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Contact Information
              </Text>
            </View>

            <Text style={[styles.bodyText, { color: isDark ? '#CBD5E1' : '#334155' }]}>
              To inquire about this position, contact the hiring team directly:
            </Text>

            <TouchableOpacity
              onPress={handleContactPress}
              activeOpacity={0.8}
              style={[
                styles.contactButton,
                { backgroundColor: isDark ? '#3730A3' : '#4F46E5' },
              ]}>
              <Ionicons name="mail" size={16} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>{job.contact_email}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  topBarSpacer: {
    width: 38,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  heroCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  companyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },
  workplaceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  workplaceBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  companyName: {
    fontSize: 15,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#94A3B8',
  },
  compensationCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: Spacing.three,
  },
  compensationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
  },
  compensationIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compensationLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  compensationValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  contentCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two + 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  listContainer: {
    gap: Spacing.two,
    marginTop: 2,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  bulletPoint: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checklistText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12,
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Skeleton Styles
  skeletonContainer: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  skeletonCard: {
    padding: Spacing.four,
    borderRadius: 18,
    gap: Spacing.two,
  },
  skeletonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    marginBottom: Spacing.one,
  },
  skeletonTitle: {
    height: 24,
    width: '80%',
    borderRadius: 6,
  },
  skeletonSubtitle: {
    height: 16,
    width: '50%',
    borderRadius: 4,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  skeletonPill: {
    height: 24,
    width: 90,
    borderRadius: 8,
  },
  skeletonSection: {
    height: 120,
    borderRadius: 16,
  },
  skeletonSectionSmall: {
    height: 80,
    borderRadius: 16,
  },
  // Feedback Styles
  feedbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  feedbackIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  feedbackSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 300,
  },
  feedbackActionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    borderRadius: 12,
    gap: Spacing.two,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    borderRadius: 12,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
