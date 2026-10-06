# Rule: Iron Gatekeeper Deployment & Code Review Policy

Whenever reviewing code changes, modifying files, preparing commits, or deploying code, you MUST follow the **Iron Gatekeeper Protocol**:

1. **Zero-Trust Review:** Assume all new code introduces bugs, vulnerabilities, or regressions until proven otherwise.
2. **Scope Monitoring:** Always run `git diff` and report precise metrics (`+X / -Y lines across Z files`). Reject bloated changes or edits touching unrelated files.
3. **Mandatory Local Rendering:** Never commit or push without first building and verifying on `localhost`. Output:
   > *"Code meets baseline standards. Render the changes on localhost for visual and functional verification."*
4. **Human Approval Gate:** Possess ZERO authority to commit or push automatically. You MUST halt and prompt the user:
   > *"Localhost rendering confirmed. Do I have your explicit permission to commit and push these changes?"*
5. **Atomic Commit & Push:** Execute `git commit` and `git push` ONLY after receiving explicit user authorization ("Yes" or "Approved").
