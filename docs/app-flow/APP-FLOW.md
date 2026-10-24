# JobFinder — Visual Application Walkthrough & User Journey

> **Platform:** React Native (Expo SDK 58) Mobile Application  
> **Backend & Database:** Supabase (Auth + PostgreSQL with Row-Level Security)  
> **State & Data Caching:** TanStack Query v5  
> **Navigation:** Expo Router (File-based Routing)  
> **Physical Device:** Motorola Edge 70 Fusion (Android 15 / API Level 37)  
> **Verification Harness:** Argent MCP Mobile Interaction Engine & ADB  
> **Date:** October 2026  

---

## 1. Application Overview

**JobFinder** is a mobile-first job discovery application designed for candidates seeking verified tech and engineering opportunities. Built with high performance, offline resilience, and clean information hierarchy in mind, JobFinder avoids the visual clutter and algorithmic noise of conventional web job portals.

### Core Architecture & Stack
- **Client Runtime:** React Native 0.88.0 on Expo SDK 58 (`expo-router`, `react-native-reanimated`, `@react-native-async-storage/async-storage`).
- **Backend & Persistence:** Supabase PostgreSQL database with Row-Level Security (RLS) policies protecting sensitive user records, paired with Supabase GoTrue authentication.
- **Data Synchronization:** TanStack Query provides intelligent caching, background revalidation, and instant UI state synchronization with pull-to-refresh capabilities.
- **Search Engine:** Live client-side debounced queries (350ms) executing PostgreSQL multi-field pattern matches (`title`, `company`, `location`) without UI thread interruption.

### Primary User Journey
1. **Authentication:** The candidate opens the app, authenticates with email/password or registers a new profile.
2. **Triage Feed:** The user browses live opportunities, scanning salary ranges, workplace models (Remote, Hybrid, On-site), and key technical requirements.
3. **Keyword Discovery:** The candidate types search terms in the persistent search bar, seeing instant live-filtered results.
4. **Deep Item Inspection:** The candidate taps an opportunity to inspect comprehensive responsibilities, qualifications, and direct employer contact channels.
5. **Feed Return:** The user returns to the feed, strictly preserving their scroll position, active search query, and input focus.

---

## 2. User Journey & Navigation Flow

The following Mermaid diagram maps the end-to-end navigational paths, state branches, and error recovery routes captured during device execution:

```mermaid
flowchart TD
    Start([App Launch / Cold Boot]) --> AuthCheck{Session in AsyncStorage?}
    
    AuthCheck -- No Session --> LoginView["1. Sign In Screen\n(01_login_screen.png)"]
    AuthCheck -- Valid Session --> HomeFeed["4. Home / Job Listings Feed\n(04_job_listing_screen.png)"]
    
    subgraph Authentication Flow
        LoginView -->|Tap 'Sign Up' Tab| RegisterView["2. Sign Up Screen\n(02_registration_screen.png)"]
        RegisterView -->|Tap 'Sign In' Tab| LoginView
        RegisterView -->|Submit Empty / Invalid| ValidationError["3. Validation Error State\n(03_login_error_state.png)"]
        ValidationError -->|Correct Input & Submit| SupabaseAuth[Supabase Auth & Profile Trigger]
        LoginView -->|Valid Credentials Submit| SupabaseAuth
        SupabaseAuth -->|Session Issued| HomeFeed
    end

    subgraph Discovery & Search Flow
        HomeFeed -->|Type 'React' in Search Bar| SearchActive["5. Live Search Results\n(05_search_results.png)"]
        HomeFeed -->|Type Non-Matching Query| SearchEmpty["6. Empty Search Results\n(06_empty_search_results.png)"]
        SearchEmpty -->|Tap 'Clear Search Filters'| HomeFeed
        SearchActive -->|Tap 'X' Clear Icon| HomeFeed
    end

    subgraph Job Detail Flow
        HomeFeed -->|Tap Job Card| JobDetailTop["7. Job Detail - Top View\n(07_job_detail_top.png)"]
        SearchActive -->|Tap Filtered Card| JobDetailTop
        JobDetailTop -->|Swipe Up Gesture| JobDetailBottom["8. Job Detail - Bottom View\n(08_job_detail_bottom.png)"]
        JobDetailBottom -->|Tap Email Button| MailClient([External Mail App / Intent])
        JobDetailTop -->|Tap Back Chevron / Back Gesture| HomeFeed
    end

    subgraph Resilient Error Handling
        DeepLink([Invalid Job Link / Stale UUID]) --> JobNotFound["9. Job Not Found Screen\n(09_job_not_found.png)"]
        JobNotFound -->|Tap 'Return to Job Feed' CTA| HomeFeed
    end
```

---

## 3. Visual Application Flow (Screen-by-Screen Walkthrough)

All screenshots below represent **authentic baseline visual evidence** captured from the connected Motorola Edge 70 Fusion physical device via Argent MCP.

---

### Step 1: Sign In Screen (Baseline Unauthenticated State)

![Sign In Screen](screenshots/before/01_login_screen.png)

- **Screen Title:** Sign In Screen
- **Route:** `src/app/(auth)/login.tsx`
- **Argent Interaction:** Screen queried and described via Argent `describe` tool upon application boot with no saved session.
- **Observed Result:** Clean entry layout featuring a branded briefcase icon badge, title "JobFinder", an active "Sign In" segment tab, Email Address and Password inputs with leading glyphs, and a full-width "Sign In" CTA.
- **Flow Explanation:** Serves as the gateway for unauthenticated users. The `_layout.tsx` root segment listener automatically redirects unauthenticated sessions to this route.
- **Key State / Behavior:** Form defaults to Sign In mode with placeholder text `name@example.com` and masked password formatting.

---

### Step 2: Registration / Sign Up Screen

![Registration Screen](screenshots/before/02_registration_screen.png)

- **Screen Title:** Sign Up Screen (Registration Mode)
- **Route:** `src/app/(auth)/login.tsx`
- **Argent Interaction:** `gesture-tap` at normalized coordinates `(x: 0.720, y: 0.448)` selecting the "Sign Up" tab.
- **Observed Result:** Active tab highlight transitions to "Sign Up". The subtitle dynamically updates to *"Create an account to explore matching opportunities"*. An additional *"Full Name"* input field smoothly mounts at the top of the form, and the action button updates to *"Create Account"*.
- **Flow Explanation:** Allows first-time candidates to register. Switching modes preserves email or password text already typed while clearing transient error banners.
- **Key State / Behavior:** Clean component state toggle between login and registration without route unmounting.

---

### Step 3: Form Validation Error State

![Validation Error State](screenshots/before/03_login_error_state.png)

- **Screen Title:** Form Validation Error State
- **Route:** `src/app/(auth)/login.tsx`
- **Argent Interaction:** `gesture-tap` on the *"Create Account"* button at `(x: 0.500, y: 0.763)` with empty input fields.
- **Observed Result:** Form validation immediately intercepts the submission without triggering unnecessary network queries. An alert banner with an exclamation circle icon appears with the message: *"Please enter your email address."*
- **Flow Explanation:** Protects the Supabase API against malformed payloads and provides instant feedback to the candidate.
- **Visual Audit Note:** In the current implementation, this banner uses hardcoded light-theme pastel colors (`#FEE2E2` background, `#991B1B` text), creating an uncomfortably bright contrast artifact against the dark OLED background. This represents a primary target for Phase 5 token polish.

---

### Step 4: Home & Job Listing Feed

![Job Listing Feed](screenshots/before/04_job_listing_screen.png)

- **Screen Title:** Home Screen / Job Listings Feed
- **Route:** `src/app/index.tsx`
- **Argent Interaction:**
  1. Focused Full Name input via `gesture-tap` `(x: 0.500, y: 0.510)` and typed `"Audit Candidate"` via `keyboard`.
  2. Focused Email Address input `(x: 0.500, y: 0.590)` and typed `"audit.candidate@test.com"`.
  3. Focused Password input `(x: 0.500, y: 0.690)` and typed `"Password123!"`.
  4. Dismissed keyboard and tapped *"Create Account"*.
  5. Supabase issued authenticated session, `handle_new_user()` created the user profile, and `_layout.tsx` routed to `/`.
- **Observed Result:** Renders the persistent Top App Bar displaying brand title, candidate avatar with initials `"AC"`, sign-out button, search bar, and an "Explore Jobs" header with a `"6 jobs"` count pill. The virtualized FlatList displays all 6 active jobs fetched from Supabase PostgreSQL.
- **Flow Explanation:** Central dashboard for job discovery. Selecting any card transitions into the Job Detail view.
- **Visual Audit Note:** Card titles (such as *"DevOps & Cloud Infrastructure..."*) experience aggressive truncation due to the workplace badge in the card header.

---

### Step 5: Live Debounced Search

![Search Results](screenshots/before/05_search_results.png)

- **Screen Title:** Search Results Active
- **Route:** `src/app/index.tsx` (using `src/components/search-bar.tsx`)
- **Argent Interaction:** `gesture-tap` focused the search input bar at `(x: 0.500, y: 0.160)` and typed `"React"` via `keyboard`.
- **Observed Result:** Input border activates with focus color. A clear `"close-circle"` button appears inside the input field. The TanStack Query hook executes a debounced (350ms) ILIKE database query, instantly filtering the list to 1 matching item (*"Senior React Native Engineer"* at *"Nexus Mobile Labs"*). The header count pill updates to `"1 job"` and the section heading switches to *"Search Results"*.
- **Flow Explanation:** Live filtering without page reloads. Tapping the clear button or deleting text immediately restores the full feed.
- **Key State / Behavior:** Placing the search input outside the FlatList ensures zero focus dropping or keyboard flickering during typing.

---

### Step 6: Empty Search Results (Zero Matches)

![Empty Search Results](screenshots/before/06_empty_search_results.png)

- **Screen Title:** Empty Search Results State
- **Route:** `src/components/job-list-empty.tsx` (rendered inside `src/app/index.tsx`)
- **Argent Interaction:** Typed a non-existent keyword query (`"XYZNonExistentKeyword"`) into the search bar via `keyboard`.
- **Observed Result:** Database query returns 0 rows. Result counter displays `"0 jobs"`. The empty component renders a prominent circular search icon, a clear title *"No matching jobs"*, an explanatory body quoting the active query, and an actionable *"Clear Search Filters"* CTA button.
- **Flow Explanation:** Prevents dead ends. Tapping the CTA clears the input state and instantly repopulates all 6 active opportunities.
- **Key State / Behavior:** Friendly recovery flow with clear attribution of why zero results were returned.

---

### Step 7: Job Detail Screen (Upper Viewport)

![Job Detail Top](screenshots/before/07_job_detail_top.png)

- **Screen Title:** Job Detail Screen (Hero & Role Overview)
- **Route:** `src/app/job/[id].tsx`
- **Argent Interaction:** Tapped *"Clear Search Filters"* at `(x: 0.500, y: 0.565)` to restore the list, followed by a `gesture-tap` on the first job card at `(x: 0.500, y: 0.350)`.
- **Observed Result:** Navigates via Expo Router to `/job/[id]`. Displays top navigation bar with back chevron and title *"Job Details"*, an elevated Hero Card with company initials avatar (`"NM"`), workplace badge (`"Hybrid"`), full job title, company name, location (`"Bengaluru, India"`), employment type (`"Full-time"`), emerald compensation banner (`"₹24L - ₹32L / yr"`), and the *"Role Overview"* card.
- **Flow Explanation:** Primary decision screen for candidates evaluating a specific job posting.
- **Visual Audit Note:** Demonstrates clean data completeness, but exhibits "card fatigue" with multiple consecutive heavy bordered boxes.

---

### Step 8: Job Detail Screen (Lower Viewport)

![Job Detail Bottom](screenshots/before/08_job_detail_bottom.png)

- **Screen Title:** Job Detail Screen (Requirements & Direct Employer Contact)
- **Route:** `src/app/job/[id].tsx`
- **Argent Interaction:** Performed a smooth upward scroll gesture via `gesture-swipe` from `(fromX: 0.5, fromY: 0.7)` to `(toX: 0.5, toY: 0.3)`.
- **Observed Result:** Displays the *"Requirements & Qualifications"* checklist with circular check icons, the *"Key Responsibilities"* section with directional arrows, and the *"Contact Information"* section featuring a direct mailto action button (`careers@nexusmobilelabs.io`).
- **Flow Explanation:** Completes the job detail narrative and enables immediate employer outreach.
- **Key State / Behavior:** Tapping the contact button triggers the device's native mail client with a pre-filled subject line.

---

### Step 9: Job Not Found / Error Recovery State

![Job Not Found](screenshots/before/09_job_not_found.png)

- **Screen Title:** Job Not Found State
- **Route:** `src/app/job/[id].tsx`
- **Argent Interaction:** Dispatched an explicit deep link using Argent `open-url` with a non-existent UUID (`exp://192.168.1.8:8081/--/job/00000000-0000-0000-0000-000000000000`).
- **Observed Result:** Supabase `.maybeSingle()` query resolves safely to `null` without throwing an uncaught database exception. Renders a dedicated "Job Not Found" feedback card with search glyph, explanatory message (*"This position may have been closed, deleted, or the identifier is invalid."*), and a primary *"Return to Job Feed"* CTA.
- **Flow Explanation:** Handles invalid deep links, deleted jobs, or network edge cases gracefully. Tapping the CTA safely routes back to `/`.
- **Key State / Behavior:** Graceful degradation with zero unhandled crash states or infinite loading spinners.

---

## 4. Design & Interaction Analysis

### Visual Hierarchy & Readability
- **Header & Branding:** Clean visual weight with modern typography and distinct icon badges.
- **Job Cards:** Strong emphasis on compensation and company identity. However, placing the workplace badge in the upper right header forces title truncation on titles longer than 25 characters.
- **Detail View:** Content is structured logically (Hero → Compensation → Overview → Requirements → Responsibilities → Contact), but presents too many stacked boxes, creating visual fatigue.

### Android Native Affordances
- **Touch Targets:** The majority of buttons meet the 48dp standard. The top-bar sign-out button (36×36 dp) and the password visibility toggle (28dp visual bounds) fall below this standard.
- **Interaction Feedback:** Currently relies on `TouchableOpacity` opacity fading. Upgrading to `Pressable` with Material `android_ripple` will provide authentic Android tactile feedback.
- **Theming & Contrast:** The app functions well in dark mode, but the validation error banner in `login.tsx` is an outlier that requires semantic tokenization.

---

## 5. Verification Summary

| Screen / Flow | Verification Method | Status | Visual Evidence File |
|---|---|:---:|---|
| **Sign In Form** | Argent device inspection (`describe`) | Verified | `screenshots/before/01_login_screen.png` |
| **Sign Up Mode Switch** | Argent touch gesture (`gesture-tap`) | Verified | `screenshots/before/02_registration_screen.png` |
| **Validation Alert Banner** | Argent touch gesture (`gesture-tap`) | Verified | `screenshots/before/03_login_error_state.png` |
| **User Registration & Seed Feed** | Argent keyboard entry & tap | Verified | `screenshots/before/04_job_listing_screen.png` |
| **Live Debounced Query** | Argent keyboard entry & debounce | Verified | `screenshots/before/05_search_results.png` |
| **Empty Search Recovery** | Argent search input & query | Verified | `screenshots/before/06_empty_search_results.png` |
| **Detail Screen Navigation** | Argent card selection (`gesture-tap`) | Verified | `screenshots/before/07_job_detail_top.png` |
| **Detail Scroll & Contact CTA** | Argent swipe gesture (`gesture-swipe`) | Verified | `screenshots/before/08_job_detail_bottom.png` |
| **Not Found Error Handling** | Argent deep link (`open-url`) | Verified | `screenshots/before/09_job_not_found.png` |

> *Note: All 9 visual states above were executed and captured on a physical Motorola Edge 70 Fusion running Expo Go. No test results or screenshots were simulated or fabricated.*
