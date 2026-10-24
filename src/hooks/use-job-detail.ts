import { useQuery } from '@tanstack/react-query';
import { fetchJobById } from '@/services/jobs.service';
import { Job } from '@/types/job';

/**
 * React Query hook for fetching and caching a single job detail by ID.
 *
 * @param id Unique UUID of the job
 */
export function useJobDetail(id?: string) {
  const query = useQuery<Job | null, Error>({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id || ''),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return {
    job: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
