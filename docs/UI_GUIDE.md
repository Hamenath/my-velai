# MY VELAI — UI Development & Editing Guide

## 1. Architecture & Design System Overview

MY VELAI uses a centralized design system built around our official brand colors:
- **Primary Yellow:** `#FACC15` (Brand CTA accent, active indicators)
- **Pressed Yellow:** `#EAB308`
- **Primary Black:** `#171717` (High-contrast text, primary dark surfaces)
- **Secondary Text:** `#737373`
- **Main Background:** `#FFFFFF`
- **Secondary Background:** `#F7F7F7`
- **Borders & Dividers:** `#E5E5E5`
- **Status Colors:** Success `#16A34A`, Error `#DC2626`, Warning `#D97706`

> **Design Discipline Rule:**
> Avoid brown, bronze, or random color accents. Surfaces are clean white (`#FFFFFF`) or secondary neutral (`#F7F7F7`), with dark cards (`#171717`), and yellow accents (`#FACC15`) reserved for primary CTAs and active states.

---

## 2. Directory Structure

```
src/
├── constants/
│   ├── colors.ts       <-- Brand colors, radius, typography, spacing, shadows
│   └── theme.ts        <-- Central theme export & layout tokens
├── components/
│   ├── index.ts        <-- Central barrel export for all UI components
│   ├── layout/
│   │   ├── ScreenWrapper.tsx   <-- ScreenContainer (safe-area aware)
│   │   └── SectionHeader.tsx   <-- Consistent section titles & action links
│   ├── ui/
│   │   ├── Button.tsx          <-- PrimaryButton, SecondaryButton, DarkButton
│   │   ├── Card.tsx            <-- StandardCard
│   │   ├── Input.tsx           <-- AppInput
│   │   ├── SearchBar.tsx       <-- SearchBar with clear button
│   │   ├── Header.tsx          <-- AppHeader (location, notifications)
│   │   ├── Badge.tsx           <-- StatusBadge (neutral, yellow, urgent, success)
│   │   ├── LoadingState.tsx    <-- Standardized loading spinner & message
│   │   ├── ConfirmDialog.tsx   <-- Modal dialog for confirmation flows
│   │   ├── MapPreviewCard.tsx  <-- Interactive stylized local map with pins
│   │   └── EmptyState.tsx      <-- Standardized empty state presentation
│   └── cards/
│       ├── JobCard.tsx         <-- Reference-matched job card (Screen 3 & 5)
│       ├── WorkerCard.tsx      <-- Verified worker profile card
│       └── CategoryCard.tsx    <-- Service category tile & horizontal pill
└── app/
    ├── (worker)/               <-- Worker experience (home, earnings/wallet, jobs, profile)
    ├── (customer)/             <-- Customer experience (home, search, bookings, profile)
    └── index.tsx               <-- Animated logo intro & welcome screen
```

---

## 3. UI Editing Conventions

Follow this decision tree for rapid, error-free modifications:

| Scenario | Where to Edit | Guidelines |
| :--- | :--- | :--- |
| **Global color / font / spacing / border change** | `src/constants/colors.ts` & `src/constants/theme.ts` | Never hardcode hex values in screens. Update tokens here. |
| **Shared component change** (e.g. Buttons, Cards, Inputs, Badges) | `src/components/ui/` or `src/components/cards/` | Modifies every screen automatically without duplicating styles. |
| **Screen layout / business logic** | `src/app/(customer)/*` or `src/app/(worker)/*` | Import components from `../../components` barrel. |
| **New Screen or Feature** | `src/app/*` | Reuse `ScreenWrapper`, `Header`, `Button`, `JobCard`, `WorkerCard`. |
| **Bottom Navigation Bar / Safe Area** | `src/app/(worker)/_layout.tsx` or `src/app/(customer)/_layout.tsx` | Uses adaptive safe-area calculation for Android & iOS gestures. |

---

## 4. Primary Screen References

1. **Worker Home** (`src/app/(worker)/home.tsx`):
   - Notice banner ("Bank Account Verification Required" with yellow CTA)
   - Available balance card
   - Quick action tiles (My Zigs, Payouts, Performance)
   - Stylized Map preview card with live Madurai pins
   - Nearby Zigs feed with dark `Apply Now` buttons
2. **Worker Wallet** (`src/app/(worker)/earnings.tsx`):
   - Dark balance card (`#171717`) with `+12.4% this month` trend
   - Verify Bank Account action button
   - 2-Column Available / Pending stats grid
   - Bank Account Details card with Penny Drop modal
   - Recent Transactions empty state
3. **Nearby Zigs / Jobs** (`src/app/(worker)/jobs.tsx`):
   - "Nearby Zigs" header with toggleable "Filters" button
   - Expandable search and category/type filter chips
   - Minimalist job cards with wage and dark CTA
4. **Worker Profile** (`src/app/(worker)/profile.tsx`):
   - Dark wave banner with "Add Banner" action
   - Large overlapping avatar with blue verified checkmark
   - Rating (`★ 5.0`) & Total Jobs (`💼 0`) stats row
   - "PERSONAL & KYC DETAILS" section with APPROVED badge
   - Standardized menu cards and sign out flow
