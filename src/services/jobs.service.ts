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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Fetches a single active job by its unique UUID directly from Supabase.
 *
 * @param id Unique UUID of the job
 * @returns Job object if found and active, or null if not found/invalid
 */
export async function fetchJobById(id: string): Promise<Job | null> {
  if (!id || typeof id !== 'string' || !UUID_REGEX.test(id.trim())) {
    return null;
  }

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id.trim())
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch job detail: ${error.message}`);
  }

  return (data as Job) || null;
}
