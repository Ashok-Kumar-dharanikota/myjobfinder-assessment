import { useEffect, useState } from 'react';

/**
 * Custom hook to debounce any rapidly changing value.
 *
 * Automatically clears previous pending timers on each value update.
 * If the string value is cleared to empty, updates with 0ms delay to instantly
 * restore full listings without delay.
 *
 * @param value The value to debounce
 * @param delay The delay duration in milliseconds (default: 350ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // If string input is cleared, apply 0ms delay to update on next tick without synchronous setState in effect
    const effectiveDelay = typeof value === 'string' && value === '' ? 0 : delay;

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, effectiveDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
