# Master Workflow Dashboard

Welcome to the development tracking dashboard for **JobFinder**. Detailed chronological prompt histories, technical discussions, and verification results are maintained in dedicated documents under [`docs/workflow/`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/docs/workflow/).

---

## Current Development Phase

**Phase 3: Job Listing & Live Database Search**
- **Objective:** Replace temporary home screen with a live job feed querying Supabase `public.jobs` via TanStack Query, build debounced multi-field search, render loading skeletons, handle pull-to-refresh, display empty and connection error states, and preserve authentication & session persistence.

---

## Phase Overview & Status

| Phase | Title | Status | Documentation |
|---|---|---|---|
| **Phase 0** | Architecture, Requirements Analysis & Planning | Completed | [phase-0-planning.md](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/docs/workflow/phase-0-planning.md) |
| **Phase 1** | Foundation & Dependencies Setup | Completed | [phase-1-foundation.md](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/docs/workflow/phase-1-foundation.md) |
| **Phase 2** | Database Schema & Authentication | Completed | [phase-2-database-auth.md](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/docs/workflow/phase-2-database-auth.md) |
| **Phase 3** | Job Listing & Live Database Search | In Progress | [phase-3-job-listing-search.md](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/docs/workflow/phase-3-job-listing-search.md) |
| **Phase 4** | Job Detail Screen | Planned | [phase-4-job-detail.md](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/docs/workflow/phase-4-job-detail.md) |
| **Phase 5** | Polish, End-to-End Verification & Expo Go Validation | Planned | [phase-5-polish-verification.md](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/docs/workflow/phase-5-polish-verification.md) |

### Optional Backlog (Deferred Post-Core)
- Guest Browsing Mode
- Bookmarking / Saved Jobs (`saved_jobs` table)
- Application Submission flow
- Multi-Criteria Filters Modal (Salary, Experience, Workplace Type)
- Skills Match Score Calculation
- Extensive Profile & Theme Customization Settings

---

## Current Phase Progress (Phase 3 - In Progress)

### Completed Tasks
- [x] Defined TypeScript interfaces for Job entities matching `public.jobs` schema (`src/types/job.ts`).
- [x] Implemented `jobs.service.ts` with Supabase query functions supporting multi-field live search (`title`, `company`, `location`).
- [x] Implemented `useDebounce` hook (`src/hooks/use-debounce.ts`) with 350ms throttle.
- [x] Built TanStack Query hook (`useJobs`) with caching, background fetching, and pull-to-refresh refetching.
- [x] Built reusable `JobCard` component (`src/components/job-card.tsx`) displaying title, company, location, employment type, workplace badge, skills pills, and salary range.
- [x] Built reusable `SearchBar` component (`src/components/search-bar.tsx`) with focus border styling and instant clear action.
- [x] Built `JobCardSkeleton` and `JobListSkeletonGroup` (`src/components/job-card-skeleton.tsx`) for animated loading states.
- [x] Built `JobListEmpty` (`src/components/job-list-empty.tsx`) for zero search results and empty database feeds.
- [x] Built `JobListError` (`src/components/job-list-error.tsx`) for network or database errors with retry capability.
- [x] Replaced temporary home screen (`src/app/index.tsx`) with high-performance `FlatList` feed, pull-to-refresh, results counter, and user profile header with sign-out.
- [x] Passed TypeScript type checks (`npx tsc --noEmit`) with 0 errors.
- [x] Passed ESLint checks (`npx expo lint`) with 0 errors.
- [x] Automated live Supabase testing completed with 9/9 verification checks passed (`scripts/verify-phase-3.cjs`).

### Pending Tasks
- [ ] User manual verification on physical device in Expo Go (feed rendering, live search, pull-to-refresh, empty state, logout).
- [ ] User approval to conclude Phase 3 and advance to Phase 4 (Job Detail Screen).

---

## Outstanding Issues & Decisions

1. **Server-Side Multi-Field Search:** Implemented directly in PostgreSQL using PostgREST `.or()` logic (`title.ilike`, `company.ilike`, `location.ilike`) with double-quote escaping to safely support multi-word search queries and comma-containing locations (e.g. `"Bengaluru, India"`).
2. **React 19 Lint Compliance:** Resolved `react-hooks/refs` lint rule by initializing animated values via `useState(() => new Animated.Value(...))` lazy initializers.
3. **Session & Auth Continuity:** Authenticated candidate profile header and sign-out functionality remain fully integrated into the home screen layout, preserving protected navigation.

---

## Next Recommended Action

User tests the job feed, search functionality, pull-to-refresh, and empty state in Expo Go on physical mobile device, then grants approval to advance to **Phase 4: Job Detail Screen**.
