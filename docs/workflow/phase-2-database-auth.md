# Phase 2: Database Schema & Authentication

- **Status:** In Progress
- **Objective:** Establish Supabase PostgreSQL database tables (`jobs`, `profiles`), configure Row Level Security (RLS) policies, implement automatic profile creation trigger (`handle_new_user`), build authentication screens (Login / Register), and manage persistent user sessions.

---

## Planned Scope & Tasks
- [x] Design minimum database schema (`profiles`, `jobs`) with columns, constraints, and indexes.
- [x] Design Row Level Security (RLS) policies for user data privacy and job listing visibility.
- [x] Design `handle_new_user()` trigger on `auth.users` for 1:1 profile generation.
- [x] Prepare SQL migration script (`supabase/schema.sql`) with synthetic seed data.
- [x] Formulate post-migration verification criteria.
- [ ] User review and execution of SQL migration in Supabase SQL Editor.
- [ ] Verify tables, RLS policies, and triggers via client queries.
- [ ] Implement `AuthContext` (`src/context/auth-context.tsx`) with login, register, sign out, and session restoration via AsyncStorage.
- [ ] Build login/registration screen (`src/app/(auth)/login.tsx`) with validation and error alerts.
- [ ] Set up route protection in `src/app/_layout.tsx`.

---

## Prompt History

### Prompt #9
- **Timestamp:** 2026-10-24 13:09:14 IST
- **Original User Prompt:**
  > I have reviewed the Phase 1 results and approve marking Phase 1 as completed.
  > 
  > Let's proceed to Phase 2 — Database Schema & Authentication.
  > 
  > For this request, focus only on planning the database structure.
  > 
  > 1. Review the approved implementation plan and existing Supabase configuration.
  > 2. Identify the minimum database tables required for the application.
  > 3. Define the table columns, data types, relationships, and constraints.
  > 4. Propose appropriate Row Level Security (RLS) policies.
  > 5. Explain how Supabase Auth will connect with user profile records.
  > 6. Prepare the required SQL migrations and a small sample dataset for review.
  > 7. Define the verification checks needed after executing the migrations.
  > 
  > Keep the database design simple and avoid optional functionality that is not currently required.
  > 
  > Do not execute SQL, create tables, implement authentication, or modify application code yet.
  > 
  > Follow AGENTS.md and update the Phase 2 workflow documentation and master dashboard.
  > 
  > Present the proposed schema and SQL for my approval before implementation.

- **Associated Phase:** Phase 2: Database Schema & Authentication (Database Structure Planning & Migration Scripting)
- **Discussion & Implementation Summary:**
  Planned the minimum viable relational database schema for JobFinder. Designed 2 tables (`public.profiles` and `public.jobs`) strictly avoiding optional backlog tables (`saved_jobs`, `applications`). Formulated RLS policies for strict privacy on profiles and public read on active jobs. Designed the PostgreSQL trigger function `handle_new_user()` on `auth.users` to automate 1:1 user profile creation on signup. Authored the complete SQL migration file in `supabase/schema.sql` with 6 realistic synthetic tech job postings. Outlined 5 clear verification checks for post-migration execution. Did not execute SQL or modify application code.
- **Actions Performed:**
  - [x] Marked Phase 1 as Completed and Phase 2 as In Progress on the master dashboard.
  - [x] Reviewed requirements and designed minimum database schema (`profiles`, `jobs`).
  - [x] Defined column specifications, primary keys, foreign keys, cascade deletes, and check constraints.
  - [x] Defined Row Level Security (RLS) policies for both tables.
  - [x] Designed `handle_new_user()` security definer trigger for automated 1:1 `auth.users` to `public.profiles` sync.
  - [x] Prepared SQL migration script with synthetic seed data in `supabase/schema.sql`.
  - [x] Formulated 5 post-migration verification checks.
  - [x] Appended Prompt #9 to `docs/workflow/phase-2-database-auth.md`.
  - [x] Updated `docs/AI-WORKFLOW.md` dashboard.
- **Actions Not Performed / Not Verified:**
  - [ ] SQL migration execution in Supabase (deferred pending user review/approval).
  - [ ] Tables creation on live database (deferred pending migration execution).
  - [ ] `AuthContext` implementation (deferred until schema is executed).
  - [ ] Login screen implementation (deferred until schema is executed).
- **Decisions & Guidelines Adopted:**
  - *Schema Minimalism:* Kept database schema strictly limited to `profiles` and `jobs`. Deferred bookmarks, applications, and skill scoring to keep Phase 2 clean and maintainable.
  - *Data Integrity:* Foreign key from `profiles.id` to `auth.users.id` with `ON DELETE CASCADE` guarantees zero orphaned profiles.
  - *RLS Security Boundary:* Authenticated users can only read/update their own profile. Active jobs are publicly viewable by anon and authenticated users, while write access is restricted to service_role / dashboard admin.
- **Files Modified / Created:**
  - `supabase/schema.sql` (created migration file)
  - `docs/workflow/phase-2-database-auth.md` (updated)
  - `docs/AI-WORKFLOW.md` (updated)
- **Tests Performed & Actual Results:**
  - SQL script syntax and constraint review completed.
  - Pre-migration PostgREST verification: `PGRST205` verified in Prompt #8, confirming readiness for table creation.
- **Next Recommended Action:**
  User reviews the proposed schema and SQL migration script in `supabase/schema.sql`, executes it in the Supabase SQL Editor, and provides approval to proceed with `AuthContext` and authentication screen development.

---

### Prompt #10
- **Timestamp:** 2026-10-24 13:19:22 IST
- **Original User Prompt:**
  > I've reviewed the Phase 2 database schema and SQL migration.
  > 
  > Before executing the migration, I want you to review and improve the existing SQL.
  > 
  > Please focus on:
  > 
  > 1. Making migration execution safe and preventing duplicate records if scripts are executed again.
  > 2. Hardening the `handle_new_user()` SECURITY DEFINER function by explicitly setting its search path.
  > 3. Separating database schema creation and synthetic seed data where appropriate.
  > 4. Ensuring authenticated users cannot modify protected profile fields, such as the email associated with Supabase Auth.
  > 5. Reviewing RLS policies and preparing verification checks for authenticated users, anonymous users, unauthorized access, and job visibility.
  > 
  > Keep the schema minimal with only the existing required tables.
  > 
  > Update the SQL files and explain the changes made, but do not execute any SQL or modify application code.
  > 
  > Update the Phase 2 workflow history and master dashboard as required by AGENTS.md.
  > 
  > Present the corrected migration files and verification checklist for my approval before execution.

- **Associated Phase:** Phase 2: Database Schema & Authentication (SQL Hardening, Seed Separation & Migration Safety)
- **Discussion & Implementation Summary:**
  Refactored and hardened the SQL database migration files:
  1. Idempotency & Re-execution Safety: Added `DROP POLICY IF EXISTS` before `CREATE POLICY` to prevent policy conflict errors on rerun. Added `ON CONFLICT (id) DO NOTHING` in seed data.
  2. Security Hardening: Hardened `handle_new_user()` `SECURITY DEFINER` function with explicit `SET search_path = public, auth` to prevent search path hijacking vulnerabilities. Handled potential insert race conditions with `ON CONFLICT (id) DO UPDATE`.
  3. Schema & Seed Separation: Split schema and seed data into separate modular files:
     - `supabase/schema.sql`: Contains pure DDL for tables, triggers, indexes, and RLS policies.
     - `supabase/seed.sql`: Contains 6 synthetic job listings with deterministic UUIDs.
  4. Profile Field Protection: Created a `BEFORE UPDATE` trigger `handle_profile_update()` on `public.profiles` (`SET search_path = public`) that strictly blocks direct mutations to `email` and `id`, preserves `created_at`, and automatically refreshes `updated_at`.
  5. RLS Policy Review & Verification Matrix: Formulated comprehensive verification checks covering anon reads, authenticated own-profile isolation, cross-user privacy, profile immutability triggers, and active vs inactive job visibility.
- **Actions Performed:**
  - [x] Rewrote `supabase/schema.sql` with idempotent DDL, hardened `handle_new_user()` (`SET search_path = public, auth`), and `handle_profile_update()` trigger.
  - [x] Created `supabase/seed.sql` separating seed records with deterministic UUIDs and `ON CONFLICT (id) DO NOTHING`.
  - [x] Defined RLS policies with `DROP POLICY IF EXISTS` for safe re-execution.
  - [x] Verified zero errors on `npx tsc --noEmit` and `npx expo lint`.
  - [x] Appended Prompt #10 to `docs/workflow/phase-2-database-auth.md`.
  - [x] Updated `docs/AI-WORKFLOW.md` dashboard.
- **Actions Not Performed / Not Verified:**
  - [ ] SQL execution on live database (deferred pending user approval).
  - [ ] Tables creation on live database (deferred pending execution).
  - [ ] Application code modification (zero application code modified).
- **Decisions & Guidelines Adopted:**
  - *Hardening Standard:* All `SECURITY DEFINER` functions in PostgreSQL must specify an explicit `search_path` to comply with Supabase security guidelines.
  - *Separation of Concerns:* DDL schema and synthetic seed data are decoupled into `supabase/schema.sql` and `supabase/seed.sql`.
  - *Immutable Identity:* Email and user ID in `public.profiles` cannot be modified directly by client queries; email updates must flow through Supabase Auth.
- **Files Modified / Created:**
  - `supabase/schema.sql` (hardened DDL)
  - `supabase/seed.sql` (separated seed data)
  - `docs/workflow/phase-2-database-auth.md` (updated)
  - `docs/AI-WORKFLOW.md` (updated)
- **Tests Performed & Actual Results:**
  - `npx tsc --noEmit` -> 0 errors (clean exit 0).
  - `npx expo lint` -> 0 errors (clean exit 0).
- **Next Recommended Action:**
  User reviews the hardened `supabase/schema.sql` and `supabase/seed.sql`, executes them sequentially in the Supabase SQL Editor, and provides approval to run automated verification queries and implement authentication.

---

### Prompt #11
- **Timestamp:** 2026-10-24 13:34:23 IST
- **Original User Prompt:**
  > I've reviewed the updated `supabase/schema.sql`.
  > 
  > Before executing the migration, make the following targeted corrections:
  > 
  > 1. Change `handle_new_user()` to use `SET search_path = ''`.
  > 2. Review `handle_profile_update()` and use `SECURITY INVOKER` if elevated privileges are unnecessary. Use an empty search path.
  > 3. Remove the unnecessary `ON CONFLICT DO UPDATE` from the signup trigger unless there is a clear technical reason to retain it.
  > 4. Review the duplicated email field in `profiles`. Explain how it will remain synchronized with Supabase Auth, or document its limitation. Do not add a new email synchronization feature without approval.
  > 5. Verify the SQL definitions and check that existing RLS policies remain unchanged unless a correction is required.
  > 6. Inspect the Git diff and report the exact changes made.
  > 
  > Do not execute SQL against Supabase or modify application code yet.
  > 
  > Update the Phase 2 workflow documentation with this review, corrections, and remaining verification tasks.
  > 
  > Present the final SQL changes for approval.

- **Associated Phase:** Phase 2: Database Schema & Authentication (Targeted SQL Corrections & Security Audit)
- **Discussion & Implementation Summary:**
  Applied targeted security and least-privilege corrections to `supabase/schema.sql`:
  1. `handle_new_user()` Empty Search Path: Configured `SET search_path = ''` and fully schema-qualified all table and function references (`public.profiles`, `pg_catalog.coalesce`).
  2. `handle_profile_update()` Least Privilege: Replaced `SECURITY DEFINER` with `SECURITY INVOKER` since field validation and timestamp updating on `public.profiles` execute safely under caller context without elevated privileges. Configured `SET search_path = ''` with fully qualified `pg_catalog.timezone()`.
  3. Clean Signup Insert: Removed redundant `ON CONFLICT (id) DO UPDATE` from `handle_new_user()`. Each signup in `auth.users` generates a unique UUID, making a plain `INSERT` cleaner and standard.
  4. Documented Email Duplication Limitation: `profiles.email` is mirrored from `auth.users` on signup so client apps can read the user's email via the publishable key without admin rights. Per the prompt constraint, no additional unapproved synchronization trigger was added; if a user updates their email via `supabase.auth.updateUser()`, `public.profiles.email` remains static as an established design limitation until email-sync is prioritized.
  5. RLS Policy Audit: Verified that all existing policies on `public.profiles` (`Users can view own profile`, `Users can update own profile`) and `public.jobs` (`Anyone can view active jobs`) remain unaltered and correct.
  6. Git Diff Inspection: Reviewed the exact diff in `supabase/schema.sql`.
- **Actions Performed:**
  - [x] Changed `handle_new_user()` to `SET search_path = ''` with fully schema-qualified calls.
  - [x] Changed `handle_profile_update()` to `SECURITY INVOKER` with `SET search_path = ''`.
  - [x] Removed `ON CONFLICT DO UPDATE` from `handle_new_user()`.
  - [x] Documented the architectural purpose and synchronization limitation of `profiles.email`.
  - [x] Verified existing RLS policies remained unchanged.
  - [x] Inspected Git diff of `supabase/schema.sql`.
  - [x] Verified zero errors on `npx tsc --noEmit` and `npx expo lint`.
  - [x] Appended Prompt #11 to `docs/workflow/phase-2-database-auth.md`.
  - [x] Updated `docs/AI-WORKFLOW.md` dashboard.
- **Actions Not Performed / Not Verified:**
  - [ ] SQL execution on live database (deferred pending user approval).
  - [ ] Application code modification (zero application code modified).
- **Decisions & Guidelines Adopted:**
  - *Hardening Standard:* Highest security standard (`SET search_path = ''`) implemented for functions, requiring explicit `pg_catalog` and `public` prefixes.
  - *Least Privilege:* `handle_profile_update()` operates as `SECURITY INVOKER` rather than `SECURITY DEFINER`.
  - *Documented Limitation:* `public.profiles.email` captures initial signup email and is protected against client updates. Dynamic sync on post-signup auth email changes is explicitly deferred per scope boundary.
- **Files Modified:**
  - `supabase/schema.sql` (refined trigger functions)
  - `docs/workflow/phase-2-database-auth.md` (updated)
  - `docs/AI-WORKFLOW.md` (updated)
- **Tests Performed & Actual Results:**
  - `git diff supabase/schema.sql` -> Exact targeted diff verified.
  - `npx tsc --noEmit` -> 0 errors (clean exit 0).
  - `npx expo lint` -> 0 errors (clean exit 0).
- **Next Recommended Action:**
  User reviews the final SQL migration files (`supabase/schema.sql` and `supabase/seed.sql`), executes them in the Supabase SQL Editor, and provides approval to run live verification queries and implement authentication.

---

### Prompt #12
- **Timestamp:** 2026-10-24 13:40:34 IST
- **Original User Prompt:**
  > The updated `schema.sql` looks good overall.
  > 
  > Make one final correction in `handle_new_user()`:
  > 
  > Replace `pg_catalog.coalesce(...)` with the standard SQL expression `COALESCE(...)`.
  > 
  > Keep `SECURITY DEFINER SET search_path = ''` unchanged.
  > 
  > Also document that changes to a user's email through Supabase Auth are not currently synchronized to the profiles table.
  > 
  > Do not make additional architectural changes or add new functionality.
  > 
  > Verify the modified SQL, inspect the Git diff, and update the Phase 2 workflow documentation.
  > 
  > Do not execute SQL yet. Show me the final changes for approval.

- **Associated Phase:** Phase 2: Database Schema & Authentication (Final SQL Refinement & Documentation of Email Sync Limitation)
- **Discussion & Implementation Summary:**
  Executed targeted refinement in `supabase/schema.sql`:
  1. Replaced `pg_catalog.coalesce(...)` with standard SQL expression `COALESCE(...)` in `handle_new_user()`.
  2. Preserved `SECURITY DEFINER SET search_path = ''` on `handle_new_user()`.
  3. Added inline comments to `supabase/schema.sql` documenting that user email changes through Supabase Auth are not currently synchronized to `public.profiles`.
  4. Inspected git diff to verify zero unrelated changes.
  5. Verified TypeScript (`npx tsc --noEmit`) and linter (`npx expo lint`) with 0 errors.
- **Actions Performed:**
  - [x] Replaced `pg_catalog.coalesce` with standard SQL `COALESCE` in `handle_new_user()`.
  - [x] Retained `SECURITY DEFINER SET search_path = ''` on `handle_new_user()`.
  - [x] Documented in `supabase/schema.sql` that changes to user email through Supabase Auth are not currently synchronized to `public.profiles`.
  - [x] Inspected Git diff of `supabase/schema.sql`.
  - [x] Ran TypeScript typecheck (`npx tsc --noEmit` -> 0 errors).
  - [x] Ran ESLint check (`npx expo lint` -> 0 errors).
  - [x] Appended Prompt #12 to `docs/workflow/phase-2-database-auth.md`.
  - [x] Updated `docs/AI-WORKFLOW.md` dashboard.
- **Actions Not Performed / Not Verified:**
  - [ ] SQL execution on live database (deferred pending user approval).
  - [ ] Application code modification (zero application code modified).
- **Decisions & Guidelines Adopted:**
  - *Standard SQL Functions:* Used standard `COALESCE(...)` syntax in `handle_new_user()`.
  - *Email Sync Limitation:* Explicitly documented that subsequent email modifications in Supabase Auth do not propagate to `public.profiles` in this phase.
- **Files Modified:**
  - `supabase/schema.sql` (refined `handle_new_user()`)
  - `docs/workflow/phase-2-database-auth.md` (updated)
  - `docs/AI-WORKFLOW.md` (updated)
- **Tests Performed & Actual Results:**
  - `git diff supabase/schema.sql` -> Confirmed clean change from `pg_catalog.coalesce` to `COALESCE` and added comment.
  - `npx tsc --noEmit` -> 0 errors (clean exit 0).
  - `npx expo lint` -> 0 errors (clean exit 0).
- **Next Recommended Action:**
  User reviews the final SQL changes and grants approval to execute `supabase/schema.sql` and `supabase/seed.sql` in the Supabase SQL Editor.




