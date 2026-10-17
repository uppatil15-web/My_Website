# SYSTEM ARCHITECTURE & LIVING CONTRACTS (`ARCHITECTURE.md`)

> **IMMUTABLE DIRECTIVE:**  
> This file is the single source of truth for repository blast-radius boundaries and structural invariants. Both the AI Agent and automated pre-deployment verification scripts parse this file. Agents may APPEND new invariants or tighten scopes during Stage 4 Ratchet updates, but may **NEVER** delete or loosen existing rules without explicit human authorization.
> 
> A prompt that fulfills an immediate user request but violates these architectural boundaries or mutates forbidden files is a **failing solution**.

---

## 1. Protected Global Files (Read-Only by Default)
Modification of any file in this list during a feature, bug-fix, or page-specific task will cause pre-deployment verification (`verify-contracts.js`) to automatically fail unless the user prompt explicitly includes the token `[ALLOW_GLOBAL_EDIT]`.

- `index.html` (Except when task explicitly targets the homepage)
- `main_style.css` (Strictly read-only legacy code)
- `assets/css/custom.css`
- `assets/css/global.css`
- `assets/js/theme-app.js`
- `dev-server.js`

---

## 2. Structural & Styling Invariants

| ID | Domain | Invariant Rule | Automated Gate Enforcement |
| :--- | :--- | :--- | :--- |
| **INV-000** | Governance | Immutable Two-Turn Handshake for guardrail/architectural mutations. No same-turn writes. | Agent Kernel Enforcement |
| **INV-001** | CSS Scoping | Page-specific edits in `pages/<slug>.html` must use scoped classes prefixed with `.<slug>__` or isolated page stylesheets. | `verify-contracts.js` diff regex scan |
| **INV-002** | Global Classes | Shared classes (`.btn`, `.container`, `.nav`, `.card`, `.wsite-button`, `.birdseye-header`) are immutable during localized tasks. | `verify-contracts.js` forbidden selector hook |
| **INV-003** | Anti-Reward Hacking | Zero linter suppressions (`eslint-disable`, `@ts-ignore`), zero `!important` specificity hacks, zero skipped checks. | `verify-contracts.js` forbidden token scan |
| **INV-004** | Responsive Geometry | Zero horizontal scroll (`scrollWidth <= clientWidth`) across $375\text{px}$, $768\text{px}$, and $1440\text{px}$. | `verify-contracts.js` DOM/CSS constraint check |
| **INV-005** | Canary Stability | Subpage edits must cause zero broken structural hooks or style shifts on Canary `index.html`. | `verify-contracts.js` Canary DOM integrity check |
| **INV-006** | Link Integrity | Internal routes and assets must resolve to valid on-disk files. | `verify-contracts.js` path resolution check |

---

## 3. Blast Radius Matrix

Before writing any code, the agent MUST declare an upfront **Blast Radius Lock** adhering to this matrix:

| Task Category | Allowed Target Scope | Strictly Forbidden Scope |
| :--- | :--- | :--- |
| **Single Page Copy / UI Update** (e.g. Optym or Tesla case study) | `pages/<target-page>.html`, page-scoped CSS classes in `assets/css/custom.css` or dedicated page CSS, isolated page assets | `index.html`, unrelated `pages/*.html`, global nav/footer partials, unscoped selectors in `custom.css`, `theme-app.js` |
| **Homepage Redesign / Section Edit** | `index.html`, scoped `.home-*` styles in `assets/css/custom.css`, homepage image assets | `pages/*.html`, global utility classes, `main_style.css`, server infrastructure |
| **Theme / Design System Token Evolution** | `:root` custom properties in `assets/css/custom.css` (Requires `[ALLOW_GLOBAL_EDIT]`) | `main_style.css` (Strictly Read-Only). Mandates canary visual audit across homepage and subpages. |
| **Interactive Feature / Script Update** | `assets/js/theme-app.js`, affected HTML hook attributes | Altering existing click listeners without backward-compatibility audit |
| **Infrastructure / Build Script** | `dev-server.js`, `build-theme.js`, `package.json`, `verify-contracts.js` | Application page content, theme styling |
| **Bug Fix / Hotfix** | The exact file(s) implicated in the root-cause trace | Unrelated refactoring, formatting outside target hunk |

### Auto-Reject Trigger:
If ANY file outside the declared `Allowed Target Scope` appears in `git status` or `git diff`, the agent must immediately execute:
```bash
git checkout -- <unauthorized_file>
```
and refactor using isolated scoping.

---

## 4. Module & Page Boundary Map
- **`pages/*`**: Fully isolated presentation views. May consume global tokens (`var(--*)`) read-only, but may never mutate `:root` variables or shared stylesheet rules.
- **`.agents/skills/deployment-manager`**: Owns pre-flight diff analysis, strict linter checks, localhost rendering verification, and git push gating.
- **`.agents/skills/website-design`**: Owns UI/UX layout patterns, Nordic design tokens, typography scales, and scoped CSS architecture rules.
- **`.agents/skills/self-healing-guardrails`**: Owns post-defect root-cause diagnosis, 3-tier guardrail promotion, and incident post-mortems.

---

## 5. Verification Protocol Before Any Commit
Before requesting approval to commit:
1. **Deterministic Verification**: Run `npm run verify` (`node verify-contracts.js`) to validate HTML structure, internal link integrity, git blast radius, forbidden patterns (`!important`, linter suppressions), and canary invariants.
2. **Local Rendering Verification**: Start `npm run dev` and confirm rendering on `http://localhost:3000` (or `3001`).
3. **The Human Gate**: Halt tool execution and request explicit authorization per the Iron Gatekeeper Protocol.

---

## 6. Evolutionary Ratchet Log
- **2026-10-16 [INC-000]**: Established baseline system invariants (`INV-001` through `INV-004`) and Blast Radius Matrix to eliminate LLM architectural amnesia.
- **2026-10-16 [INC-001]**: Enacted `INV-000` (Immutable Two-Turn Gate & Anti-Bypass Clause) in `AGENTS.md` and rules to stop advance-permission prompt leaks.
- **2026-10-16 [INC-002]**: Installed Autonomic Verification & Ratchet Engine (`INV-000` through `INV-006`) with anti-reward-hacking, canary stability, and 3-stage rule gradation.
