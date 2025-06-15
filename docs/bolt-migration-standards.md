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

---

## 🔧 6. Reusable UI Components

### Tooltip Standard (🔍 REUSABLE)
- **Component**: `src/components/ui/Tooltip.tsx`
- **Usage**: Wrap any element that needs explanatory text
- **Trigger**: Hover on desktop, includes `title` attribute for accessibility
- **Design**:
  - Dark background: `#1F2937`
  - White text
  - Arrow pointing to target element
  - Max-width: 16rem (256px / ~64 characters)
  - Spacing: 8–12px from target
  - Safe z-index (z-50)
  - Smooth fade-in/out transitions (200ms)
- **Accessibility**:
  - Must include `aria-describedby` and `title` attributes
  - Keyboard accessible via `title` attribute
- **Standard Messages**:
  ```ts
  TOOLTIP_MESSAGES.RESET_ACTIVITY = "This will restart the activity and clear your responses. Your user ID will stay the same so your progress across other activities won't be lost."
  ```

### Back Button Standard (🔙 REUSABLE)
- **Component**: `src/components/ui/BackButton.tsx`
- **Usage**: Navigation between steps in multi-step flows
- **Behavior**:
  - On click: Navigate to previous step
  - Maintains current inputs/state
  - Preserves user data
- **Placement**: Bottom-left of step container, below main content
- **Style**:
  - Gray background (`#8A8A8A`)
  - White text
  - Left arrow icon (Lucide `ArrowLeft`)
  - Min height: 44px (touch target)
  - Hover state: darker gray (`#666666`)
- **Conditional Rendering**: Only appears on steps beyond Step 1

### Reset Button Standard (🔄 REUSABLE)
- **Component**: `src/components/ui/ResetButton.tsx`
- **Variants**:
  - `icon`: Circular icon button (top-right of containers)
  - `full`: Full button with text (action bars)
- **Behavior**: Clears current activity data, preserves user key
- **Tooltip**: Always includes standard reset tooltip
- **Style**:
  - Icon variant: Circular, gray background, rotate animation on hover
  - Full variant: Standard button styling with tooltip
- **Accessibility**: Includes `aria-label` and `title` attributes

---

## 🧪 7. Validation & Resilience

- Required fields must be valid before marking `completedAt`
- No lockouts — user can revise answers any time
- If data load fails:
  - Show helpful error state
  - Allow fresh start if needed
- Accessibility: Touch targets ≥ 44px, keyboard nav

---

## 💡 8. Auto-Population (Future Activities)

- Auto-fill fields using earlier activity data
- Users can edit these pre-filled values
- Examples:
  - `day1.activity3.problemStatement` → Day 2 hypotheses
  - `basic_profile` → `customerProfile`

---

## 🚫 9. Remove Legacy Logic

Do **not** include:
- Base64 encoding or decoding
- Clipboard copy/export/import buttons
- GSAP2025- code formatting
- Manual progress code handling

Supabase fully replaces this.

---

## ✅ 10. Implementation Order

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

## 📚 11. Component Usage Examples

### Using Tooltip Component
```tsx
import { Tooltip, TOOLTIP_MESSAGES } from './ui';

<Tooltip content={TOOLTIP_MESSAGES.RESET_ACTIVITY}>
  <button onClick={handleReset}>Reset</button>
</Tooltip>
```

### Using Back Button Component
```tsx
import { BackButton } from './ui';

<BackButton
  onClick={() => setCurrentStep(currentStep - 1)}
  label="Back to Step 1"
/>
```

### Using Reset Button Component
```tsx
import { ResetButton } from './ui';

// Icon variant (top-right of containers)
<ResetButton onClick={handleReset} variant="icon" />

// Full variant (action bars)
<ResetButton onClick={handleReset} variant="full" />
```

---