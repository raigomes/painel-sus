# Blockers — DASH-01: Missing Test Infrastructure

**Status:** OPEN

**Blocker:** The Output Contract requires `.test.tsx` files for components > 50 lines. `IndicatorCard` is ~60 lines and currently has no test coverage.

**Root cause:** The repository has **no test runner configured**. `package.json` has no test script and no `vitest`/`jest`/`@testing-library/react`/`jsdom` dev dependencies. No existing `*.test.*` files exist to establish a convention.

**Decision required from @reviewer/@owner:**
- Approve installing a test stack (recommended: `vitest` + `@testing-library/react` + `jsdom` + `@vitest/coverage-v8`) — this is a repo-level dependency change beyond the atomic task scope.
- Or defer the test for DASH-01 until a test scaffold task is explicitly added to `docs/TASKS.md`.

**Workaround applied:** None — the component is implemented and passes `npx tsc --noEmit` (exit 0) and `npx eslint` (exit 0) with zero warnings. Test file intentionally not created to avoid unapproved dependency additions.

**Files affected:** `src/components/dashboard/indicator-card.tsx`