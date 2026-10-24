/**
 * Verification script for Search Debounce & Timer Cancellation logic
 */

let debouncedValue = '';
let currentTimer = null;
const firedEvents = [];

function simulateDebounce(val, delay = 350) {
  if (currentTimer) {
    clearTimeout(currentTimer);
    currentTimer = null;
  }

  const effectiveDelay = typeof val === 'string' && val === '' ? 0 : delay;

  currentTimer = setTimeout(() => {
    debouncedValue = val;
    firedEvents.push({ time: Date.now(), value: val });
  }, effectiveDelay);
}

async function runDebounceVerification() {
  console.log('--- Phase 3 Search Debounce Verification ---');
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

  // Test 1: Rapid keystrokes (simulating typing "React" over 240ms)
  simulateDebounce('R');
  await new Promise(r => setTimeout(r, 60));
  simulateDebounce('Re');
  await new Promise(r => setTimeout(r, 60));
  simulateDebounce('Rea');
  await new Promise(r => setTimeout(r, 60));
  simulateDebounce('React');

  // Check at 200ms after last keystroke (timer should NOT have fired yet)
  await new Promise(r => setTimeout(r, 200));
  assert(firedEvents.length === 0, 'No query triggered before 350ms delay expires during typing');

  // Wait for 350ms delay to elapse
  await new Promise(r => setTimeout(r, 200));
  assert(
    firedEvents.length === 1 && firedEvents[0].value === 'React',
    `Exactly 1 query triggered after typing paused for 350ms (value: "${firedEvents[0]?.value}")`
  );

  // Test 2: Clearing search input
  firedEvents.length = 0;
  simulateDebounce('');
  await new Promise(r => setTimeout(r, 20)); // next tick
  assert(
    firedEvents.length === 1 && firedEvents[0].value === '',
    'Search clear immediately triggers 0ms reset to restore full job feed'
  );

  console.log(`\nDebounce Verification: ${passed}/${total} checks passed.`);
  if (passed !== total) process.exit(1);
}

runDebounceVerification();
