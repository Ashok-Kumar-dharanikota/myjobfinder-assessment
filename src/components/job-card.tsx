import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Job } from '@/types/job';
import { Spacing } from '@/constants/theme';

interface JobCardProps {
  job: Job;
  onPress?: (job: Job) => void;
}

export const JobCard = React.memo(function JobCard({ job, onPress }: JobCardProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Company avatar initials
  const companyInitials = job.company
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Dynamic badge style based on workplace type
  const getWorkplaceBadgeStyle = () => {
    switch (job.workplace_type) {
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
  const visibleRequirements = (job.requirements || []).slice(0, 3);
  const remainingCount = (job.requirements || []).length - visibleRequirements.length;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress?.(job)}
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderColor: isDark ? '#334155' : '#E2E8F0',
        },
      ]}>
      {/* Header: Company Avatar & Title Info */}
      <View style={styles.headerRow}>
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
            {companyInitials || 'CO'}
          </Text>
        </View>

        <View style={styles.titleContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.jobTitle,
              { color: isDark ? '#F8FAFC' : '#0F172A' },
            ]}>
            {job.title}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.companyName,
              { color: isDark ? '#94A3B8' : '#64748B' },
            ]}>
            {job.company}
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

      {/* Meta Row: Location & Employment Type */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons
            name="location-outline"
            size={15}
            color={isDark ? '#94A3B8' : '#64748B'}
          />
          <Text
            numberOfLines={1}
            style={[styles.metaText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
            {job.location}
          </Text>
        </View>

        <View style={styles.metaDivider} />

        <View style={styles.metaItem}>
          <Ionicons
            name="time-outline"
            size={15}
            color={isDark ? '#94A3B8' : '#64748B'}
          />
          <Text
            style={[styles.metaText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
            {job.employment_type}
          </Text>
        </View>
      </View>

      {/* Skills / Requirements Preview Pills */}
      {visibleRequirements.length > 0 && (
        <View style={styles.skillsRow}>
          {visibleRequirements.map((req, idx) => (
            <View
              key={idx}
              style={[
                styles.skillPill,
                {
                  backgroundColor: isDark ? '#0F172A' : '#F1F5F9',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}>
              <Text
                numberOfLines={1}
                style={[
                  styles.skillPillText,
                  { color: isDark ? '#94A3B8' : '#475569' },
                ]}>
                {req}
              </Text>
            </View>
          ))}
          {remainingCount > 0 && (
            <View
              style={[
                styles.skillPill,
                {
                  backgroundColor: isDark ? '#0F172A' : '#F1F5F9',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}>
              <Text
                style={[
                  styles.skillPillText,
                  { color: isDark ? '#818CF8' : '#4F46E5', fontWeight: '600' },
                ]}>
                +{remainingCount}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Footer Row: Compensation */}
      <View
        style={[
          styles.footerRow,
          {
            borderTopColor: isDark ? '#334155' : '#F1F5F9',
          },
        ]}>
        <View style={styles.salaryGroup}>
          <Ionicons
            name="cash-outline"
            size={16}
            color={isDark ? '#34D399' : '#059669'}
          />
          <Text
            style={[
              styles.salaryText,
              { color: isDark ? '#34D399' : '#059669' },
            ]}>
            {job.salary_range}
          </Text>
        </View>

        <View style={styles.viewDetailsRow}>
          <Text
            style={[
              styles.viewDetailsText,
              { color: isDark ? '#818CF8' : '#4F46E5' },
            ]}>
            View
          </Text>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={isDark ? '#818CF8' : '#4F46E5'}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  companyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  companyName: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  workplaceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  workplaceBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '55%',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#94A3B8',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  skillPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    maxWidth: 160,
  },
  skillPillText: {
    fontSize: 11,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: Spacing.two,
    marginTop: 2,
  },
  salaryGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  salaryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
