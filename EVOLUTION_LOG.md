# Guardrail Evolution & Incident Post-Mortem Log

> **Immune System Memory**:  
> Every defect that bypasses automated checks or human review is an opportunity to strengthen our defense perimeter.  
> This log records each historical defect, its root cause, and the resulting architectural invariants, automated regression checks, and agent rules that were added to guarantee it never recurs.

---

## Evolution History

| Incident ID | Date | Category | Defect Summary | Root Cause | Defense Added | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **INC-000** | 2026-10-16 | Architecture | Architectural Amnesia & Scope Creep | LLM unconstrained by contracts can mutate shared styles | Created `ARCHITECTURE.md`, `verify-contracts.js`, Iron Gatekeeper Blast Radius Gate | Active |
| **INC-001** | 2026-10-16 | Governance | Guardrail Gate Bypass via Prompt Phrasing | Prompt phrasing ("add if so") caused agent to collapse two-turn handshake | Enacted `INV-000`, Immutable Two-Turn Gate & Anti-Bypass Clause in `AGENTS.md` and rules | Active |
| **INC-002** | 2026-10-17 | Systems Safety | Autonomic Verification & Ratchet Engine Upgrade | Conversational rule decay and lack of anti-reward-hacking checks | Installed 3-stage rule ratchet (`00-ratchet-protocol.md`), anti-reward-hacking (`INV-003`), canary stability (`INV-005`), and diff scanner in `verify-contracts.js` | Active |

---

## Incident Entry Template

When resolving an issue under the `self-healing-guardrails` skill:

```markdown
### [INC-XXX] - YYYY-MM-DD: <Incident Title>

- **Defect Description**: What visually or functionally broke?
- **Root Cause**: Why did the code break (e.g., global CSS selector clash, unclosed tag, missing route)?
- **Defensive Blind Spot**: Why did `verify-contracts.js` or `deployment-manager` miss it?
- **Mutated Guardrails**:
  - `ARCHITECTURE.md`: Added Invariant X.
  - `verify-contracts.js`: Added Regression Invariant `INV-XXX`.
  - `.agents/rules/`: Added rule X.
- **Verification**: `npm run verify` passed with newly added test.
```

---

### [INC-002] - 2026-10-17: Autonomic Verification & Ratchet Engine Upgrade

- **Defect Description**: Prompt rule decay across long context trajectories and vulnerability to AI reward hacking (e.g., using `!important` to force specificity, adding `eslint-disable`, or skipping tests).
- **Root Cause**: Reliance on prose rules in `.agents/rules/` without an automated mechanism to compile them into executable assertions and archive them from LLM prompt context.
- **Defensive Blind Spot**: `verify-contracts.js` only checked basic HTML and static tokens; it did not inspect git diffs for forbidden code patterns or canary regressions.
- **Mutated Guardrails**:
  - `AGENTS.md`: Upgraded to Principal Self-Amending Autonomous Engineering Agent with 5 Kernel Invariants (including `INV-000` Two-Turn Handshake and Anti-Reward Hacking).
  - `ARCHITECTURE.md`: Converted to machine-parsable table with protected paths, canary stability (`INV-005`), and token override (`[ALLOW_GLOBAL_EDIT]`).
  - `.agents/rules/00-ratchet-protocol.md`: Created 3-stage rule gradation lifecycle (Capture -> Promote -> Archive).
  - `.agents/rules/active-guardrails.md`: Created active staging ledger seeded with `RULE-20261016-01` and `RULE-20261016-02`.
  - `verify-contracts.js`: Upgraded to scan git diff chunks for forbidden `!important` and linter suppressions, track change volume budgets, and check canary DOM integrity.
- **Verification**: `npm run verify` passed checking 335 structural elements and paths with 0 errors.

