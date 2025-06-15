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

## 🏗️ 7. Activity Shell Layout Standard

### Overview
All activities must follow a consistent shell layout pattern to ensure uniform user experience across the workshop. This standard defines the structural components and their arrangement.

### Core Components

#### ActivityShell Component
- **Component**: `src/components/layout/ActivityShell.tsx`
- **Purpose**: Wrapper component that provides consistent layout structure for all activities
- **Props**:
  ```ts
  interface ActivityShellProps {
    title: string;
    subtitle: string;
    currentStep: number;
    totalSteps: number;
    userKey: string;
    children: ReactNode;
    onReset: () => void;
  }
  ```

#### Layout Structure
```tsx
<ActivityShell>
  <ActivityHeader />     // Title, subtitle, user ID, progress
  <ActivityContainer>    // Main content area
    <StepContent />      // Dynamic step content
    <NavigationBar />    // Back/Continue buttons
  </ActivityContainer>
  <ActivityFooter />     // Optional footer content
</ActivityShell>
```

### Standard Layout Hierarchy

#### 1. **Outer Container**
- **Class**: `min-h-screen` with gradient background
- **Background**: `linear-gradient(135deg, #FFE599 0%, #FF9000 100%)`
- **Padding**: `max-w-5xl mx-auto p-4 sm:p-6`

#### 2. **Activity Header Card**
- **Class**: `bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6`
- **Contains**:
  - Activity title (`text-2xl sm:text-3xl font-bold text-gray-800`)
  - Activity subtitle (`text-gray-600`)
  - User ID display (top-right, `text-sm bg-gray-50 px-3 py-2 rounded-lg`)
  - Progress indicator component

#### 3. **Main Content Card**
- **Class**: `bg-white rounded-lg shadow-lg p-4 sm:p-6 relative`
- **Contains**:
  - Reset button (top-right, absolute positioned)
  - Dynamic step content
  - Navigation bar (bottom)

#### 4. **Navigation Bar**
- **Class**: `bg-gray-50 border border-gray-200 rounded-lg p-4`
- **Layout**: Flexbox with space-between alignment
- **Contains**:
  - Timer component (left side)
  - Navigation buttons (right side)
  - Back button (conditional, steps 2+)
  - Continue/Complete button

### Step Content Standards

#### Step Container
- **Class**: `space-y-6`
- **Structure**:
  ```tsx
  <div className="space-y-6">
    <StepHeader />       // Title, description, timer
    <InstructionCard />  // Colored instruction block
    <FormFields />       // Input fields with validation
    <NavigationBar />    // Bottom navigation
  </div>
  ```

#### Instruction Cards
- **Purpose**: Highlight key instructions or prompts
- **Variants**:
  - Orange theme: `background: linear-gradient(135deg, #FFE599 0%, #FF9000 20%)`
  - Blue theme: `background: linear-gradient(135deg, #E6F3FF 0%, #55BFFA 20%)`
- **Structure**:
  ```tsx
  <div className="border-2 rounded-lg p-5 mb-4" style={{...}}>
    <div className="flex items-center mb-3">
      <Icon className="mr-2" size={24} />
      <h4 className="text-lg font-semibold">Section Title</h4>
    </div>
    <p className="mb-2">Description text</p>
    <ol className="list-decimal list-inside space-y-1 ml-2">
      <li>Instruction item</li>
    </ol>
  </div>
  ```

### Navigation Standards

#### Button Placement
- **Back Button**: Left side of navigation bar
- **Continue Button**: Right side of navigation bar
- **Reset Button**: Top-right corner (absolute positioned)

#### Button Hierarchy
```tsx
<div className="flex flex-col sm:flex-row gap-3">
  <BackButton />           // Conditional (steps 2+)
  <div className="flex-1"></div>  // Spacer
  <ContinueButton />       // Primary action
</div>
```

#### Continue Button States
- **Valid**: Orange background (`#FF9000`), white text
- **Invalid**: Gray background (`#d1d5db`), gray text (`#8A8A8A`)
- **Disabled**: `cursor-not-allowed` class

### Responsive Behavior

#### Breakpoints
- **Mobile**: `< 640px` - Single column layout
- **Tablet**: `640px - 1024px` - Adjusted padding and spacing
- **Desktop**: `> 1024px` - Full layout with optimal spacing

#### Mobile Adaptations
- Stack navigation buttons vertically
- Reduce padding: `p-4` instead of `p-6`
- Adjust text sizes: `text-xl` instead of `text-2xl`
- Single column form fields

### Accessibility Requirements

#### Focus Management
- Logical tab order through form fields
- Visible focus indicators on all interactive elements
- Skip links for keyboard navigation

#### ARIA Labels
- Progress indicators with `aria-label`
- Form fields with proper `aria-describedby`
- Navigation buttons with descriptive labels

#### Touch Targets
- Minimum 44px height for all buttons
- Adequate spacing between interactive elements
- Hover states that work on touch devices

### Implementation Example

```tsx
// ActivityShell usage
<ActivityShell
  title="Problem Origin Story"
  subtitle="Activity 1: Understanding the roots of your problem"
  currentStep={currentStep}
  totalSteps={3}
  userKey={userKey}
  onReset={handleReset}
>
  {currentStep === 1 && (
    <IndividualReflection
      responses={responses}
      onInputChange={handleInputChange}
      onContinue={() => setCurrentStep(2)}
      isValid={isStep1Valid()}
    />
  )}
  {/* Additional steps... */}
</ActivityShell>
```

### Benefits
- **Consistency**: All activities follow the same visual and interaction patterns
- **Maintainability**: Layout changes only need to be made in one place
- **Accessibility**: Built-in accessibility features across all activities
- **Responsive**: Consistent responsive behavior across all activities
- **Developer Experience**: Clear structure makes it easy to build new activities

---

## 🧪 8. Validation & Resilience

- Required fields must be valid before marking `completedAt`
- No lockouts — user can revise answers any time
- If data load fails:
  - Show helpful error state
  - Allow fresh start if needed
- Accessibility: Touch targets ≥ 44px, keyboard nav

---

## 💡 9. Auto-Population (Future Activities)

- Auto-fill fields using earlier activity data
- Users can edit these pre-filled values
- Examples:
  - `day1.activity3.problemStatement` → Day 2 hypotheses
  - `basic_profile` → `customerProfile`

---

## 🚫 10. Remove Legacy Logic

Do **not** include:
- Base64 encoding or decoding
- Clipboard copy/export/import buttons
- GSAP2025- code formatting
- Manual progress code handling

Supabase fully replaces this.

---

## ✅ 11. Implementation Order

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

## 📚 12. Component Usage Examples

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

### Using Activity Shell Component
```tsx
import { ActivityShell } from './layout';

<ActivityShell
  title="Problem Origin Story"
  subtitle="Activity 1: Understanding the roots of your problem"
  currentStep={currentStep}
  totalSteps={3}
  userKey={userKey}
  onReset={handleReset}
>
  <YourStepContent />
</ActivityShell>
```

---