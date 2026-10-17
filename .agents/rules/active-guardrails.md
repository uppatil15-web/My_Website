# Active Guardrail Staging Ledger (`.agents/rules/active-guardrails.md`)

This file tracks newly captured rules, edge cases, and human feedback. Per `.agents/rules/00-ratchet-protocol.md`, rules here must be promoted into code checks in `verify-contracts.js` and subsequently archived to avoid token bloat.

```yaml
- id: RULE-20261016-01
  status: ACTIVE_PROMPT_RULE
  hit_count: 1
  trigger_incident: "Unscoped style modification to global .btn or shared selectors in custom.css during single-page tasks risks visual regression across unrelated pages."
  scope: "pages/*.html, assets/css/**/*.css"
  constraint: "Never edit shared global classes (.btn, .container, .card, .nav) for localized page changes. Always use a page-scoped modifier or stylesheet."
  automated_hook: "verify-contracts.js:CHECK_FORBIDDEN_PATTERNS"

- id: RULE-20261016-02
  status: ACTIVE_PROMPT_RULE
  hit_count: 1
  trigger_incident: "Advance prompt phrasing ('add it if so') caused agent to collapse two-turn handshake and mutate guardrails without human review."
  scope: "ARCHITECTURE.md, .agents/**"
  constraint: "Mandatory two-turn handshake on all architecture/guardrail mutations. Advance prompt permission is strictly invalid."
  automated_hook: "AGENTS.md:KERNEL_INVARIANT_5"
```
