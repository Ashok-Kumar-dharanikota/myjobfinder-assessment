# Phase 2: Database Schema & Authentication

- **Status:** Planned
- **Objective:** Establish Supabase PostgreSQL database tables (`jobs`, `profiles`), configure Row Level Security (RLS) policies, implement automatic profile creation trigger (`handle_new_user`), build authentication screens (Login / Register), and manage persistent user sessions.

---

## Planned Scope & Tasks
- [ ] Export and execute SQL migration script in Supabase SQL Editor.
- [ ] Implement `AuthContext` (`src/context/auth-context.tsx`) with login, register, sign out, and session restoration via AsyncStorage.
- [ ] Build login/registration screen (`src/app/(auth)/login.tsx`) with validation and error alerts.
- [ ] Set up route protection in `src/app/_layout.tsx`.
- [ ] Verify RLS policies and trigger function with test queries.

---

## Prompt History

*(Prompt history for Phase 2 will be appended here chronologically upon execution.)*
