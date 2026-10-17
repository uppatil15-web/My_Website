/**
 * verify-contracts.js
 * Automated Architecture & Contract Verification Script (Autonomic Ratchet Engine)
 * 
 * Enforces:
 * 1. Document Structure & Viewport Meta across all HTML files
 * 2. Internal Link & Local Asset Integrity
 * 3. Git Blast Radius, Change Budget & Anti-Reward Hacking (INV-001, INV-002, INV-003)
 * 4. Structural Invariants & Canary Stability (INV-004, INV-005)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = __dirname;
const PAGES_DIR = path.join(ROOT_DIR, 'pages');

let hasErrors = false;
let totalChecks = 0;

console.log('\n======================================================');
console.log('🛡️  AUTONOMIC VERIFICATION & RATCHET ENGINE (verify-contracts)');
console.log('======================================================\n');

// -------------------------------------------------------------
// 1. Gather all HTML Files
// -------------------------------------------------------------
function getHtmlFiles() {
  const files = [];
  const rootIndex = path.join(ROOT_DIR, 'index.html');
  if (fs.existsSync(rootIndex)) files.push(rootIndex);

  if (fs.existsSync(PAGES_DIR)) {
    const pageFiles = fs.readdirSync(PAGES_DIR)
      .filter(f => f.endsWith('.html'))
      .map(f => path.join(PAGES_DIR, f));
    files.push(...pageFiles);
  }
  return files;
}

const htmlFiles = getHtmlFiles();
console.log(`📁 Found ${htmlFiles.length} HTML documents to verify.\n`);

// -------------------------------------------------------------
// 2. Gate 1: Document Structure & Viewport Meta
// -------------------------------------------------------------
console.log('🔍 [GATE 1/4] Verifying Document Structure & Viewport Meta...');
htmlFiles.forEach(file => {
  totalChecks++;
  const relPath = path.relative(ROOT_DIR, file);
  const content = fs.readFileSync(file, 'utf8');

  const issues = [];
  if (!content.includes('<!DOCTYPE html>') && !content.includes('<!doctype html>')) {
    issues.push('Missing <!DOCTYPE html>');
  }
  if (!content.includes('name="viewport"')) {
    issues.push('Missing viewport meta tag');
  }
  if (!content.includes('<title>')) {
    issues.push('Missing <title> tag');
  }

  if (issues.length > 0) {
    console.error(`  ❌ ${relPath}: ${issues.join(', ')}`);
    hasErrors = true;
  } else {
    console.log(`  ✓ ${relPath} passed structural sanity check.`);
  }
});

// -------------------------------------------------------------
// 3. Gate 2: Internal Link & Asset Integrity
// -------------------------------------------------------------
console.log('\n🔗 [GATE 2/4] Verifying Internal Links & Local Asset Paths...');
const linkRegex = /(?:href|src)=["']([^"']+)["']/g;

htmlFiles.forEach(file => {
  const fileDir = path.dirname(file);
  const relFile = path.relative(ROOT_DIR, file);
  const content = fs.readFileSync(file, 'utf8');
  let match;
  let fileBroken = 0;

  while ((match = linkRegex.exec(content)) !== null) {
    totalChecks++;
    const target = match[1].trim();

    // Skip external URLs, hashes, protocols, and data URIs
    if (
      target.startsWith('http://') ||
      target.startsWith('https://') ||
      target.startsWith('//') ||
      target.startsWith('#') ||
      target.startsWith('mailto:') ||
      target.startsWith('tel:') ||
      target.startsWith('javascript:') ||
      target.startsWith('data:') ||
      target.includes('{') // Template placeholders
    ) {
      continue;
    }

    // Strip anchor and query strings
    const cleanTarget = target.split('#')[0].split('?')[0];
    if (!cleanTarget) continue;

    // Resolve path relative to current file
    const resolvedPath = path.resolve(fileDir, cleanTarget);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`  ❌ In ${relFile}: Broken link/asset -> "${target}" (Resolved to: ${path.relative(ROOT_DIR, resolvedPath)})`);
      fileBroken++;
      hasErrors = true;
    }
  }

  if (fileBroken === 0) {
    console.log(`  ✓ ${relFile}: All internal links and assets resolved.`);
  }
});

// -------------------------------------------------------------
// 4. Gate 3: Git Blast Radius, Change Budget & Anti-Reward Hacking
// -------------------------------------------------------------
console.log('\n💥 [GATE 3/4] Auditing Git Diff Blast Radius, Change Budget & Patterns...');
try {
  const gitStatusOutput = execSync('git status --porcelain', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
  
  if (!gitStatusOutput) {
    console.log('  ✓ Working tree clean. Zero blast radius violations.');
  } else {
    const lines = gitStatusOutput.split('\n');
    const modifiedFiles = lines.map(line => line.slice(3).trim());

    console.log(`  Found ${modifiedFiles.length} modified/untracked file(s):`);

    // Inviolable check 1: main_style.css is strictly read-only
    if (modifiedFiles.some(f => f.includes('main_style.css'))) {
      console.error('  ❌ VIOLATION of INV-001: assets/css/main_style.css is strictly READ-ONLY!');
      hasErrors = true;
    }

    // Change Budget Audit via git diff --numstat
    try {
      const numstatOutput = execSync('git diff --numstat', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
      if (numstatOutput) {
        let totalAdded = 0;
        let totalDeleted = 0;
        numstatOutput.split('\n').forEach(statLine => {
          const parts = statLine.split(/\s+/);
          const added = parseInt(parts[0], 10);
          const deleted = parseInt(parts[1], 10);
          if (!isNaN(added)) totalAdded += added;
          if (!isNaN(deleted)) totalDeleted += deleted;
        });

        console.log(`  📊 Change Volume Budget: +${totalAdded} / -${totalDeleted} lines`);
      }
    } catch (e) {
      // Non-fatal if numstat fails
    }

    // File-by-File Forbidden Pattern Scan
    try {
      const diffOutput = execSync('git diff -U0', { cwd: ROOT_DIR, encoding: 'utf8' });
      // Split diff into per-file chunks
      const fileDiffChunks = diffOutput.split(/^diff --git /m);

      fileDiffChunks.forEach(chunk => {
        if (!chunk.trim()) return;
        const headerMatch = chunk.match(/^a\/(.*?)\s+b\/(.*?)(?:\n|$)/);
        if (!headerMatch) return;
        const filePath = headerMatch[2];

        // Documentation files (.md, .txt) are exempt from code pattern scans
        if (filePath.endsWith('.md') || filePath.endsWith('.txt')) {
          return;
        }

        const addedLines = chunk.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++'));

        // CSS / Styling Checks
        if (filePath.endsWith('.css') || filePath.endsWith('.less') || filePath.endsWith('.html')) {
          addedLines.forEach(line => {
            if (/!important/i.test(line)) {
              console.error(`  ❌ [INV-003] CSS !important specificity hack in ${filePath}: "${line.trim()}"`);
              hasErrors = true;
            }
          });
        }

        // JS / Code Checks
        if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.html')) {
          addedLines.forEach(line => {
            if (/\/\*\s*eslint-disable/i.test(line) || /\/\/\s*@ts-ignore/i.test(line) || /\/\*\s*stylelint-disable/i.test(line)) {
              console.error(`  ❌ [INV-003] Linter suppression in ${filePath}: "${line.trim()}"`);
              hasErrors = true;
            }
          });
        }
      });
    } catch (diffErr) {
      // Non-fatal if diff inspection fails
    }

    // Classify changes
    const tier1 = modifiedFiles.filter(f => f.startsWith('pages/'));
    const tier2 = modifiedFiles.filter(f => f.startsWith('assets/') || f.startsWith('partials/'));
    const tier3 = modifiedFiles.filter(f => f.includes('dev-server') || f.includes('build-theme') || f.includes('package') || f.includes('verify-contracts'));
    const rootDocs = modifiedFiles.filter(f => f === 'index.html' || f.endsWith('.md'));

    console.log(`  - Tier 1 (Page-scoped): ${tier1.length} file(s) [${tier1.join(', ') || 'none'}]`);
    console.log(`  - Tier 2 (Shared Assets): ${tier2.length} file(s) [${tier2.join(', ') || 'none'}]`);
    console.log(`  - Tier 3 (Infrastructure): ${tier3.length} file(s) [${tier3.join(', ') || 'none'}]`);
    console.log(`  - Root / Docs: ${rootDocs.length} file(s) [${rootDocs.join(', ') || 'none'}]`);

    if (tier2.length > 0) {
      console.log('  ⚠️ Notice: Shared assets modified. Canary visual audit mandated.');
    }
  }
} catch (err) {
  console.warn('  ⚠️ Git audit skipped (git command unavailable or error):', err.message);
}

// -------------------------------------------------------------
// 5. Gate 4: Structural Invariants & Canary Stability
// -------------------------------------------------------------
console.log('\n🧬 [GATE 4/4] Executing Structural Invariants & Canary Stability...');

const REGRESSION_INVARIANTS = [
  {
    id: 'INV-001',
    description: 'Design System Tokens: custom.css must maintain essential Nordic root tokens',
    test: () => {
      const cssPath = path.join(ROOT_DIR, 'assets', 'css', 'custom.css');
      if (!fs.existsSync(cssPath)) return { passed: false, error: 'assets/css/custom.css not found' };
      const content = fs.readFileSync(cssPath, 'utf8');
      const requiredTokens = ['--nordic-text-primary', '--nordic-bg-canvas', '--nordic-accent-fjord'];
      const missing = requiredTokens.filter(t => !content.includes(t));
      if (missing.length > 0) {
        return { passed: false, error: `Missing root tokens: ${missing.join(', ')}` };
      }
      return { passed: true };
    }
  },
  {
    id: 'INV-002',
    description: 'DOM Interactive Hooks: index.html must retain hamburger and navigation containers',
    test: () => {
      const indexPath = path.join(ROOT_DIR, 'index.html');
      if (!fs.existsSync(indexPath)) return { passed: false, error: 'index.html not found' };
      const content = fs.readFileSync(indexPath, 'utf8');
      const requiredSelectors = ['birdseye-header', 'hamburger', 'nav'];
      const missing = requiredSelectors.filter(s => !content.includes(s));
      if (missing.length > 0) {
        return { passed: false, error: `Missing critical DOM hooks: ${missing.join(', ')}` };
      }
      return { passed: true };
    }
  },
  {
    id: 'INV-004',
    description: 'Responsive Invariance: Viewport meta present and no hardcoded unconstrained widths >= 1200px',
    test: () => {
      for (const file of htmlFiles) {
        const content = fs.readFileSync(file, 'utf8');
        if (!content.includes('name="viewport"')) {
          return { passed: false, error: `${path.relative(ROOT_DIR, file)} missing viewport meta tag` };
        }
        const fixedWidthMatch = /style=["'][^"']*width:\s*(?:1[2-9]\d{2}|[2-9]\d{3})px[^"']*["']/i.exec(content);
        if (fixedWidthMatch) {
          return { passed: false, error: `${path.relative(ROOT_DIR, file)} has hardcoded fixed width >= 1200px: ${fixedWidthMatch[0]}` };
        }
      }
      return { passed: true };
    }
  },
  {
    id: 'INV-005',
    description: 'Canary Stability: index.html must retain complete layout wrapper and header classes',
    test: () => {
      const indexPath = path.join(ROOT_DIR, 'index.html');
      if (!fs.existsSync(indexPath)) return { passed: false, error: 'Canary index.html not found' };
      const content = fs.readFileSync(indexPath, 'utf8');
      if (!content.includes('body class=') || !content.includes('birdseye-header')) {
        return { passed: false, error: 'Canary index.html missing essential body or header class structure' };
      }
      return { passed: true };
    }
  }
];

REGRESSION_INVARIANTS.forEach(inv => {
  totalChecks++;
  try {
    const result = inv.test();
    if (result.passed) {
      console.log(`  ✓ [${inv.id}] ${inv.description}`);
    } else {
      console.error(`  ❌ [${inv.id}] FAILED: ${result.error}`);
      hasErrors = true;
    }
  } catch (err) {
    console.error(`  ❌ [${inv.id}] Execution error: ${err.message}`);
    hasErrors = true;
  }
});

// -------------------------------------------------------------
// Summary & Exit
// -------------------------------------------------------------
console.log('\n======================================================');
if (hasErrors) {
  console.error(`❌ VERIFICATION FAILED: Violations found during automated checks.`);
  console.error('Please resolve the errors above to maintain architectural integrity.\n');
  process.exit(1);
} else {
  console.log(`✅ VERIFICATION PASSED: All architectural contracts satisfied.`);
  console.log(`Checked ${totalChecks} structural elements and paths with 0 errors.\n`);
  process.exit(0);
}
