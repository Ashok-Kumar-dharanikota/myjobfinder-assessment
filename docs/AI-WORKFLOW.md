# Master Workflow Dashboard

Welcome to the development tracking dashboard for **JobFinder**. Detailed chronological prompt histories, technical discussions, and verification results are maintained in dedicated documents under [`docs/workflow/`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/docs/workflow/).

---

## Current Development Phase

**Phase 2: Database Schema & Authentication**
- **Objective:** Establish Supabase PostgreSQL database tables (`jobs`, `profiles`), configure Row Level Security (RLS) policies, implement automatic profile creation trigger (`handle_new_user`), build authentication screens (Login / Register), and manage persistent user sessions.

---

## Phase Overview & Status

| Phase | Title | Status | Documentation |
|---|---|---|---|
| **Phase 0** | Architecture, Requirements Analysis & Planning | Completed | [phase-0-planning.md](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/docs/workflow/phase-0-planning.md) |
| **Phase 1** | Foundation & Dependencies Setup | Completed | [phase-1-foundation.md](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/docs/workflow/phase-1-foundation.md) |
| **Phase 2** | Database Schema & Authentication | In Progress | [phase-2-database-auth.md](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/docs/workflow/phase-2-database-auth.md) |
| **Phase 3** | Job Listing & Live Database Search | Planned | [phase-3-job-listing-search.md](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/docs/workflow/phase-3-job-listing-search.md) |
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

## Current Phase Progress (Phase 2)

### Completed Tasks
- [x] Defined minimum database schema (`profiles`, `jobs`) with columns, constraints, and indexes.
- [x] Hardened `handle_new_user()` `SECURITY DEFINER` trigger with `SET search_path = ''` and clean direct insert.
- [x] Implemented `handle_profile_update()` as `SECURITY INVOKER` with `SET search_path = ''`, protecting immutable identity fields (`email`, `id`, `created_at`).
- [x] Made schema creation idempotent (`DROP POLICY IF EXISTS`, `CREATE OR REPLACE FUNCTION`).
- [x] Decoupled synthetic seed data into dedicated [`supabase/seed.sql`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/supabase/seed.sql) with fixed deterministic UUIDs and `ON CONFLICT (id) DO NOTHING`.
- [x] Formulated comprehensive 7-scenario RLS and trigger verification matrix.

### Pending Tasks
- [ ] User review and sequential execution of [`supabase/schema.sql`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/supabase/schema.sql) and [`supabase/seed.sql`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/supabase/seed.sql) in Supabase SQL Editor.
- [ ] Verification of schema tables, RLS policies, and triggers via client queries.
- [ ] Implementation of `AuthContext` (`src/context/auth-context.tsx`).
- [ ] Build login/registration screen (`src/app/(auth)/login.tsx`) with validation and error alerts.
- [ ] Set up route protection in `src/app/_layout.tsx`.

---

## Outstanding Issues & Decisions

1. **Scope Boundary Protocol:** No SQL execution, table creation, or UI code implementation will take place without explicit user approval.
2. **Empty Search Path Hardening:** `SET search_path = ''` applied to trigger functions with explicit schema qualifiers (`pg_catalog`, `public`) to maximize security.
3. **Least Privilege Enforcement:** `handle_profile_update()` configured as `SECURITY INVOKER` since elevated privileges are unnecessary.
4. **Documented Email Sync Limitation:** `profiles.email` is mirrored upon initial user creation. If a user updates their email in Supabase Auth, `profiles.email` will not dynamically reflect the change without an additional update trigger, which remains intentionally deferred per scope boundaries.

---

## Next Recommended Action

User reviews the final corrected [`supabase/schema.sql`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/supabase/schema.sql) and [`supabase/seed.sql`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/Job/Assessments/myjobfinder/supabase/seed.sql), executes them in the Supabase SQL Editor, and grants approval to run automated verification checks and begin authentication development.





