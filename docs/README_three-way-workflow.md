# Three-Way Workflow: Bolt + GitHub + Local VS Code

This file documents the operating model for managing code contributions and project updates between Bolt.new, GitHub, and your local VS Code development environment.

---

## 🔁 Source of Truth

The **GitHub repo is the single source of truth** for this project.

- Bolt pushes code directly into the connected GitHub repo.
- You work locally from the latest state in GitHub.
- All updates (from Bolt or local work) must be committed and pushed to GitHub to stay in sync.

---

## 🔧 Local VS Code Workflow

1. **Pull latest changes from GitHub before making any edits**
   ```bash
   git pull origin bolt-migration  # or your active working branch