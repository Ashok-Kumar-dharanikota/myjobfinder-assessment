# Phase 3: Job Listing & Live Database Search

- **Status:** In Progress (Implementation & Automated Verification Complete; Pending User Expo Go Validation)
- **Objective:** Replace temporary home screen with a live job feed querying Supabase `public.jobs` via TanStack Query, build debounced multi-field search, render loading skeletons, handle pull-to-refresh, display empty and connection error states, and preserve authentication & session persistence.

---

## Planned Scope & Tasks
- [x] Define TypeScript interfaces for Job entities matching `public.jobs` schema (`src/types/job.ts`).
- [x] Implement `jobs.service.ts` with Supabase query functions supporting multi-field live search (`title`, `company`, `location`).
- [x] Implement `useDebounce` hook (`src/hooks/use-debounce.ts`) to throttle user search input.
- [x] Build TanStack Query hook (`useJobs`) with caching, background fetching, and pull-to-refresh refetching.
- [x] Build reusable `JobCard` component (`src/components/job-card.tsx`) displaying title, company, location, employment type, workplace badge, skills pills, and salary range.
- [x] Build reusable `SearchBar` component (`src/components/search-bar.tsx`) with focus border styling and instant clear action.
- [x] Build `JobCardSkeleton` and `JobListSkeletonGroup` (`src/components/job-card-skeleton.tsx`) for animated loading states.
- [x] Build `JobListEmpty` (`src/components/job-list-empty.tsx`) for zero search results and empty database feeds.
- [x] Build `JobListError` (`src/components/job-list-error.tsx`) for network or database errors with retry capability.
- [x] Replace temporary home screen (`src/app/index.tsx`) with high-performance `FlatList` feed, pull-to-refresh, results counter, and user profile header with sign-out.
- [x] Run TypeScript (`npx tsc --noEmit`) and ESLint (`npx expo lint`) verification.
- [x] Execute automated verification tests against live Supabase database verifying 9/9 scenarios.
- [ ] User manual verification on physical device in Expo Go (feed rendering, live search, empty state, pull-to-refresh, sign-out).

---

## Prompt History

### Prompt #17
- **Timestamp:** 2026-10-24 15:23:21 IST
- **Original User Prompt:**
  > I have completed Phase 2, including successful manual authentication testing in Expo Go.
  > 
  > I approve proceeding with **Phase 3 — Job Listing & Live Database Search**.
  > 
  > ### Implementation
  > 
  > 1. Review the approved implementation plan, AGENTS.md, and existing project structure.
  > 2. Replace the temporary authenticated home screen with a job listing screen.
  > 3. Retrieve job records directly from the existing Supabase `public.jobs` table. Display only active jobs.
  > 4. Create reusable job card components displaying relevant information such as:
  >    - Job title
  >    - Company name
  >    - Location
  >    - Employment type
  >    - Salary range
  > 5. Implement search using Supabase queries, allowing users to search by job title, company, or location. Avoid fetching all records and performing search only on the client.
  > 6. Use the existing TanStack Query setup for data fetching, caching, loading, and error handling.
  > 7. Implement appropriate loading, empty, and network-error states.
  > 8. Preserve existing authentication, protected navigation, session persistence, and logout functionality.
  > 
  > ### Code Quality
  > 
  > Follow the existing architecture and coding conventions.
  > Keep components reusable, separate UI from data-fetching logic, and avoid unnecessary dependencies or complexity.
  > 
  > ### Verification
  > 
  > - Run TypeScript and ESLint checks.
  > - Verify that job records come from Supabase.
  > - Verify search results against actual database records.
  > - Verify loading, empty, and error states.
  > - Identify any functionality requiring manual testing in Expo Go.
  > 
  > ### Documentation
  > 
  > Follow AGENTS.md.
  > Update the master dashboard and `docs/workflow/phase-3-job-listing-search.md` with the prompt history, implementation details, decisions, actual verification results, completed actions [x], and pending actions [ ].
  > 
  > ### Scope
  > 
  > Do not implement the job detail screen, advanced filters, bookmarks, or optional features.
  > Do not modify database schemas, RLS policies, or authentication settings.
  > Do not proceed to Phase 4 without my approval.
  > 
  > After implementation, provide a concise summary and manual testing checklist.

- **Associated Phase:** Phase 3: Job Listing & Live Database Search
- **Discussion & Implementation Summary:**
  Implemented the entire Phase 3 architecture cleanly separating presentation, state management, and data-fetching:
  1. **Type Definitions (`src/types/job.ts`):** Defined `Job`, `WorkplaceType`, and `EmploymentType` mapping exactly to the Supabase `public.jobs` PostgreSQL schema.
  2. **Data-Fetching Service (`src/services/jobs.service.ts`):** Implemented `fetchJobs(searchQuery)` querying live Supabase database with `is_active = true` and `created_at DESC` ordering. Engineered robust database-side multi-field searching using PostgREST `.or()` with double-quote escaping to safely handle commas and special characters in queries like `"Bengaluru, India"`.
  3. **Debounced Search Hook (`src/hooks/use-debounce.ts`):** Built a 350ms debounce hook preventing excessive network calls while the user types.
  4. **TanStack Query Hook (`src/hooks/use-jobs.ts`):** Integrated with `@tanstack/react-query`, leveraging automatic background caching (2-minute `staleTime`), loading indicators, error objects, and refetch capabilities.
  5. **Component Suite:**
     - `JobCard` (`src/components/job-card.tsx`): Displays company avatar initials, job title, company name, workplace type badge (Remote, Hybrid, On-site with theme-tailored color accents), location, employment type, skills preview pills (up to 3 requirements + count badge), formatted salary range, and subtle chevron affordance.
     - `SearchBar` (`src/components/search-bar.tsx`): Search input with focus highlighting and instant clear (`x`) button.
     - `JobCardSkeleton` & `JobListSkeletonGroup` (`src/components/job-card-skeleton.tsx`): Pulse loading skeleton matching card layout, compliant with React 19 render rules via `useState` initializer.
     - `JobListEmpty` (`src/components/job-list-empty.tsx`): Informative empty state for zero search results with a "Clear Search Filters" action.
     - `JobListError` (`src/components/job-list-error.tsx`): Network/database error state with a "Try Again" retry action.
  6. **Authenticated Home Screen (`src/app/index.tsx`):** Replaced temporary Phase 2 verification view with a `FlatList` feed. Maintained user avatar, candidate greeting, and functional sign-out action preserving existing session persistence and route protection.
- **Actions Performed:**
  - [x] Created `src/types/job.ts`.
  - [x] Created `src/services/jobs.service.ts` with Supabase live query and server-side multi-field search.
  - [x] Created `src/hooks/use-debounce.ts`.
  - [x] Created `src/hooks/use-jobs.ts` with TanStack Query.
  - [x] Created `src/components/job-card.tsx`.
  - [x] Created `src/components/search-bar.tsx`.
  - [x] Created `src/components/job-card-skeleton.tsx`.
  - [x] Created `src/components/job-list-empty.tsx`.
  - [x] Created `src/components/job-list-error.tsx`.
  - [x] Updated `src/app/index.tsx` to render the live job listing and search screen.
  - [x] Resolved React Native `RefreshControl.onRefresh` typing requirement.
  - [x] Resolved React 19 ESLint `react-hooks/refs` rule on animated skeleton values.
  - [x] Executed TypeScript check (`npx tsc --noEmit`) -> 0 errors.
  - [x] Executed ESLint check (`npx expo lint`) -> 0 errors.
  - [x] Created automated verification test suite (`scripts/verify-phase-3.cjs`) and executed it against the live Supabase database -> 9/9 tests passed.
  - [x] Updated master workflow dashboard (`docs/AI-WORKFLOW.md`).
- **Actions Not Performed / Pending:**
  - [ ] Physical device manual testing in Expo Go (feed rendering, live search, pull-to-refresh, empty state, logout).
  - [ ] Implementation of Job Detail Screen (strictly deferred to Phase 4).
  - [ ] Advanced filter modals or bookmarking (strictly deferred to Optional Backlog).
- **Decisions & Guidelines Adopted:**
  - *Server-Side vs Client-Side Filtering:* All filtering is performed directly in PostgreSQL via Supabase PostgREST `.or()` logic (`title.ilike`, `company.ilike`, `location.ilike`), avoiding fetching full datasets over the mobile network.
  - *PostgREST Delimiter Escaping:* PostgREST parses commas and parentheses as syntax delimiters. Search terms are sanitized by stripping internal double quotes and wrapping in double-quoted literals (`"%term%"`), enabling safe search for phrases with commas such as `"Bengaluru, India"`.
  - *React 19 Animation Primitives:* To satisfy React 19's `react-hooks/refs` lint rule prohibiting accessing `.current` during render, `Animated.Value` instances are created using `useState(() => new Animated.Value(...))` lazy initializers.
  - *Session & Navigation Continuity:* Preserved user profile display and logout confirmation in the app bar, ensuring seamless authenticated state management.
- **Files Modified / Created:**
  - `src/types/job.ts` (created)
  - `src/services/jobs.service.ts` (created)
  - `src/hooks/use-debounce.ts` (created)
  - `src/hooks/use-jobs.ts` (created)
  - `src/components/job-card.tsx` (created)
  - `src/components/search-bar.tsx` (created)
  - `src/components/job-card-skeleton.tsx` (created)
  - `src/components/job-list-empty.tsx` (created)
  - `src/components/job-list-error.tsx` (created)
  - `src/app/index.tsx` (modified)
  - `scripts/verify-phase-3.cjs` (created)
  - `docs/workflow/phase-3-job-listing-search.md` (updated)
  - `docs/AI-WORKFLOW.md` (updated)
- **Tests Performed & Actual Results:**
  - **Static Analysis & Type Checks:**
    - `npx tsc --noEmit` -> 0 errors (clean exit 0).
    - `npx expo lint` -> 0 errors (clean exit 0).
  - **Live Supabase Automated Query Verification (`scripts/verify-phase-3.cjs`):**
    - `[PASS]` Retrieve all 6 active jobs from Supabase (found: 6).
    - `[PASS]` Job record contains all required fields (`id`, `title`, `company`, `location`, `salary_range`, `employment_type`, `workplace_type`).
    - `[PASS]` Search by title "React" returns 1 record: "Senior React Native Engineer".
    - `[PASS]` Search by company "Aura" returns 1 record: "Aura Data Solutions".
    - `[PASS]` Search by location "Remote" returns 3 records.
    - `[PASS]` Search by location "Pune" returns 1 record: "Pune, India".
    - `[PASS]` Search with commas "Bengaluru, India" safely executes and returns 1 record.
    - `[PASS]` Non-existent keyword search returns 0 records (triggers empty state view).
    - `[PASS]` Inactive jobs are completely excluded by RLS and query filters.
    - Summary: 9/9 automated tests passed against live database.
- **Next Recommended Action:**
  User performs manual verification in Expo Go on mobile device and provides approval to proceed to Phase 4 (Job Detail Screen).
