import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from '@/services/jobs.service';
import { Job } from '@/types/job';

/**
 * React Query hook for fetching and caching job listings from Supabase.
 *
 * Automatically refetches when the search query changes and manages
 * caching, background loading state, network error state, and refetch capabilities.
 *
 * @param searchQuery Filter string for live database search
 */
export function useJobs(searchQuery?: string) {
  const normalizedQuery = searchQuery?.trim() || '';

  const query = useQuery<Job[], Error>({
    queryKey: ['jobs', normalizedQuery],
    queryFn: () => fetchJobs(normalizedQuery),
    staleTime: 1000 * 60 * 2, // 2 minutes cache validity
  });

  return {
    jobs: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
