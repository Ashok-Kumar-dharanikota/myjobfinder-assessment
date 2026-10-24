# Product

<!-- impeccable:product-schema 1 -->

## Platform

android

## Users

Primary users are job seekers, candidates, and professionals looking for verified tech, engineering, product, and design roles. They operate on mobile devices (primarily Android smartphones via Expo Go or standalone APKs) and need quick, focused scanning of job openings, compensation, workplace types (Remote, Hybrid, On-site), requirements, and direct hiring contact info.

## Product Purpose

JobFinder provides a streamlined, fast, and distraction-free mobile job discovery experience connected to a live Supabase PostgreSQL backend. It eliminates job board bloat by giving candidates clear role requirements, transparent salary expectations, and immediate contact channels with zero friction.

## Positioning

Unlike cluttered web job boards with algorithmic noise and endless forms, JobFinder is a native mobile-first application designed for rapid triage, live debounced keyword search, and immediate employer outreach with full offline resilience.

## Operating Context

- Mobile handheld usage in portrait orientation on Android devices.
- Network environments ranging from high-speed Wi-Fi to variable cellular data.
- Built with React Native, Expo SDK 58, Expo Router, Supabase Backend, and TanStack Query.
- Tested and run via Expo Go and native Android builds.

## Capabilities and Constraints

- Capabilities: Email/password authentication, live debounced search across job titles, companies, and locations, cached query state with pull-to-refresh, structured job detail screens, direct mailto application launcher.
- Constraints: Native Android platform rules (Material 3 principles, 48x48 dp touch targets, Roboto type scale, predictive back gestures, edge-to-edge system bars, dynamic dark/light theme support).
- Out of scope for current core: Bookmarking/saved jobs, in-app application submission workflows, resume uploaders, or employer management portals.

## Brand Commitments

- Name: JobFinder
- Brand Voice: Professional, concise, trustworthy, modern, and developer-friendly.
- Visual Tone: Clean native utility, high scannability, purposeful color coding (e.g. emerald for compensation/remote, indigo for brand/actions, amber for on-site), crisp typography, zero unnecessary decorative gradients.

## Evidence on Hand

- Fully operational Expo SDK 58 application codebase in `src/`.
- Real Supabase PostgreSQL database seeded with verified job postings.
- Complete navigation paths: `(auth)/login` -> `index` (Home Feed) -> `job/[id]` (Job Details).

## Product Principles

1. Mobile-First Utility: Every tap, card, and interaction must feel fast, responsive, and native to Android.
2. Transparent Information Hierarchy: Job title, company, workplace mode, and salary take precedence over decorative flair.
3. Accessible & Legible by Default: Strict color contrast, minimum 48dp touch targets, and robust dark/light themes.
4. Error & State Honesty: Clear, helpful empty and error states with immediate retry mechanisms instead of dead ends.
