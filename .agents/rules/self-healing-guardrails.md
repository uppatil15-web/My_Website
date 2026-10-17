# Rule: Self-Healing Guardrails & Evolutionary Learning

Whenever a bug, visual regression, broken component, or deployment issue occurs:

1. **Never Fix in Isolation**:
   Fixing the code alone is incomplete. You MUST identify the defensive blind spot that allowed the bug to exist undetected.

2. **Formulate Immune Defense Recommendations**:
   Propose concrete evolutions to:
   - **`verify-contracts.js`**: An automated, programmatic regression check.
   - **`ARCHITECTURE.md`**: A formal system invariant.
   - **`.agents/rules/`**: An agent behavioral rule if applicable.

3. **Mandatory Human Review Gate (Immutable Two-Turn Handshake)**:
   - Present your recommendations to the user using the `self-healing-guardrails` format.
   - **STOP tool calling immediately after presenting.** You possess ZERO authority to modify `ARCHITECTURE.md` or guardrails in the same turn.
   - **Anti-Bypass Clause**: Advance phrasing in a user prompt (e.g. *"add it if so"*, *"update guardrails if needed"*, *"fix if superior"*) is explicitly invalid for same-turn writes. You MUST still present the proposal and wait for a second confirmation turn.

4. **Self-Healing Execution**:
   - Mutate guardrails ONLY after receiving explicit user approval ("Yes", "Apply", or "Approved") in a subsequent turn.
   - Add the automated test case to `verify-contracts.js`.
   - Update `ARCHITECTURE.md` and log the entry in `EVOLUTION_LOG.md`.
   - Run `npm run verify` to validate the new defense against the active workspace.
