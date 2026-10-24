const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration in environment.');
  process.exit(1);
}

const client = createClient(supabaseUrl, supabaseAnonKey);

async function fetchJobsWithQuery(searchQuery) {
  let query = client
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (searchQuery && searchQuery.trim().length > 0) {
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
    throw new Error(`Query failed: ${error.message}`);
  }
  return data || [];
}

async function runVerification() {
  console.log('--- Phase 3 Live Supabase Verification ---');
  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
    }
  }

  try {
    // 1. Fetch all active jobs (empty query)
    const allJobs = await fetchJobsWithQuery('');
    assert(allJobs.length === 6, `Retrieve all 6 active jobs from Supabase (found: ${allJobs.length})`);

    // Verify all required fields exist on jobs
    const sample = allJobs[0];
    assert(
      sample.id && sample.title && sample.company && sample.location &&
      sample.employment_type && sample.workplace_type && sample.salary_range &&
      sample.description && Array.isArray(sample.requirements),
      'Job record contains all required fields (id, title, company, location, salary, employment_type, workplace_type)'
    );

    // 2. Search by Title: "React"
    const reactJobs = await fetchJobsWithQuery('React');
    assert(
      reactJobs.length === 1 && reactJobs[0].title.includes('React'),
      `Search by title "React" returns 1 record: "${reactJobs[0]?.title}"`
    );

    // 3. Search by Company: "Aura"
    const auraJobs = await fetchJobsWithQuery('Aura');
    assert(
      auraJobs.length === 1 && auraJobs[0].company.includes('Aura'),
      `Search by company "Aura" returns 1 record: "${auraJobs[0]?.company}"`
    );

    // 4. Search by Location: "Remote"
    const remoteJobs = await fetchJobsWithQuery('Remote');
    assert(
      remoteJobs.length === 3 && remoteJobs.every(j => j.location.toLowerCase().includes('remote')),
      `Search by location "Remote" returns 3 records (found: ${remoteJobs.length})`
    );

    // 5. Search by Location: "Pune"
    const puneJobs = await fetchJobsWithQuery('Pune');
    assert(
      puneJobs.length === 1 && puneJobs[0].location.includes('Pune'),
      `Search by location "Pune" returns 1 record: "${puneJobs[0]?.location}"`
    );

    // 6. Search with multi-word and commas: "Bengaluru, India"
    const blrJobs = await fetchJobsWithQuery('Bengaluru, India');
    assert(
      blrJobs.length === 1 && blrJobs[0].location.includes('Bengaluru'),
      `Search with commas "Bengaluru, India" safely executes and returns 1 record: "${blrJobs[0]?.location}"`
    );

    // 7. Search for non-existent keyword (Empty State)
    const emptyResults = await fetchJobsWithQuery('NonExistentJob12345');
    assert(
      emptyResults.length === 0,
      `Non-existent keyword search returns 0 records for empty state handling (found: ${emptyResults.length})`
    );

    // 8. Verify inactive jobs remain excluded
    const inactiveDirect = await client.from('jobs').select('*').eq('is_active', false);
    assert(
      (inactiveDirect.data || []).length === 0,
      'Inactive jobs are completely excluded by RLS and query filters'
    );

    console.log(`\nVerification Summary: ${passed}/${total} checks passed.`);
    if (passed !== total) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Verification failed with exception:', err);
    process.exit(1);
  }
}

runVerification();
