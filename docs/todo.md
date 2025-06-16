## Folder Structure and Naming Todos
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

## UI Functionality Todos

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
 - [ ] Remove any in-progress Activity 2 implementation from src that was not based on the reference HTML
       - Delete src/activities/day1/activity2/ if present

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

- [x] Improve font color contrast in the ActivitySummary component to enhance readability, especially on orange and blue background blocks
- [x] Improve font color contrast in the ActivitySummary component summary blocks for readability (gray text on blue and orange backgrounds)



## ✅ Add Back Button Functionality to Steps 2 and 3

- [x] PartnerSharing: Add a “Back to Step 1” button → `setCurrentStep(1)`
- [x] ActivitySummary: Add a “Back to Step 2” button → `setCurrentStep(2)`
- [x] Use `btn btn-secondary` for styling
- [x] Place below existing content
- [x] Confirm correct conditional rendering per `currentStep`