# todo.md

## UI Functionality Todos

- [ ] Add tooltip with the following message to both Reset buttons:
      "This will restart the activity and clear your responses. Your user ID will stay the same so your progress across other activities won't be lost."
      - This includes the circular reset icon in the top right of each step AND the full "Reset Activity" button on the summary screen.
- [x] Add a Back button to steps 2 and 3 that decrements currentStep by 1 and allows the user to edit earlier inputs
- [x] Do not show Back button on step 1
- [ ] Once tooltip and Back button are implemented, instruct Bolt to add these UI patterns as codified standards in the project documentation (e.g. bolt-migration-standards.md)
- [ ] Plan for a system-wide tooltip pattern (to be implemented after core flows are complete)

- [ ] Improve font color contrast in the ActivitySummary component to enhance readability, especially on orange and blue background blocks
- [ ] Improve font color contrast in the ActivitySummary component summary blocks for readability (gray text on blue and orange backgrounds)



## ✅ Add Back Button Functionality to Steps 2 and 3

- [x] PartnerSharing: Add a “Back to Step 1” button → `setCurrentStep(1)`
- [x] ActivitySummary: Add a “Back to Step 2” button → `setCurrentStep(2)`
- [x] Use `btn btn-secondary` for styling
- [x] Place below existing content
- [x] Confirm correct conditional rendering per `currentStep`