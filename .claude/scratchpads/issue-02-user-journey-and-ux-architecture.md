# User Journey & UX Architecture - Grant-Harness Frontend

**Created**: 2025-11-12
**Purpose**: Define user experience flow through Grant-Harness frontend, accommodating Phase 1 (replica forms) and Phase 2 (auth + multi-tenant) expansion
**Related**: Issue #2 (Application Form Replication), ADR-1001 (Tech Stack), ADR-1004 (Collaboration Backend)

---

## Strategic Context

**Phase 1 (Week 2) Scope**: Issue #2 focuses on creating replica application forms (IGP + BBI) without authentication. Users can access forms directly, fill them out, and use LocalStorage for save/resume.

**Phase 2 Expansion (Week 5+)**: Add user authentication, multi-tenant dashboard, saved applications, collaboration workflow. Firebase template provides auth foundation.

**Key Requirement**: Design UX architecture that delivers Phase 1 value (replica forms) while enabling seamless Phase 2 growth without major refactoring.

---

## Firebase Template Assessment

### Repository Analysis: `agency-ai-solutions/nextjs-firebase-ai-coding-template`

**Template Structure**:
```
front/src/
├── auth/                          # Firebase Authentication
│   ├── AuthProvider.tsx          # Context provider wrapper
│   ├── authContext.ts            # React context definition
│   ├── authOperations.ts         # Firebase auth operations
│   ├── types.ts                  # Auth TypeScript types
│   └── useAuth.ts                # Custom hook for auth state
├── app/
│   ├── dashboard/                # Protected dashboard page
│   ├── signin/                   # Sign-in page (email/password + Google)
│   ├── signup/                   # Sign-up page
│   ├── layout.tsx                # Root layout with AuthProvider
│   └── page.tsx                  # Landing page
└── lib/
    ├── firebase/                 # Firebase SDK config
    └── utils/                    # Utility functions
```

**Key Features**:
- **Firebase Authentication**: Email/password + Google Sign-In ready
- **Material-UI (MUI)**: Component library (we'll replace with Shadcn UI)
- **Event-driven broker**: Pub/sub pattern for decoupled components
- **Protected routes**: Dashboard requires authentication
- **Auth context**: Global auth state management

### Suitability for Grant-Harness

**✅ What We Can Use**:
1. **Auth folder structure** (`front/src/auth/`):
   - AuthProvider pattern is solid
   - Firebase operations abstraction is clean
   - TypeScript types well-defined
   - Can adapt to our Shadcn UI components

2. **Firebase configuration**:
   - Firebase SDK setup patterns
   - Environment variable management
   - Auth initialization logic

3. **Protected route pattern**:
   - Dashboard structure for Phase 2
   - Route guards using auth context

**❌ What We'll Replace**:
1. **Material-UI → Shadcn UI**:
   - Template uses MUI, we use Shadcn UI (per ADR-1001)
   - Need to rebuild sign-in/sign-up pages with Shadcn components
   - Keep auth logic, swap UI components

2. **Event broker**:
   - Template's pub/sub pattern may be overkill for Phase 1-2
   - Evaluate if needed during Phase 2 implementation

**Assessment**: Firebase template is **suitable with modifications**. The auth infrastructure is exactly what we need for Phase 2, but we'll replace MUI with Shadcn UI and simplify where possible.

---

## UX Architecture Overview

### Two-Phase Design Strategy

**Phase 1 (Week 2)**: Public access to replica forms
- No authentication required
- Direct navigation to `/applications/[grant-id]`
- LocalStorage for save/resume
- Simple landing page with form links

**Phase 2 (Week 5+)**: Authenticated multi-tenant platform
- User sign-in/sign-up (email/password + Google)
- Protected dashboard at `/dashboard`
- Saved applications list
- Collaboration workflow

### Folder Structure (Grant-Portal)

```
front/grant-portal/
├── src/
│   ├── app/                                    # Next.js App Router
│   │   ├── (public)/                          # Public routes (no auth)
│   │   │   ├── page.tsx                       # Landing page (form directory)
│   │   │   └── applications/
│   │   │       ├── [grantId]/                 # Dynamic grant form routes
│   │   │       │   └── page.tsx               # Form page (IGP, BBI, etc.)
│   │   │       └── layout.tsx                 # Public application layout
│   │   │
│   │   ├── (auth)/                            # Auth routes (Phase 2)
│   │   │   ├── signin/
│   │   │   │   └── page.tsx                   # Sign-in page (Shadcn UI)
│   │   │   └── signup/
│   │   │       └── page.tsx                   # Sign-up page (Shadcn UI)
│   │   │
│   │   ├── (protected)/                       # Protected routes (Phase 2)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx                   # User dashboard
│   │   │   └── my-applications/
│   │   │       ├── page.tsx                   # Saved applications list
│   │   │       └── [applicationId]/
│   │   │           └── page.tsx               # Resume saved application
│   │   │
│   │   ├── layout.tsx                         # Root layout (AuthProvider)
│   │   └── globals.css                        # Global Tailwind styles
│   │
│   ├── auth/                                   # Firebase auth (Phase 2)
│   │   ├── AuthProvider.tsx                   # From Firebase template
│   │   ├── authContext.ts
│   │   ├── authOperations.ts
│   │   ├── types.ts
│   │   └── useAuth.ts
│   │
│   ├── components/
│   │   ├── forms/                             # Form components (Phase 1)
│   │   │   ├── DynamicForm.tsx                # Schema renderer
│   │   │   ├── DynamicField.tsx               # Field type router
│   │   │   ├── FormStep.tsx                   # Step container
│   │   │   └── FormNavigation.tsx             # Next/Previous buttons
│   │   │
│   │   ├── ui/                                # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── form.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── card.tsx
│   │   │   ├── separator.tsx
│   │   │   └── progress.tsx
│   │   │
│   │   └── layout/                            # Layout components
│   │       ├── Header.tsx                     # Site header (adaptive for auth)
│   │       ├── Footer.tsx                     # Site footer
│   │       └── Sidebar.tsx                    # Dashboard sidebar (Phase 2)
│   │
│   ├── lib/
│   │   ├── schemas/                           # Zod form schemas (Phase 1)
│   │   │   ├── igp-commercialisation.ts       # IGP schema
│   │   │   ├── battery-breakthrough.ts        # BBI schema
│   │   │   └── schema-types.ts                # Shared types
│   │   │
│   │   ├── firebase/                          # Firebase config (Phase 2)
│   │   │   ├── config.ts                      # Firebase initialization
│   │   │   └── firestore.ts                   # Firestore client
│   │   │
│   │   └── utils/                             # Utilities
│   │       ├── localStorage.ts                # LocalStorage helpers (Phase 1)
│   │       └── cn.ts                          # Shadcn UI classname utility
│   │
│   └── types/                                  # Global TypeScript types
│       ├── application.ts                      # Application data types
│       ├── grant.ts                            # Grant data types
│       └── user.ts                             # User data types (Phase 2)
│
├── public/                                     # Static assets
├── tests/
│   └── e2e/                                    # Playwright E2E tests
│       ├── igp-form.spec.ts
│       └── bbi-form.spec.ts
│
├── package.json                                # Next.js 15 + dependencies
├── tsconfig.json                               # TypeScript config
├── tailwind.config.ts                          # Tailwind config
├── components.json                             # Shadcn UI config
└── next.config.js                              # Next.js config
```

---

## User Journey Flows

### Phase 1: Public Form Access (Week 2)

**User Goal**: Complete grant application form for EMEW

**Journey**:
1. **Landing Page** (`/`)
   - Simple page listing available grant forms
   - Cards for IGP and BBI grants
   - Click card → navigate to form

2. **Grant Form Page** (`/applications/igp-commercialisation`)
   - Multi-step form (5-8 steps for IGP)
   - Progress indicator (Step 1 of 8)
   - Form fields with Zod validation
   - Next/Previous buttons
   - Auto-save to LocalStorage every 30 seconds
   - "Save & Exit" button → LocalStorage, show success message

3. **Resume Application**
   - Return to `/applications/igp-commercialisation`
   - Detect LocalStorage data
   - Show banner: "You have a saved application from [date]. Resume or Start New?"
   - Resume → restore state
   - Start New → clear LocalStorage

4. **Submit Application** (Phase 1: Just console log)
   - Final step: Review & Submit
   - Show all entered data
   - Submit button → `console.log()` for Phase 1
   - Success message: "Application preview complete"

**Key Features**:
- No authentication required
- LocalStorage persistence
- No server-side storage (Phase 1)
- Simple, focused UX

### Phase 2: Authenticated Platform (Week 5+)

**User Goal**: Save applications, collaborate with team, track submissions

**Journey**:
1. **Landing Page** (`/`) - Enhanced
   - Public: Form directory (same as Phase 1)
   - Authenticated users: "Go to Dashboard" button
   - Sign-in/Sign-up links in header

2. **Sign-Up** (`/signup`)
   - Email/password form (Shadcn UI)
   - Google Sign-In button
   - Firebase auth → create user
   - Redirect to dashboard

3. **Sign-In** (`/signin`)
   - Email/password form
   - Google Sign-In button
   - "Forgot password?" link
   - Successful login → redirect to dashboard

4. **Dashboard** (`/dashboard`) - Protected Route
   - Welcome message: "Welcome back, [User Name]"
   - Stats cards:
     - Applications in progress: 2
     - Submitted applications: 1
     - Grants matched to EMEW: 8
   - Quick actions:
     - Start new application
     - View my applications
     - Browse grant directory

5. **My Applications** (`/my-applications`) - Protected Route
   - List of saved applications
   - Status badges: Draft, In Review, Submitted
   - Filters: Grant type, Status, Date
   - Actions: Resume, Duplicate, Delete

6. **Resume Saved Application** (`/my-applications/[applicationId]`)
   - Load application from Firestore
   - Same multi-step form interface
   - Save button → Firestore (replaces LocalStorage)
   - Share button → invite collaborators (Week 4 feature)

**Key Features**:
- User authentication (Firebase)
- Server-side application storage (Firestore)
- Multi-device access
- Collaboration workflow

---

## Route Strategy

### Next.js 15 App Router Groups

**Route Groups** (organize routes without affecting URL):
- `(public)` - Public routes, no auth required
- `(auth)` - Authentication pages (sign-in/sign-up)
- `(protected)` - Protected routes, require authentication

**Benefits**:
- Clean separation of public vs protected routes
- Shared layouts per group
- Easy to add auth guards at group level

### Route Protection Pattern (Phase 2)

**Middleware approach** (recommended for Next.js 15):

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/my-applications')) {
    const authToken = request.cookies.get('authToken');

    if (!authToken) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/my-applications/:path*'],
};
```

**Alternative: Layout-level guards** (simpler for Phase 2 start):

```typescript
// src/app/(protected)/layout.tsx
'use client';

import { useAuth } from '@/auth/useAuth';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      redirect('/signin');
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div>
      <DashboardSidebar />
      <main>{children}</main>
    </div>
  );
}
```

---

## Component Reuse Strategy

### Header Component (Adaptive)

```typescript
// src/components/layout/Header.tsx
'use client';

import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold">
          Grant-Harness
        </Link>

        <nav className="flex items-center gap-4">
          {/* Always visible */}
          <Link href="/applications">Grant Directory</Link>

          {/* Phase 1: No auth buttons */}
          {/* Phase 2: Auth-aware buttons */}
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/my-applications">My Applications</Link>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
```

**Phase 1 behavior**: Auth hooks return null, no auth buttons shown
**Phase 2 behavior**: Auth hooks active, buttons appear based on user state

### Form Component (Dual Mode)

```typescript
// src/components/forms/DynamicForm.tsx
'use client';

import { useAuth } from '@/auth/useAuth';
import { useLocalStorage } from '@/lib/utils/localStorage';
import { saveToFirestore } from '@/lib/firebase/firestore';

export function DynamicForm({ schema, grantId }) {
  const { user } = useAuth();
  const form = useForm({ /* ... */ });

  // Phase 1: LocalStorage only
  // Phase 2: Firestore if authenticated, LocalStorage fallback
  const handleSave = async (data) => {
    if (user) {
      // Phase 2: Save to Firestore
      await saveToFirestore(`applications/${user.uid}/${grantId}`, data);
    } else {
      // Phase 1: Save to LocalStorage
      localStorage.setItem(`application_${grantId}`, JSON.stringify(data));
    }
  };

  return (
    <Form {...form}>
      {/* Form fields */}
      <Button onClick={() => handleSave(form.getValues())}>
        Save & Exit
      </Button>
    </Form>
  );
}
```

---

## Data Flow Architecture

### Phase 1: LocalStorage

```
User fills form
    ↓
Auto-save every 30s → LocalStorage
    ↓
User returns → Check LocalStorage → Restore state
    ↓
Submit (console.log for Phase 1)
```

### Phase 2: Firestore

```
User signs in → Firebase Auth
    ↓
User fills form
    ↓
Save button → Firestore (users/{uid}/applications/{appId})
    ↓
User returns → Fetch from Firestore → Restore state
    ↓
Submit → Update Firestore status: "submitted"
```

### Migration Path (LocalStorage → Firestore)

When user signs up in Phase 2:
1. Check for LocalStorage applications
2. Prompt: "We found draft applications. Import to your account?"
3. If yes: Copy LocalStorage data → Firestore
4. Clear LocalStorage after successful import

---

## Firebase Integration (Phase 2)

### Firebase Configuration

**Required Environment Variables** (`.env.local`):
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Firebase Initialization** (`src/lib/firebase/config.ts`):
```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Firestore Data Structure

```
users/
  {uid}/
    profile/
      name: "John Smith"
      email: "john@emew.com.au"
      company: "EMEW Corporation"
      role: "Grant Manager"

    applications/
      {applicationId}/
        grantId: "igp-commercialisation"
        grantName: "Industry Growth Program"
        status: "draft" | "in-review" | "submitted"
        createdAt: timestamp
        updatedAt: timestamp
        progress: 0.6  # 60% complete

        formData/
          step1_eligibility/
            businessName: "EMEW Corporation"
            abn: "12345678901"
            # ... more fields
          step2_project/
            projectTitle: "Battery Recycling Expansion"
            # ... more fields

        collaborators/
          {collaboratorId}/
            email: "consultant@example.com"
            role: "reviewer"
            invitedAt: timestamp
```

---

## Authentication Flow (Phase 2)

### Sign-Up Flow

1. User visits `/signup`
2. Fills form: Email, Password, Name, Company
3. Click "Sign Up with Email" → Firebase `createUserWithEmailAndPassword()`
4. Create user profile in Firestore: `users/{uid}/profile`
5. Redirect to `/dashboard`

**Alternative: Google Sign-In**:
1. Click "Continue with Google"
2. Firebase `signInWithPopup(googleProvider)`
3. Create user profile in Firestore (if first time)
4. Redirect to `/dashboard`

### Sign-In Flow

1. User visits `/signin`
2. Fills form: Email, Password
3. Click "Sign In" → Firebase `signInWithEmailAndPassword()`
4. Redirect to `/dashboard`

**Forgot Password**:
1. Click "Forgot password?"
2. Enter email → Firebase `sendPasswordResetEmail()`
3. User receives email → clicks link → resets password

---

## Week 2 Implementation Plan (Phase 1 Only)

**Goal**: Deliver Issue #2 scope (replica forms) without authentication, but structure codebase for Phase 2

### Day 8-9: Setup & IGP Form

**Tasks**:
1. ✅ Initialize Next.js 15 project:
   ```bash
   npx create-next-app@latest front/grant-portal --typescript --tailwind --app
   ```

2. ✅ Install Shadcn UI:
   ```bash
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add form input select textarea radio-group checkbox button card separator progress
   ```

3. ✅ Create folder structure (Phase 1 minimal):
   ```
   src/app/(public)/
   src/components/forms/
   src/lib/schemas/
   ```

4. ✅ Implement DynamicForm component (without auth)

5. ✅ Create IGP schema (`lib/schemas/igp-commercialisation.ts`)

6. ✅ Create IGP form page (`app/(public)/applications/igp-commercialisation/page.tsx`)

7. ✅ Add LocalStorage persistence

### Day 10-11: BBI Form

**Tasks**:
1. ✅ Create BBI schema (`lib/schemas/battery-breakthrough.ts`)
2. ✅ Create BBI form page (reuse DynamicForm)
3. ✅ Test multi-step navigation

### Day 12: Testing & Landing Page

**Tasks**:
1. ✅ Create simple landing page (Phase 1):
   - List of available grants (IGP, BBI)
   - Click card → navigate to form
   - No auth buttons yet

2. ✅ Playwright E2E tests

3. ✅ Visual testing (screenshots)

**Phase 1 Deliverables**:
- ✅ Landing page with grant directory
- ✅ IGP form (5-8 steps)
- ✅ BBI form (10-15 steps)
- ✅ LocalStorage save/resume
- ✅ No authentication (public access)
- ✅ Folder structure ready for Phase 2

---

## Phase 2 Implementation Checklist (Week 5+)

When implementing Phase 2, add:

**Week 5: Authentication**:
- [ ] Copy Firebase auth folder from template
- [ ] Adapt to Shadcn UI (replace MUI components)
- [ ] Create sign-in/sign-up pages
- [ ] Add AuthProvider to root layout
- [ ] Test Google Sign-In

**Week 6: Dashboard & Protected Routes**:
- [ ] Create dashboard page
- [ ] Add route protection middleware
- [ ] Build "My Applications" list page
- [ ] Implement Firestore save/load

**Week 7: Collaboration**:
- [ ] Add collaborator invite feature
- [ ] Build review workflow UI
- [ ] Implement comment system

**Week 8: Polish & Export**:
- [ ] PDF export (ADR-1005)
- [ ] Email notifications
- [ ] Application submission to government portals

---

## Design System & Styling

### Shadcn UI Theme

**Government-Appropriate Palette**:
```css
/* tailwind.config.ts */
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#005EA5', /* Australian Government Blue */
        foreground: '#FFFFFF',
      },
      secondary: {
        DEFAULT: '#00A9CE', /* Light Blue */
        foreground: '#FFFFFF',
      },
      success: '#00823B',
      warning: '#F9B000',
      error: '#C80000',
    },
  },
}
```

**Accessibility**:
- WCAG 2.1 AA compliance (minimum)
- High contrast ratios (4.5:1 for text)
- Keyboard navigation support
- Screen reader friendly labels

**Responsive Breakpoints**:
- Mobile: 640px (forms should be usable on phone)
- Tablet: 768px (optimal for form filling)
- Desktop: 1024px+ (primary target)

---

## Testing Strategy

### E2E Tests (Playwright)

**Phase 1 Tests**:
```typescript
// tests/e2e/igp-form.spec.ts
test('IGP form multi-step navigation', async ({ page }) => {
  await page.goto('/applications/igp-commercialisation');

  // Step 1: Fill eligibility
  await page.fill('[name="businessName"]', 'EMEW Corporation');
  await page.fill('[name="abn"]', '12345678901');
  await page.click('text=Next');

  // Step 2: Fill project details
  await page.fill('[name="projectTitle"]', 'Battery Recycling Expansion');
  await page.click('text=Next');

  // Verify LocalStorage save
  const storage = await page.evaluate(() => localStorage.getItem('application_igp-commercialisation'));
  expect(storage).toBeTruthy();
});

test('Resume saved application', async ({ page }) => {
  // Set LocalStorage
  await page.evaluate(() => {
    localStorage.setItem('application_igp-commercialisation', JSON.stringify({
      step1_eligibility: { businessName: 'EMEW' },
    }));
  });

  await page.goto('/applications/igp-commercialisation');

  // Verify resume banner appears
  await expect(page.locator('text=You have a saved application')).toBeVisible();
  await page.click('text=Resume');

  // Verify data restored
  await expect(page.locator('[name="businessName"]')).toHaveValue('EMEW');
});
```

**Phase 2 Tests** (add when implemented):
- Sign-up flow
- Sign-in flow
- Save to Firestore
- Load from Firestore
- Collaborator invite

---

## Success Criteria

### Week 2 (Phase 1)

**Functional**:
- ✅ IGP form renders all steps
- ✅ BBI form renders all steps
- ✅ Multi-step navigation works
- ✅ Validation errors display
- ✅ LocalStorage save/resume works
- ✅ Landing page links to forms

**Non-Functional**:
- ✅ Forms match government portal styling
- ✅ No console errors
- ✅ Responsive design (desktop + tablet)
- ✅ Passes Playwright E2E tests

### Week 5-8 (Phase 2)

**Functional**:
- ✅ User sign-up works (email + Google)
- ✅ User sign-in works
- ✅ Dashboard displays saved applications
- ✅ Applications save to Firestore
- ✅ Applications load from Firestore
- ✅ Multi-device access works

**Non-Functional**:
- ✅ Auth flow is secure
- ✅ Firestore rules protect user data
- ✅ LocalStorage migration works
- ✅ Performance < 3s page load

---

## Risks & Mitigations

**Risk 1**: Firebase template uses MUI, we use Shadcn UI
- **Mitigation**: Auth logic is UI-agnostic. Keep auth operations, rebuild UI with Shadcn.
- **Timeline**: 1-2 days to rebuild sign-in/sign-up pages

**Risk 2**: LocalStorage → Firestore migration complex
- **Mitigation**: Implement simple one-time import flow. Test thoroughly in Week 5.
- **Fallback**: Manual copy-paste if automated migration fails

**Risk 3**: Next.js 15 breaking changes from template
- **Mitigation**: Firebase auth patterns are framework-agnostic. Update to Next.js 15 conventions (async components, server actions).
- **Reference**: https://nextjs.org/docs/app/guides/upgrading/version-15

**Risk 4**: React Hook Form + React 19 server action issues
- **Mitigation**: Use client-side forms only for Phase 1-2. Defer server actions to Phase 3 if needed.

---

## Next Steps

**Immediate (Week 2)**:
1. Initialize Next.js 15 project
2. Install Shadcn UI
3. Create Phase 1 folder structure
4. Implement DynamicForm component
5. Build IGP + BBI forms
6. Test with LocalStorage

**Phase 2 Prep**:
1. Review Firebase template auth code
2. Plan MUI → Shadcn UI conversion
3. Design Firestore data structure
4. Create Phase 2 Epic/Issue

---

**Last Updated**: 2025-11-12
**Status**: Architecture defined, ready for Week 2 implementation
**Template Assessment**: Firebase template suitable with UI library swap
**Recommendation**: Proceed with Phase 1 (public forms), structure codebase for Phase 2 (auth + Firestore)
