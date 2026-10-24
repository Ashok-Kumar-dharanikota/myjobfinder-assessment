This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md


# AI Development Workflow

These rules apply to any software project, regardless of its tech stack or purpose.

## 1. Phase Management

- Analyze the existing codebase and requirements.
- Divide development into logical phases.
- Define goals, tasks, and completion criteria for each phase.
- Present the initial plan for approval.
- Automatically identify which phase each user prompt belongs to.
- Allow multiple prompts, discussions, and fixes within one phase.
- Do not mark a phase complete without verification.
- Ask for approval before advancing to the next major phase.

## 2. Continuous Documentation

Maintain a single file:

`docs/AI-WORKFLOW.md`

Create it if it doesn't exist.

### Current Progress

Keep this section at the top of the document:

- Current phase and objective
- All planned phases and their status
- [x] Completed actions
- [ ] Pending, blocked, or unverified actions
- Outstanding issues
- Next recommended action

### Prompt History

For EVERY user prompt, including discussions and questions, append:

- Sequential prompt number
- Actual timestamp in IST (Asia/Kolkata)
- Original user prompt
- Associated development phase
- Brief discussion or implementation summary
- [x] Actions actually performed
- [ ] Actions not performed or not verified
- Decisions and missing requirements
- Files modified, if applicable
- Tests performed and actual results
- Next recommended action

Never delete or overwrite earlier prompt history.

If a timestamp is unavailable, state that instead of inventing one.

## 3. Development Rules

- Inspect relevant code before making changes.
- Implement only the requested scope.
- Avoid unnecessary complexity.
- Review generated code for correctness, security, and maintainability.
- Run relevant tests and checks where possible.
- Never claim something works without verification.
- Record real issues, corrections, and decisions.
- Keep secrets out of source code and logs.
- Update AI-WORKFLOW.md after every prompt.
- Verify that documentation updates were saved successfully.

## 4. Response Format

Begin each response with:

**Current Phase:** Phase name

**Actions:**
- [x] Completed action
- [ ] Pending or unverified action

**Decisions / Issues:** Relevant details, if any.

**Documentation:** Updated or not updated.

**Next:** Recommended next action.

Keep responses concise.

## 5. Planning Mode

When working in PLAN mode:

- Inspect the project and its requirements.
- Propose phases and acceptance criteria.
- Do not implement application features without approval.
- If file writes are unavailable, clearly report that documentation was not saved.

Never report incomplete work as completed.
