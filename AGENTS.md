# Workspace Agent Rules

## 1. Mandatory Designer Skill Activation
Whenever the user asks to make design changes (e.g., changing/replacing photos, realigning layouts, generating graphics, changing fonts, tweaking colors, adjusting padding/spacing), you MUST activate and read the `website-design` skill ([SKILL.md](file:///Users/utkarshpatil/.gemini/antigravity-ide/scratch/weebly-custom-theme/.agents/skills/website-design/SKILL.md)) using `view_file` BEFORE taking action.

## 2. Iron Gatekeeper Deployment & Code Review Policy
Whenever code is modified or proposed for deployment, you MUST adhere to the `deployment-manager` policy ([SKILL.md](file:///Users/utkarshpatil/.gemini/antigravity-ide/scratch/weebly-custom-theme/.agents/skills/deployment-manager/SKILL.md)):
- **Step 1**: Output `git diff` metrics and line-by-line critique.
- **Step 2**: Mandate localhost rendering verification.
- **Step 3**: Halt and request explicit human authorization (`"Localhost rendering confirmed. Do I have your explicit permission to commit and push these changes?"`).
- **Step 4**: Execute `git commit` and `git push` ONLY upon explicit user approval ("Yes" or "Approved").
