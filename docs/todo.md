- [x] Apply sticky header standard across all activity steps
      - Ensure the step tracker and activity title section remain fixed at the top as users scroll
      - Implement as a reusable layout pattern if not already handled in `StepWrapper`
      - Validate consistent behavior across all workshop activity steps
      - [x] Add `StickyHeader` reusable component at `src/components/layout/StickyHeader.tsx` and export it.
      - [x] Refactor `src/components/layout/ActivityShell.tsx` to render `StickyHeader` internally and remove inline header markup.
      - [x] Update `src/activities/workshop-1-problems_worth_solving/activity-1/ProblemOriginStory.tsx` to use the updated `ActivityShell`.
      - [ ] Extract shared progress‑step helper (e.g., `utils/progress.ts`) and have `StickyHeader` consume it.
      - [ ] Define shared `ActivityMeta` TypeScript type for title, subtitle, steps, and userKey.
- [x] Add Storybook stories for `ActivityShell` and `StickyHeader` plus a unit smoke test rendering every activity (assert one sticky header). (stories committed; smoke-test file added—needs test runner)
- [x] Add tooltip with the following message to both Reset buttons:
      "This will restart the activity and clear your responses. Your user ID will stay the same so your progress across other activities won't be lost."
      - This includes the circular reset icon in the top right of each step AND the full "Reset Activity" button on the summary screen.
- [x] Add a Back button to steps 2 and 3 that decrements currentStep by 1 and allows the user to edit earlier inputs
- [x] Do not show Back button on step 1
- [x] Instruct Bolt to codify tooltip and Back button patterns as reusable UI standards in bolt-migration-standards.md
- [ ] Plan for a system-wide tooltip pattern (to be implemented after core flows are complete)

- [x] Define a standard activity shell layout component or pattern to wrap all activity steps (Step 1 → N → Summary)
      - Include standard structure: StepWrapper, ActivityContainer, ProgressTracker, Navigation Buttons
      - Add this as Section 7 in bolt-migration-standards.md
- [x] Codify how each activity’s data is structured and passed across steps and to summaries
      - Include standard field names and where to store them
      - Add this as Section 8 in bolt-migration-standards.md
- [x] Define inter-activity navigation standards
      - How “Continue to Next Activity” and “Back to Workshop” behave
      - Route structure for activities (e.g. /workshop-1/activity-2)
      - Add this as Section 9 in bolt-migration-standards.md
- [ ] Enforce WCAG AA contrast standards across all UI components
      - Use text-white or text-gray-900 on colored backgrounds
      - Avoid text-gray-500 on anything but white/very light backgrounds
      - For disabled states, use text-gray-600 minimum on light gray backgrounds
      - Validate contrast before pushing new UI

## 🧱 Step 3 – Prep for Smooth Migration of Activity 2 and Beyond

- [x] Finalize and document Activity-to-Activity Mapping Framework (added as Section 10 in bolt-migration-standards.md)
- [x] Ensure activity-level routing patterns are repeatable and referenceable
- [x] Reference original HTML activities in /reference-html folder as canonical source for all migrations
- [ ] Confirm that reusable components and layout shells are generalizable to any activity
- [ ] Validate that WorkshopData schema supports easy expansion per activity
- [ ] Create an activity manifest or config map to define routes, step counts, themes, and titles per activity (optional but recommended)
 - [x] Remove any in-progress Activity 2 implementation from src that was not based on the reference HTML
       - Delete src/activities/day1/activity2/ if present
- [x] Complete full refactor from "dayN" to "workshop-N" naming across all folders, route definitions, import paths, and data schemas
- [ ] Assign `workshop-1-problems_worth_solving` as the canonical template for AI-based repo analysis and future migrations
- [ ] Add Gemini as an advanced AI analysis agent in documentation and process standards
      - Update docs/README_workflow-and-collaboration.md to include Gemini
      - Ensure bolt-migration-standards.md references Gemini’s role in audit and planning
      - Note that Gemini has full GitHub Cloud repo access but cannot edit files

## 🔍 Gemini Audit Tasks (Before Moving On)

- [ ] Verify every activity step uses the shared ActivityShell layout pattern
      - Audit for layout consistency across steps
      - Flag any steps using hardcoded layouts instead of shared shell

- [ ] Extract StickyHeader component if not already modularized
      - Confirm top header section and step tracker are reusable
      - Suggest improved layout separation if needed

- [ ] Scan for unimplemented reusable UI patterns (e.g., tooltips, buttons)
      - Highlight any uses of custom Reset, Back, or Tooltip logic
      - Recommend refactoring into shared UI components

- [ ] Validate all route paths use `/workshop-N/activity-N` convention
      - Scan `src/App.tsx` and all route definitions
      - Flag legacy paths using `/dayN` or `/activityN` only

- [ ] Review WorkshopData type structure for each workshop
      - Ensure schemas are consistent and extensible
      - Highlight any inline definitions instead of using shared types

- [ ] Identify components that don’t follow WCAG AA contrast or accessibility standards
      - Check color contrast, keyboard navigation, and aria-labels
      - Flag non-compliant elements or patterns

- [ ] Suggest improvements for managing activity-to-summary data flow
      - Propose use of a central activity config map if missing
      - Flag inconsistencies in summary data rendering

- [ ] Propose test coverage recommendations
      - Identify components or flows missing automated tests
      - Suggest high-impact areas to validate (e.g., Venn logic, reset behavior)
      - [x] Repo‑wide search for `<div className="sticky top-0">` outside the `layout` folder; open issues for each occurrence.
      - [x] Add ESLint rule or CI check to prevent custom sticky header markup outside approved layout components. (stub added; rule enable pending)
      - [x] Resolve current ESLint lint‑error list and enforce zero‑warning build. (errors fixed; two non-critical Fast-Refresh warnings remain)
      - [ ] Enable the custom sticky‑header ESLint rule in `eslint.config.js` and fix any violations.
      - [ ] Run Gemini re‑audit to confirm header compliance, prop alignment, and orphaned code removal.
      - [x] Create Storybook stories for `ActivityShell` and `StickyHeader` to document expected layout.
      - [ ] Update `CONTRIBUTING.md` with mandatory use of `ActivityShell` for all activities and describe the new ESLint check.
      - [x] Add unit smoke test that renders every activity and asserts exactly one sticky header is present. (file added—needs Vitest/RTL to run)
      - [ ] Install and configure testing stack (Vitest + @testing-library/react + jsdom) so the smoke test executes.
      - [ ] Ensure `npm run test` passes and wire the test job into CI.
      - [ ] Suggest test coverage priorities: header rendering, reset behavior, data persistence.

### 📁 Reference HTML Directory

- Mirror original workshop structure inside /reference-html
- Organize HTML files by workshop and activity (e.g. problems_worth_solving/problems-activity-2.html)
- Ensure Claude Code can scan and interpret structure/content

- [ ] Remove original non-prefixed reference folders (e.g. problems_worth_solving/, positioning_basics/, etc.)

### 🔮 Longer-Term Refinements

- [ ] Move inline onMouseEnter/onMouseLeave logic into Tailwind via hover: classes (keeps styles declarative)
- [ ] Add support for tooltips on disabled buttons (via wrapper div if needed)
- [ ] Add keyboard accessibility: currently only works via mouse. To fully support accessibility:
      - Add support for onFocus / onBlur events (keyboard focus)
      - Consider aria-describedby with id-linked tooltips
- [ ] Consider using Tailwind for arrow styles instead of inline borderWidth
- [ ] Debounce tooltip entry/exit logic if flicker becomes an issue on tight spacing
- [ ] Migrate any header‑specific progress logic to the new shared helper and delete redundant code from components.

- [x] Improve font color contrast in the ActivitySummary component to enhance readability, especially on orange and blue background blocks
- [x] Improve font color contrast in the ActivitySummary component summary blocks for readability (gray text on blue and orange backgrounds)



## 🧹 Recently Completed

- ✅ Workshop Folder Refactor: dayN → workshop-N
  - Refactor all references from "day1", "day2", etc. to use "workshop-1", "workshop-2", etc. in both folder and route naming conventions.
  - Update /src/activities/day1 → /src/activities/workshop-1-problems_worth_solving
  - Update import paths and route definitions to match the new folder structure
  - Rename components folders accordingly:
      - /activity1 → /activity-1
      - /activity2 → /activity-2
      - /activity3 → /activity-3
  - Final folder structure target:
      ├── workshop-1-problems_worth_solving
      │   ├── problems-activity-1.html
      │   ├── problems-activity-2.html
      │   └── problems-activity-3.html
      ├── workshop-2-finding_your_early_customers
      │   ├── ecp-activity-1.html
      │   ├── ecp-activity-2.html
      │   ├── ecp-activity-3.html
      ├── workshop-3-positioning_basics
      │   ├── positioning-activity-1.html
      │   ├── positioning-activity-2.html
      │   └── positioning-activity-3.html
      ├── workshop-4-market_entry_readiness
      │   ├── market-entry-activity-1.html
      │   ├── market-entry-activity-2.html
      │   └── market-entry-activity-3.html

## ✅ Completed Tasks

## ✅ Add Back Button Functionality to Steps 2 and 3

- [x] PartnerSharing: Add a “Back to Step 1” button → `setCurrentStep(1)`
- [x] ActivitySummary: Add a “Back to Step 2” button → `setCurrentStep(2)`
- [x] Use `btn btn-secondary` for styling
- [x] Place below existing content
- [x] Confirm correct conditional rendering per `currentStep`

## ✅ Completed Tasks

- [x] Refactor all references from "day1", "day2", etc. to use "workshop-1", "workshop-2", etc. in both folder and route naming conventions.
  - Update /src/activities/day1 → /src/activities/workshop-1-problems_worth_solving
  - Update import paths and route definitions to match the new folder structure
  - Rename components folders accordingly:
      - /activity1 → /activity-1
      - /activity2 → /activity-2
      - /activity3 → /activity-3
  - Final folder structure target:
      ├── workshop-1-problems_worth_solving
      │   ├── problems-activity-1.html
      │   ├── problems-activity-2.html
      │   └── problems-activity-3.html
      ├── workshop-2-finding_your_early_customers
      │   ├── ecp-activity-1.html
      │   ├── ecp-activity-2.html
      │   ├── ecp-activity-3.html
      ├── workshop-3-positioning_basics
      │   ├── positioning-activity-1.html
      │   ├── positioning-activity-2.html
      │   └── positioning-activity-3.html
      ├── workshop-4-market_entry_readiness
      │   ├── market-entry-activity-1.html
      │   ├── market-entry-activity-2.html
      │   └── market-entry-activity-3.html