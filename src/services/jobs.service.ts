import { supabase } from '@/services/supabase';
import { Job } from '@/types/job';

/**
 * Fetches active job listings directly from Supabase public.jobs table.
 *
 * Performs multi-field search directly on the database using PostgREST ilike filters
 * across job title, company name, and location to avoid fetching all records to the client.
 *
 * @param searchQuery Optional search string to filter by title, company, or location
 * @returns Array of active Job records
 */
export async function fetchJobs(searchQuery?: string): Promise<Job[]> {
  let query = supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (searchQuery && searchQuery.trim().length > 0) {
    // Sanitize quotes to preserve PostgREST or-filter parsing
    const cleaned = searchQuery.trim().replace(/"/g, '');
    if (cleaned.length > 0) {
      const pattern = `"%${cleaned}%"`;
      query = query.or(
        `title.ilike.${pattern},company.ilike.${pattern},location.ilike.${pattern}`
      );
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch jobs from database: ${error.message}`);
  }

  return (data as Job[]) || [];
}
