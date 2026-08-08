# Blockers — DASH-01: Missing Test Infrastructure

**Status:** RESOLVED — 2026-08-08

**Resolution:** @owner approved the repository test stack and documented it before adding implementation tasks. `SETUP-05` installs the approved dependencies, `SETUP-06` configures Vitest and the DOM matchers, and `DASH-01A` adds the `IndicatorCard` component tests.

**Blocker:** The Output Contract requires `.test.tsx` files for components > 50 lines. `IndicatorCard` is ~60 lines and currently has no test coverage.

**Root cause:** The repository has **no test runner configured**. `package.json` has no test script and no `vitest`/`jest`/`@testing-library/react`/`jsdom` dev dependencies. No existing `*.test.*` files exist to establish a convention.

**Decision:** Approved installing `vitest@^3`, `@testing-library/react@^16`, `@testing-library/jest-dom@^6`, `jsdom@^26` and `@vitest/coverage-v8@^3` as dev dependencies. The exact scripts, configuration and test conventions are specified in `docs/SPEC.md` §1, §2 and §5.8.

**Tasks added:**
- `SETUP-05`: install the approved test dependencies and scripts.
- `SETUP-06`: configure Vitest, jsdom and jest-dom matchers.
- `DASH-01A`: cover the `IndicatorCard` happy path, accessibility contract and all semaphore states.

**Workaround applied:** None. The dependency change and test implementation are now explicitly authorized as separate atomic tasks.

**Files affected:** `package.json`, `vitest.config.ts`, `src/test/setup.ts`, `src/components/dashboard/indicator-card.test.tsx`