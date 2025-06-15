# GTM Workshop – Bolt Migration Standards

This doc defines the distilled tech, data, and UI standards for migrating the GTM Workshop HTML-based app to a React + Supabase app hosted on bolt.new.

---

## ✅ 1. Tech Stack

- **React 18** with `ReactDOM.createRoot()`
- **Tailwind CSS** via CDN
- **Supabase** for backend data storage (no auth)
- **React Router** for navigation across activities

---

## 🔑 2. User Identification & Storage

- Each user gets a unique **10–12 character key** (saved in localStorage)
- Supabase table schema:

```ts
{
  key: string,
  email?: string,        // optional
  data: JSON,            // full workshop data
  created_at: timestamp,
  updated_at: timestamp
}
```

- Key is generated on first visit and used for all future reads/writes
- Optional email allows for future recovery

---

## 📦 3. Data Schema (JSON `data` field)

- Versioned (`"version": "1.0"`)
- Nested structure:

```json
{
  "version": "1.0",
  "day1": {
    "activity1": {
      "momentOfRealization": "string",
      "whoExperienced": "string",
      "whyMatters": "string",
      "whatSurprised": "string",
      "howRealProblem": "string",
      "completedAt": "ISO timestamp"
    }
  }
}
```

---

## 🔁 4. Data Behavior

- **On load**:
  - Read `key` from `localStorage`
  - Fetch `data` from Supabase
  - Pre-populate fields if found

- **On save**:
  - Update activity fields in `data`
  - Set or update `completedAt`
  - Patch full `data` back to Supabase

- **Optional**:
  - Prompt user for email once to link to their key

---

## 🎨 5. UI & UX Standards

### Layout
- Responsive layout (1366×768 min)
- `.container` + `.activity-card` structure
- Card-based steps with visual progress bar or dots

### Final Button Layout

```
[Reset] [Save] [Back to Workshop] [Continue →]
```

### Inputs
- `<textarea>` with:
  - Placeholder: `"e.g. ..."`
  - Min height: 150px
  - Live word count display
  - Green check icon on valid input (≈10–20 words or ~50–100 chars)


### Tooltip Standard (🔍 NEW)
	•	Use tooltips to clarify non-obvious or potentially destructive actions
	•	Trigger: hover on desktop, tap-hold on mobile (via title tag or custom behavior)
	•	Tooltip behavior:
	•	Dark background (#1F2937) with white text
	•	Arrow pointing to the button
	•	Max-width: 64 characters (~300px)
	•	Spacing: 8–12px from target, z-index safe
	•	Smooth fade-in/out transitions
	•	Accessibility:
	•	Tooltip must use aria-describedby and a title attribute (if applicable)
	•	Tooltip text should be keyboard-reachable if using custom components
	•	Example use: Reset buttons
Message for both Reset buttons:
“This will restart the activity and clear your responses. Your user ID will stay the same so your progress across other activities won’t be lost.”

⸻

### Back Button Standard (🔙 NEW)
	•	Add Back buttons on steps 2 and beyond within an activity
	•	Behavior:
	•	On click: setCurrentStep(currentStep - 1)
	•	Does not reset or clear inputs
	•	Returns user to prior step with preserved data
	•	Visual placement:
	•	Bottom-left of each step panel, below input content
	•	Style:
	•	Tailwind class: btn btn-secondary
	•	Do not show on step 1

---

## 🧪 6. Validation & Resilience

- Required fields must be valid before marking `completedAt`
- No lockouts — user can revise answers any time
- If data load fails:
  - Show helpful error state
  - Allow fresh start if needed
- Accessibility: Touch targets ≥ 44px, keyboard nav

---

## 💡 7. Auto-Population (Future Activities)

- Auto-fill fields using earlier activity data
- Users can edit these pre-filled values
- Examples:
  - `day1.activity3.problemStatement` → Day 2 hypotheses
  - `basic_profile` → `customerProfile`

---

## 🚫 8. Remove Legacy Logic

Do **not** include:
- Base64 encoding or decoding
- Clipboard copy/export/import buttons
- GSAP2025- code formatting
- Manual progress code handling

Supabase fully replaces this.

---

## ✅ 9. Implementation Order

Start here:
```
Workshop: day1 – Problems Worth Solving
Activity: activity1 – Problem Origin Story
```

Steps:
1. Build activity UI in React
2. Load/save JSON via Supabase
3. Apply design and validation rules
4. Confirm full flow works with generated key

Then replicate for all other activities.

---