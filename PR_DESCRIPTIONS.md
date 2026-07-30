# PR Descriptions

This file contains detailed descriptions for the two PRs addressing issues #112 and #113.

---

## PR #162 — Issue #112: No role indicator on the will detail page

### Problem

`will/[id]/page.tsx` computes `isOwner` internally but never surfaces to the user which role, if any, their connected wallet has with respect to this specific will. A beneficiary, a guardian, or an unrelated visitor currently has to infer their relationship purely from which action buttons happen to appear (or don't), rather than being told directly.

### Solution

Added a small, clear badge near the page title showing the connected wallet's relationship to the will: **Owner**, **Guardian**, **Beneficiary**, or **Viewing as guest**.

### Changes

- **`src/app/will/[id]/page.tsx`**:
  - Added `isBeneficiary` check alongside the existing `isOwner` and `isGuardian` checks
  - Computed a `role` string with priority: Owner > Guardian > Beneficiary > Guest
  - Added a color-coded badge element (`<span>`) immediately after the `<h1>` title with the following styling:
    - **Owner**: emerald green background (`bg-emerald-500/15 text-emerald-300 border-emerald-500/30`)
    - **Guardian**: amber background (`bg-amber-500/15 text-amber-300 border-amber-500/30`)
    - **Beneficiary**: purple/indigo background (`bg-will-purple/20 text-indigo-200 border-will-purple/40`)
    - **Guest**: neutral white background (`bg-white/10 text-will-light/60 border-white/20`)

### Acceptance Criteria

- Role indicator badge is visible near the page title
- All four roles are correctly displayed based on the connected wallet's relationship to the will
- All CI checks pass

closes #112

---

## PR #163 — Issue #113: inherit/[id]'s entitled share only accounts for the first matching beneficiary entry

### Problem

`inherit/[id]/page.tsx` computes `shares.find((s) => s.address === publicKey)` to show "your entitled share". The contract doesn't currently reject duplicate beneficiary addresses within a single will, so if the same address genuinely does appear as two separate beneficiary entries today, `.find()` would silently return only the first matching entry, undercounting the connected user's true total entitled share.

### Solution

Replaced `shares.find()` with `shares.filter().reduce()` to sum all matching entries for the connected address, so the displayed entitled share is correct even if duplicate beneficiary entries exist on a given will.

### Changes

- **`src/app/inherit/[id]/page.tsx`**:
  - Replaced `shares.find((s) => s.address === publicKey)` with `shares.filter((s) => s.address === publicKey).reduce(...)` to sum all matching entries
  - The `reduce` accumulates shares as `BigInt` values and returns the result as a string, preserving the existing data format

- **`tests/unit/InheritPage.test.tsx`** (new file):
  - Added a test covering a will with the same beneficiary address appearing twice
  - Verifies that the displayed entitled share is the sum of all matching entries (30% + 20% = 50% of the balance)

### Acceptance Criteria

- Sum all matching entries for the connected address instead of taking only the first match
- Test covering a will with the same beneficiary address appearing twice
- All CI checks pass

closes #113