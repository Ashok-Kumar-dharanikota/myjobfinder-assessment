const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration in environment.');
  process.exit(1);
}

const client = createClient(supabaseUrl, supabaseAnonKey);
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function fetchJobById(id) {
  if (!id || typeof id !== 'string' || !UUID_REGEX.test(id.trim())) {
    return null;
  }

  const { data, error } = await client
    .from('jobs')
    .select('*')
    .eq('id', id.trim())
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch job detail: ${error.message}`);
  }

  return data || null;
}

async function runPhase4Verification() {
  console.log('--- Phase 4 Job Detail Live Verification ---');
  let passed = 0;
  let total = 0;

  function assert(condition, name) {
    total++;
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}`);
    }
  }

  try {
    // 1. Fetch valid job 1 (Nexus Mobile Labs)
    const job1 = await fetchJobById('e0000000-0000-0000-0000-000000000001');
    assert(job1 !== null, 'Fetch valid job by UUID (Nexus Mobile Labs)');
    assert(job1?.title === 'Senior React Native Engineer', `Correct title: "${job1?.title}"`);
    assert(job1?.company === 'Nexus Mobile Labs', `Correct company: "${job1?.company}"`);
    assert(job1?.workplace_type === 'Hybrid', `Correct workplace type: "${job1?.workplace_type}"`);
    assert(job1?.employment_type === 'Full-time', `Correct employment type: "${job1?.employment_type}"`);
    assert(typeof job1?.description === 'string' && job1.description.length > 50, 'Full description text retrieved');
    assert(Array.isArray(job1?.requirements) && job1.requirements.length === 4, `Requirements array retrieved (count: ${job1?.requirements?.length})`);
    assert(Array.isArray(job1?.responsibilities) && job1.responsibilities.length === 4, `Responsibilities array retrieved (count: ${job1?.responsibilities?.length})`);
    assert(job1?.contact_email === 'careers@nexusmobilelabs.io', `Contact email retrieved: "${job1?.contact_email}"`);

    // 2. Fetch valid job 2 (Vertex Cloud Platform)
    const job2 = await fetchJobById('e0000000-0000-0000-0000-000000000002');
    assert(job2 !== null, 'Fetch second valid job by UUID (Vertex Cloud Platform)');
    assert(job2?.title === 'Full Stack TypeScript Developer', `Correct title: "${job2?.title}"`);
    assert(job2?.workplace_type === 'Remote', `Correct workplace type: "${job2?.workplace_type}"`);

    // 3. Non-existent UUID
    const nonExistent = await fetchJobById('00000000-0000-0000-0000-000000000000');
    assert(nonExistent === null, 'Non-existent UUID returns null for not-found handling');

    // 4. Malformed / Invalid UUID strings
    const invalidFormat = await fetchJobById('not-a-valid-uuid');
    assert(invalidFormat === null, 'Invalid UUID format safely returns null without SQL error');

    const emptyId = await fetchJobById('');
    assert(emptyId === null, 'Empty string ID safely returns null');

    const nullId = await fetchJobById(null);
    assert(nullId === null, 'Null ID safely returns null');

    console.log(`\nPhase 4 Verification Summary: ${passed}/${total} checks passed.`);
    if (passed !== total) process.exit(1);
  } catch (err) {
    console.error('Phase 4 verification failed with exception:', err);
    process.exit(1);
  }
}

runPhase4Verification();
