import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '@/constants/theme';

interface JobListEmptyProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function JobListEmpty({ searchQuery, onClearSearch }: JobListEmptyProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const isSearchActive = Boolean(searchQuery && searchQuery.trim().length > 0);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
          },
        ]}>
        <Ionicons
          name={isSearchActive ? 'search-outline' : 'briefcase-outline'}
          size={36}
          color={isDark ? '#818CF8' : '#4F46E5'}
        />
      </View>

      <Text style={[styles.title, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
        {isSearchActive ? 'No matching jobs' : 'No jobs available'}
      </Text>

      <Text style={[styles.description, { color: isDark ? '#94A3B8' : '#64748B' }]}>
        {isSearchActive
          ? `We couldn't find any job postings matching "${searchQuery}". Try searching with different keywords like role, company, or city.`
          : 'There are currently no active job openings available. Please check back later.'}
      </Text>

      {isSearchActive && onClearSearch && (
        <TouchableOpacity
          onPress={onClearSearch}
          activeOpacity={0.8}
          style={[
            styles.clearButton,
            { backgroundColor: isDark ? '#3730A3' : '#4F46E5' },
          ]}>
          <Ionicons name="refresh-outline" size={16} color="#FFFFFF" />
          <Text style={styles.clearButtonText}>Clear Search Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    borderRadius: 12,
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
