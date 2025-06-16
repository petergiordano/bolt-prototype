# bolt-prototype for GTM Workshops

## GTM Workshop Series

### Overview
Brief description of the workshop series

### Workshop Structure
- Day 1: Workshop 1 - Problems Worth Solving
- Day 2-1: Workshop 2 - Finding Your Early Customers
- Day 2-2: Workshop 3 - Positioning Basics
- Day 3: Workshop 4 - Market Entry Readiness

## 📚 Documentation

The following documents are located in the `docs/` folder:

- **README_three-way-workflow.md**  
  Describes the three-way workflow between Bolt.new, GitHub, and your local VS Code setup. Includes visual diagrams and instructions for maintaining sync across environments.

- **todo.md**  
  Tracks all outstanding UI tasks and feature enhancements, with checkboxes for completed items.

- **bolt-migration-standards.md**  
  Defines implementation standards and reusable patterns (e.g., tooltip and back button conventions) to ensure consistent UX across Bolt activities.

## 🔗 Repository Structure and Setup

### GitHub Cloud Repository
This project is hosted on GitHub at:  
[github.com/petergiordano/bolt-prototype](https://github.com/petergiordano/bolt-prototype)

### Local Repository
The local version of this repo is located on disk at:  
`/Users/petergiordano/Documents/GitHub/bolt-prototype`

### Key Directories
- `docs/` — Project documentation including workflow, UI standards, and feature tracking.
- `src/components/` — React components for Bolt activities (e.g., ActivitySummary, PartnerSharing).
- `supabase/` — Backend integration setup for Supabase.
- `node_modules/` — Installed dependencies (auto-managed, excluded from source control).

## 🛠️ Development Platform

This project is being developed using [Bolt.new](https://bolt.new), a visual React development environment that integrates directly with GitHub.

- Bolt is connected to the GitHub repo and reads/writes code automatically.
- All component and UI logic is generated and refined inside Bolt.
- We use Bolt for rapid prototyping and layout, but GitHub and local VS Code remain the source of truth.