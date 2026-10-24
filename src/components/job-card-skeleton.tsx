import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, useColorScheme } from 'react-native';
import { Spacing } from '@/constants/theme';

export function JobCardSkeleton() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [opacityAnim] = useState(() => new Animated.Value(0.3));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [opacityAnim]);

  const skeletonColor = isDark ? '#334155' : '#E2E8F0';

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderColor: isDark ? '#334155' : '#E2E8F0',
        },
      ]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Animated.View
          style={[
            styles.avatarSkeleton,
            { backgroundColor: skeletonColor, opacity: opacityAnim },
          ]}
        />
        <View style={styles.titleGroup}>
          <Animated.View
            style={[
              styles.titleSkeleton,
              { backgroundColor: skeletonColor, opacity: opacityAnim },
            ]}
          />
          <Animated.View
            style={[
              styles.subtitleSkeleton,
              { backgroundColor: skeletonColor, opacity: opacityAnim },
            ]}
          />
        </View>
        <Animated.View
          style={[
            styles.badgeSkeleton,
            { backgroundColor: skeletonColor, opacity: opacityAnim },
          ]}
        />
      </View>

      {/* Meta */}
      <View style={styles.metaRow}>
        <Animated.View
          style={[
            styles.metaSkeleton,
            { backgroundColor: skeletonColor, opacity: opacityAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.metaSmallSkeleton,
            { backgroundColor: skeletonColor, opacity: opacityAnim },
          ]}
        />
      </View>

      {/* Footer */}
      <View
        style={[
          styles.footerRow,
          { borderTopColor: isDark ? '#334155' : '#F1F5F9' },
        ]}>
        <Animated.View
          style={[
            styles.salarySkeleton,
            { backgroundColor: skeletonColor, opacity: opacityAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.btnSkeleton,
            { backgroundColor: skeletonColor, opacity: opacityAnim },
          ]}
        />
      </View>
    </View>
  );
}

export function JobListSkeletonGroup() {
  return (
    <View style={styles.groupContainer}>
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    paddingTop: Spacing.one,
  },
  cardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    gap: Spacing.three,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatarSkeleton: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  titleGroup: {
    flex: 1,
    gap: 6,
  },
  titleSkeleton: {
    height: 16,
    width: '75%',
    borderRadius: 4,
  },
  subtitleSkeleton: {
    height: 12,
    width: '45%',
    borderRadius: 4,
  },
  badgeSkeleton: {
    width: 60,
    height: 24,
    borderRadius: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  metaSkeleton: {
    height: 12,
    width: 120,
    borderRadius: 4,
  },
  metaSmallSkeleton: {
    height: 12,
    width: 70,
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  salarySkeleton: {
    height: 14,
    width: 110,
    borderRadius: 4,
  },
  btnSkeleton: {
    height: 14,
    width: 40,
    borderRadius: 4,
  },
});
