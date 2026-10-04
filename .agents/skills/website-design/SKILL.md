---
name: website-design
description: Standardized workflow and design system guidelines for designing, building, and refining high-impact, human-centered websites. Use this skill whenever building or editing HTML/CSS layouts, UI components, typography, color palettes, or visual structures for the user's personal website.
---

# Website Design & Development Skill

This skill provides a standardized design system, component guidelines, and implementation workflow for creating and refining the user's personal portfolio website.

---

## 🎨 1. Core Design Philosophy

1. **Human-Centered & Approachable**:
   - Highlight natural, warm human elements (approachable portraits, warm neutral palettes, clean whitespace).
   - Avoid stark, sterile monochrome or overwhelming, cluttered layouts.

2. **Progressive Disclosure**:
   - Keep primary pages (`index.html`) high-level, scannable, and executive-friendly.
   - Do **NOT** overload landing pages with dense technical jargon.
   - Provide clear, inviting "Dive Deeper" entry points so visitors can explore detailed case studies, presentation decks, video walkthroughs, and PDF resumes at their own pace.

3. **Visual Clarity & Typography Hierarchy**:
   - Clear contrast ratios for text readability.
   - Distinct heading hierarchy (`<h1>`, `<h2>`, `<h3>`).
   - Clean spacing using flexbox and grid layouts (`repeat(auto-fit, minmax(300px, 1fr))`).

---

## 🧩 2. Standardized UI Components

### 2.1 Top Navigation Bar
- Positioned at the top right with standard menu items (`HOME`, `MY WORK`, `CONTACT`).
- Includes prominent accent button for `RESUME` (PDF download).

### 2.2 Hero Section
- Clean, focused title and professional subtitle (`Product Manager | IT Business Specialist`).
- Optional background banner image with subtle gradient overlay for contrast.

### 2.3 Executive Feature Cards (Pillars)
- Light background (`#ffffff`), rounded corners (`10px`), subtle drop shadow (`box-shadow: 0 4px 20px rgba(0,0,0,0.04)`).
- Left accent border (`4px solid`) using primary color accents.
- High-level category tag in uppercase, bold title (`20px`), and 1-2 sentence scannable summary.

### 2.4 Case Study Detail Pages
- Breadcrumb navigation (`Home / My Work / Project Name`).
- Key Impact Metrics Grid (3x Revenue Expansion, 30+ Features, etc.).
- Structured bullet points with checkmark icons (`✓`).
- High-resolution hero image or interactive presentation deck slideshow.

---

## 🔄 3. Implementation Workflow

When modifying or designing pages, follow this 4-step workflow:

1. **Plan & Structure**:
   - Ensure new content adheres to progressive disclosure. Keep landing pages concise and route deep-dive details to case study pages.
2. **Component Implementation**:
   - Write clean, semantic HTML5 and vanilla CSS stored in `assets/css/custom.css`.
   - Maintain multi-page linking (`pages/*.html` for inner pages, `../index.html` back to root).
3. **Visual Verification**:
   - Verify layout rendering on the local development studio server (`http://localhost:3001`).
4. **Git Branching & Deployment**:
   - Commit changes to feature branches (`feature/redesign`) before merging into `main`.
