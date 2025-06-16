# GTM Workshop – Bolt Migration Standards

> 🧠 **Collaboration Note**:  
> This project uses a 5-agent development workflow:
> - **User**: defines vision, directs standards, validates work  
> - **ChatGPT**: owns standards, todo tracking, and process memory  
> - **Claude Code** (in VS Code): sees the full codebase, supports synthesis and auditing  
> - **Bolt.new**: implements frontend components from specs, pushes to GitHub  
> - **Gemini**: reads full repo context from GitHub Cloud, assists with architectural refactors and multi-file audits
>
> GitHub (`main` branch) is the source of truth for all agents (including Gemini).  
> Standards in this doc are binding for Bolt and Claude when building or validating features.

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
  "workshop1": {
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

-### Reset Button Standard (🔄 REUSABLE)
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

### ♿ Contrast & Accessibility Guidelines

All UI elements must meet minimum accessibility contrast standards (WCAG AA):

- Use `text-white` or `text-gray-900` on colored backgrounds
- Avoid `text-gray-500` unless on white or very light backgrounds
- Use `text-gray-600` or darker for disabled states
- All body text must meet 4.5:1 contrast ratio (3:1 for large text)
- Avoid blue-on-orange combinations such as `#A5B6EF` on `#FF9000`
- Use Tailwind’s built-in contrast utilities (`text-white`, `bg-gray-900`, etc.)

✅ Examples:
- Progress indicators: darker orange (`#E67300`) with white text
- Disabled buttons: gray text `#666666` minimum on light backgrounds
- Instruction blocks: always use `text-white` on gradient backgrounds

These rules are binding for all current and future activities. Bolt must validate contrast before pushing any activity UI.

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

#### 2. **Activity Header Card (Sticky)**
- **Container Class**: `sticky top-0 z-10 p-4 sm:p-6 pb-0`
- **Card Class**: `bg-white rounded-lg shadow-lg p-4 sm:p-6`
- **Sticky Behavior**:
  - Sticks to top of viewport when scrolling
  - Uses `z-10` to ensure it stays above content
  - Background color ensures content doesn't bleed through
- **Contains**:
  - Activity title (`text-2xl sm:text-3xl font-bold text-gray-800`)
  - Activity subtitle (`text-gray-600`)
  - User ID display (top-right, `text-sm bg-gray-50 px-3 py-2 rounded-lg`)
  - Progress indicator component

#### 3. **Main Content Card**
- **Container Class**: `p-4 sm:p-6 pt-0` (provides padding and separates from sticky header)
- **Card Class**: `bg-white rounded-lg shadow-lg p-4 sm:p-6 relative`
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
// ActivityShell usage with sticky header
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

// Internal structure created by ActivityShell:
<div className="min-h-screen" style={{background: 'linear-gradient(...)'}}>
  <div className="max-w-5xl mx-auto">
    {/* Sticky header */}
    <div className="sticky top-0 z-10 p-4 sm:p-6 pb-0">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        {/* Title, subtitle, user ID, progress indicator */}
      </div>
    </div>
    {/* Main content area */}
    <div className="p-4 sm:p-6 pt-0">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 relative">
        {/* Your activity content */}
      </div>
    </div>
  </div>
</div>
```

### Benefits
- **Consistency**: All activities follow the same visual and interaction patterns
- **Maintainability**: Layout changes only need to be made in one place
- **Accessibility**: Built-in accessibility features across all activities
- **Responsive**: Consistent responsive behavior across all activities
- **Developer Experience**: Clear structure makes it easy to build new activities
- **User Experience**: Sticky header keeps progress and context visible while scrolling through long content

---

## 📊 8. Data Structure Standards

### Overview
This section establishes consistent patterns for data flow across steps and activities, ensuring predictable state management and seamless user experience throughout the workshop.

### Core Data Principles

#### 1. **Single Source of Truth**
- All workshop data lives in one centralized `WorkshopData` object
- Supabase stores the complete data structure as JSON
- Local state mirrors the server state during active sessions
- No fragmented or duplicate data storage

#### 2. **Hierarchical Organization**
- Data is organized by day → activity → step structure
- Each level maintains its own metadata and completion status
- Nested structure allows for easy expansion and querying

#### 3. **Immutable Updates**
- State updates use immutable patterns (spread operators, etc.)
- Each update creates a new state object rather than mutating existing
- Enables reliable undo/redo functionality and state debugging

### Data Type Definitions

#### WorkshopData Interface
```ts
interface WorkshopData {
  version: string;                    // Schema version for migrations
  createdAt: string;                  // ISO timestamp
  lastUpdated: string;                // ISO timestamp
  userProfile?: UserProfile;          // Optional user information
  day1: Day1Data;                     // Day 1 activities
  day2?: Day2Data;                    // Day 2 activities (optional)
  day3?: Day3Data;                    // Day 3 activities (optional)
}
```

#### Activity Data Structure
```ts
interface ActivityData {
  startedAt?: string;                 // When user first began
  completedAt?: string;               // When user finished
  lastModified: string;               // Last edit timestamp
  stepData: Record<string, any>;      // Step-specific responses
  metadata?: {
    timeSpent?: number;               // Total time in seconds
    revisitCount?: number;            // How many times revisited
    validationErrors?: string[];      // Any validation issues
  };
}
```

#### Step Data Patterns
```ts
// Text Response Pattern
interface TextResponseStep {
  response: string;
  wordCount: number;
  isValid: boolean;
  lastModified: string;
}

// Multiple Choice Pattern
interface MultipleChoiceStep {
  selectedOption: string;
  otherText?: string;                 // For "Other" options
  isValid: boolean;
  lastModified: string;
}

// Ranking Pattern
interface RankingStep {
  rankedItems: Array<{
    id: string;
    rank: number;
    item: string;
  }>;
  isValid: boolean;
  lastModified: string;
}
```

### Activity-Specific Data Schemas

#### Day 1, Activity 1: Problem Origin Story
```ts
interface ProblemOriginStoryData extends ActivityData {
  stepData: {
    individualReflection: {
      momentOfRealization: TextResponseStep;
      whoExperienced: TextResponseStep;
      whyMatters: TextResponseStep;
    };
    partnerSharing: {
      whatSurprised: TextResponseStep;
      howRealProblem: TextResponseStep;
    };
    summary: {
      keyInsights: string[];
      nextSteps: string[];
    };
  };
}
```

#### Day 1, Activity 2: Problem Validation
```ts
interface ProblemValidationData extends ActivityData {
  stepData: {
    hypothesisFormation: {
      problemStatement: TextResponseStep;
      targetAudience: TextResponseStep;
      assumptions: TextResponseStep[];
    };
    evidenceGathering: {
      researchMethods: MultipleChoiceStep[];
      findings: TextResponseStep[];
    };
    validation: {
      isValidated: boolean;
      confidence: number;              // 1-10 scale
      nextActions: string[];
    };
  };
}
```

### State Management Patterns

#### Component State Structure
```ts
interface ActivityState {
  // Core data
  responses: ActivityData;
  
  // UI state
  currentStep: number;
  loading: boolean;
  error: string | null;
  
  // Validation state
  validationErrors: Record<string, string[]>;
  isStepValid: (step: number) => boolean;
  
  // Navigation state
  canGoBack: boolean;
  canGoForward: boolean;
  hasUnsavedChanges: boolean;
}
```

#### State Update Patterns
```ts
// Immutable field update
const updateField = (field: string, value: any) => {
  setResponses(prev => ({
    ...prev,
    stepData: {
      ...prev.stepData,
      [currentStepKey]: {
        ...prev.stepData[currentStepKey],
        [field]: {
          response: value,
          wordCount: getWordCount(value),
          isValid: validateField(field, value),
          lastModified: new Date().toISOString()
        }
      }
    },
    lastModified: new Date().toISOString()
  }));
};

// Step completion update
const completeStep = (stepKey: string) => {
  setResponses(prev => ({
    ...prev,
    stepData: {
      ...prev.stepData,
      [stepKey]: {
        ...prev.stepData[stepKey],
        completedAt: new Date().toISOString()
      }
    }
  }));
};
```

### Data Validation Standards

#### Field Validation Rules
```ts
interface ValidationRule {
  field: string;
  rules: Array<{
    type: 'required' | 'minWords' | 'maxWords' | 'pattern';
    value: any;
    message: string;
  }>;
}

// Example validation rules
const PROBLEM_ORIGIN_VALIDATION: ValidationRule[] = [
  {
    field: 'momentOfRealization',
    rules: [
      { type: 'required', value: true, message: 'This field is required' },
      { type: 'minWords', value: 10, message: 'Please provide at least 10 words' }
    ]
  },
  {
    field: 'whoExperienced',
    rules: [
      { type: 'required', value: true, message: 'This field is required' },
      { type: 'minWords', value: 5, message: 'Please provide at least 5 words' }
    ]
  }
];
```

#### Validation Helper Functions
```ts
// Word count validation
export const validateWordCount = (text: string, min: number, max?: number): boolean => {
  const count = getWordCount(text);
  if (count < min) return false;
  if (max && count > max) return false;
  return true;
};

// Step completion validation
export const validateStepCompletion = (stepData: any, rules: ValidationRule[]): boolean => {
  return rules.every(rule => 
    rule.rules.every(validation => 
      validateField(stepData[rule.field], validation)
    )
  );
};
```

### Data Persistence Patterns

#### Auto-Save Implementation
```ts
// Debounced auto-save hook
const useAutoSave = (data: WorkshopData, userKey: string, delay: number = 1000) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (userKey && data) {
        setIsSaving(true);
        try {
          await saveUserData(userKey, data);
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [data, userKey, delay]);

  return { isSaving, lastSaved };
};
```

#### Data Loading Patterns
```ts
// Progressive data loading
const loadActivityData = async (userKey: string, day: string, activity: string) => {
  try {
    const userData = await loadUserData(userKey);
    
    // Return specific activity data or initialize empty structure
    return userData?.[day]?.[activity] || initializeActivityData(day, activity);
  } catch (error) {
    console.error('Failed to load activity data:', error);
    return initializeActivityData(day, activity);
  }
};

// Initialize empty activity structure
const initializeActivityData = (day: string, activity: string): ActivityData => ({
  startedAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  stepData: {},
  metadata: {
    timeSpent: 0,
    revisitCount: 0
  }
});
```

### Cross-Activity Data Flow

#### Data Inheritance Patterns
```ts
// Auto-populate fields from previous activities
const inheritPreviousData = (currentActivity: string, userData: WorkshopData) => {
  const inheritanceMap = {
    'day1.activity2': {
      problemStatement: userData.day1?.activity1?.stepData?.individualReflection?.momentOfRealization?.response
    },
    'day2.activity1': {
      targetAudience: userData.day1?.activity1?.stepData?.individualReflection?.whoExperienced?.response,
      problemContext: userData.day1?.activity2?.stepData?.validation?.problemStatement?.response
    }
  };

  return inheritanceMap[currentActivity] || {};
};
```

#### Summary Data Aggregation
```ts
// Aggregate data for cross-activity summaries
const generateActivitySummary = (activityData: ActivityData) => {
  return {
    completionStatus: activityData.completedAt ? 'completed' : 'in-progress',
    keyResponses: extractKeyResponses(activityData.stepData),
    insights: generateInsights(activityData.stepData),
    timeSpent: activityData.metadata?.timeSpent || 0,
    lastModified: activityData.lastModified
  };
};
```

### Error Handling & Recovery

#### Data Recovery Patterns
```ts
// Graceful data recovery
const recoverActivityData = (corruptedData: any, activitySchema: any) => {
  try {
    // Attempt to salvage valid fields
    const recoveredData = {};
    
    Object.keys(activitySchema).forEach(key => {
      if (corruptedData[key] && validateField(corruptedData[key], activitySchema[key])) {
        recoveredData[key] = corruptedData[key];
      } else {
        recoveredData[key] = getDefaultValue(activitySchema[key]);
      }
    });

    return recoveredData;
  } catch (error) {
    console.error('Data recovery failed:', error);
    return initializeActivityData();
  }
};
```

#### Conflict Resolution
```ts
// Handle data conflicts between local and server state
const resolveDataConflict = (localData: WorkshopData, serverData: WorkshopData) => {
  // Use most recent lastModified timestamp as tie-breaker
  const localTime = new Date(localData.lastUpdated).getTime();
  const serverTime = new Date(serverData.lastUpdated).getTime();
  
  if (localTime > serverTime) {
    return { resolved: localData, source: 'local' };
  } else {
    return { resolved: serverData, source: 'server' };
  }
};
```

### Implementation Guidelines

#### 1. **Consistent Field Naming**
- Use camelCase for all field names
- Include descriptive prefixes: `is`, `has`, `can` for booleans
- Use consistent suffixes: `At` for timestamps, `Count` for numbers

#### 2. **Type Safety**
- Define TypeScript interfaces for all data structures
- Use strict typing for state management
- Implement runtime validation for critical data paths

#### 3. **Performance Optimization**
- Implement debounced auto-save to reduce server calls
- Use React.memo for expensive data transformations
- Cache validation results to avoid repeated calculations

#### 4. **Data Migration Support**
- Include version field in all data structures
- Implement migration functions for schema changes
- Maintain backward compatibility for at least one version

### Benefits
- **Predictability**: Consistent data patterns across all activities
- **Maintainability**: Clear data flow makes debugging and updates easier
- **Scalability**: Hierarchical structure supports easy expansion
- **Reliability**: Built-in validation and error recovery
- **Performance**: Optimized patterns for efficient data handling
- **Type Safety**: Strong typing prevents runtime errors

---

## 🧪 9. Validation & Resilience

- Required fields must be valid before marking `completedAt`
- No lockouts — user can revise answers any time
- If data load fails:
  - Show helpful error state
  - Allow fresh start if needed
- Accessibility: Touch targets ≥ 44px, keyboard nav

---

## 💡 10. Auto-Population (Future Activities)

- Auto-fill fields using earlier activity data
- Users can edit these pre-filled values
- Examples:
  - `workshop1.activity3.problemStatement` → Workshop 2 hypotheses
  - `basic_profile` → `customerProfile`

---

## 🚫 11. Remove Legacy Logic

Do **not** include:
- Base64 encoding or decoding
- Clipboard copy/export/import buttons
- GSAP2025- code formatting
- Manual progress code handling

Supabase fully replaces this.

---

## ✅ 12. Implementation Order

Start here:
```
Workshop: workshop-1-problems_worth_solving – Problems Worth Solving
Activity: activity-1 – Problem Origin Story
```

Steps:
1. Build activity UI in React
2. Load/save JSON via Supabase
3. Apply design and validation rules
4. Confirm full flow works with generated key

Then replicate for all other activities.

---

## 📚 13. Component Usage Examples

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

## 🌐 9. Inter-Activity Navigation & Routing Standards

### Overview
This section defines how users navigate between activities and how routing should be structured across the GTM Workshop app.

### Core Navigation Patterns

#### 1. Routing Structure
- Use React Router v6+ for page-based routing.
- Each activity is accessible via a route of the form:
  ```
  /workshop-1-problems_worth_solving/activity-1
  /workshop-1-problems_worth_solving/activity-2
  /workshop-2-finding_your_early_customers/activity-1
  ```
- Dynamic route parameters can be used for workshop step logic if needed:
  ```
  /:workshop/:activity
  ```

#### 2. Navigation Components

##### Continue to Next Activity
- A `ContinueToNextActivity` button is shown at the end of each activity.
- Clicking this routes the user to the next activity using React Router's `navigate()` function.
- The target route is hardcoded in activity config or passed as a prop.
- Ensure the `userKey` is preserved during navigation via context or query params.

##### Back to Workshop
- `BackToWorkshop` button routes users to `/workshop-overview` or the relevant index page.
- Can be a standard button in the footer or sidebar of each activity.
- Should not clear or affect user progress data.

#### 3. Route Guarding & Validation
- Activities should validate required data before allowing forward navigation.
- If `completedAt` is missing for the previous activity, optionally show a warning modal.
- Prevent direct access to future activities unless prior steps are complete (optional).

#### 4. Navigation Context
- A `NavigationProvider` can be used to expose navigation functions and activity metadata.
- Allows consistent control over:
  - Current/next activity
  - Step count and current step
  - Access rules and redirect logic

```tsx
// Example usage
const { goToNextActivity, goToWorkshopHome } = useNavigation();
```

#### 5. Route Persistence
- Persist the user's current activity and step in localStorage:
  ```
  localStorage.setItem('lastVisitedActivity', '/day1/activity2');
  ```
- On app load, route them back to this path if `userKey` is found.

#### 6. Accessibility
- All navigation buttons must be reachable via keyboard
- Buttons must include descriptive `aria-labels` like `"Continue to Activity 2"` or `"Back to Workshop Overview"`

### Implementation Benefits
- Seamless transitions between activities
- Predictable route structure for developers
- Improved session continuity with route persistence
- Flexible guardrails for incomplete activities
- Supports scalable multi-day, multi-activity workshop flows

---

## 🧭 10. Activity Migration Framework

### Purpose
This section defines the standardized approach to migrate each legacy HTML activity into the modern React + Supabase system. It ensures repeatability, maintainability, and consistent user experience across all activities.

### Migration Inputs
Each migration is driven by:
- Legacy source file: e.g., `problems-activity-2.html`
- Activity context: workshop number, activity number, step count
- Expected interaction type(s): reflection, sharing, ranking, etc.

### Migration Checklist
1. **Define Activity Route**
   - Use standard path: `/workshop-1-problems_worth_solving/activity-2`
   - Register route in the router config
2. **Implement ActivityShell Wrapper**
   - Use the standard `<ActivityShell>` layout (Section 7)
   - Provide all required props: title, subtitle, steps, userKey, onReset
3. **Create Step Components**
   - Each step should be a standalone React component
   - Follow `StepContainer`, `InstructionCard`, and input patterns
   - Implement validation, word count, and progression logic
4. **Wire Navigation Logic**
   - Use `BackButton`, `ContinueButton`, `ResetButton` from UI library
   - Enable proper forward/backward movement and reset behavior
5. **Define Activity Schema**
   - Add new TypeScript interface to the main schema
   - Use `stepData` with strongly typed step names
   - Include `startedAt`, `lastModified`, and `completedAt` metadata
6. **Implement Validation Rules**
   - Use the standard `ValidationRule` format
   - Add logic for `isValid` checks in each step
   - Add visual feedback (green check, disabled button)
7. **Connect to Supabase**
   - Load and save data using `loadUserData` and `saveUserData`
   - Preserve `userKey` and ensure isolated data per activity
8. **Ensure UI Standards**
   - Reuse tooltip/back/reset components (Section 6)
   - Apply StepHeader and InstructionCard formats (Section 7)
   - Maintain spacing, font hierarchy, and responsive layout
9. **Test Accessibility**
   - All buttons keyboard-accessible
   - ARIA labels and titles on interactive components
   - Minimum 44px targets and logical tab order
10. **Document Migration**
   - Update `todo.md` and `bolt-migration-standards.md` if needed
   - Ensure mappings, schema, and route are clearly traceable

### Output Requirements
- Folder: `src/activities/workshop-1-problems_worth_solving/activity-2`
- Route added to React Router config
- Schema updated in `WorkshopData`
- UI verified against Section 7 layout and Section 6 components
- Activity added to progression logic (e.g. `ContinueToNextActivity`)

### Benefits
- 🔁 Repeatable activity migration process
- 🎯 Strong type safety and consistent layout
- ⚙️ Clean division between layout, data, and navigation
- 📐 Predictable structure for future contributors
- 🧪 Easier testing and debugging