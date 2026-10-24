import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '@/constants/theme';

interface JobListErrorProps {
  message?: string;
  onRetry: () => void;
}

export function JobListError({ message, onRetry }: JobListErrorProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
          },
        ]}>
        <Ionicons
          name="cloud-offline-outline"
          size={36}
          color={isDark ? '#F87171' : '#DC2626'}
        />
      </View>

      <Text style={[styles.title, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
        Unable to load jobs
      </Text>

      <Text style={[styles.description, { color: isDark ? '#94A3B8' : '#64748B' }]}>
        {message ||
          'A network error occurred while retrieving jobs from the Supabase database. Please verify your internet connection and try again.'}
      </Text>

      <TouchableOpacity
        onPress={onRetry}
        activeOpacity={0.8}
        style={[
          styles.retryButton,
          { backgroundColor: isDark ? '#3730A3' : '#4F46E5' },
        ]}>
        <Ionicons name="reload" size={16} color="#FFFFFF" />
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
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
    maxWidth: 320,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    borderRadius: 12,
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
