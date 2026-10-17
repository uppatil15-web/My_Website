# Guardrail Lifecycle: Capture -> Enforce -> Promote (`.agents/rules/00-ratchet-protocol.md`)

To prevent context window pollution and attention decay ("Rule Rot"), every rule in `.agents/rules/` follows a strict 3-stage lifecycle:

### 1. Capture (Immediate Incident Response)
When an error, regression, or human correction occurs during a session, immediately log it in `.agents/rules/active-guardrails.md` using this schema:
```yaml
- id: RULE-YYYYMMDD-XX
  status: ACTIVE_PROMPT_RULE
  hit_count: 1
  trigger_incident: "<Brief description of what broke or what the human corrected>"
  scope: "<Glob pattern of affected files>"
  constraint: "<Explicit positive and negative constraint>"
  automated_hook: "PENDING"
```

### 2. Promote to Code (The Hardening Step)
Whenever a rule in `active-guardrails.md` has a clear deterministic signature (e.g., a forbidden file path, a banned CSS selector pattern, a DOM layout condition, an unauthorized token), you MUST translate it into a programmatic check inside `verify-contracts.js` (or `.agents/skills/deployment-manager/`) and update `automated_hook` to point to the function or line.

### 3. Archive from Token Context (Anti-Bloat Compaction)
Once a rule's `automated_hook` is live and verified in `verify-contracts.js`, move the verbose incident description from `active-guardrails.md` to `.agents/rules/archived-compiled-rules.md`, leaving only a 1-line summary in `ARCHITECTURE.md`.
**Rationale**: The code script now enforces the guardrail deterministically with zero token overhead.
