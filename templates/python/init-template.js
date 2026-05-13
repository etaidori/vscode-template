#!/usr/bin/env node

/**
 * Project Template Initializer
 * 
 * Usage:
 *   node init-template.js <target-folder>
 *   node init-template.js <target-folder> --git
 * 
 * Examples:
 *   node init-template.js ../my-new-project
 *   node init-template.js ~/projects/new-project --git
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse arguments
const args = process.argv.slice(2);
const targetPath = args[0];
const initGit = args.includes('--git');

// Validate input
if (!targetPath) {
  console.error('❌ Error: Target folder path required');
  console.log('\nUsage: node init-template.js <target-folder> [--git]');
  console.log('\nExamples:');
  console.log('  node init-template.js ../my-new-project');
  console.log('  node init-template.js ~/projects/new-project --git');
  process.exit(1);
}

// Resolve absolute path
const absoluteTargetPath = path.resolve(targetPath);
const templateDir = path.dirname(__filename);

// Files and folders to copy
const itemsToCopy = [
  '.github',
  '.vscode',
  '.gitignore',
  '.vscodeignore',
  'agents.md',
  'claude.md',
  'template.code-workspace',
];

// Files to exclude from copying
const excludePatterns = [
  'init-template.js',
  'init-template.sh',
  'init-template.ps1',
  'node_modules',
  '.git',
];

/**
 * Recursively copy directory
 */
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);

  files.forEach((file) => {
    if (excludePatterns.includes(file)) return;

    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

/**
 * Copy a single file
 */
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

/**
 * Main initialization
 */
function initialize() {
  console.log('🚀 Project Template Initializer\n');

  // Check if target already exists
  if (fs.existsSync(absoluteTargetPath)) {
    console.warn(
      `⚠️  Warning: Target directory "${absoluteTargetPath}" already exists.`
    );
    console.log('   Files may be overwritten.\n');
  } else {
    console.log(`📁 Creating directory: ${absoluteTargetPath}\n`);
    fs.mkdirSync(absoluteTargetPath, { recursive: true });
  }

  // Copy items
  console.log('📋 Copying template files...');
  itemsToCopy.forEach((item) => {
    const src = path.join(templateDir, item);
    const dest = path.join(absoluteTargetPath, item);

    if (!fs.existsSync(src)) {
      console.log(`   ⏭️  Skipped (not found): ${item}`);
      return;
    }

    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      copyDir(src, dest);
      console.log(`   ✅ ${item}/`);
    } else {
      copyFile(src, dest);
      console.log(`   ✅ ${item}`);
    }
  });

  // Create workspace file if template.code-workspace exists
  const workspaceSource = path.join(templateDir, 'template.code-workspace');
  if (fs.existsSync(workspaceSource)) {
    const projectName = path.basename(absoluteTargetPath);
    const workspaceDest = path.join(absoluteTargetPath, `${projectName}.code-workspace`);
    
    try {
      fs.copyFileSync(workspaceSource, workspaceDest);
      console.log(`   ✅ ${projectName}.code-workspace (renamed)`);
    } catch (err) {
      console.log(`   ❌ Failed to create workspace file: ${err.message}`);
    }
  }

  // Initialize git if requested
  if (initGit) {
    console.log('\n🔧 Initializing git repository...');
    try {
      execSync('git init', { cwd: absoluteTargetPath, stdio: 'pipe' });
      console.log('   ✅ Git repository initialized');
      
      // Create initial commit
      execSync('git add .', { cwd: absoluteTargetPath, stdio: 'pipe' });
      execSync('git commit -m "chore: initialize project from template"', {
        cwd: absoluteTargetPath,
        stdio: 'pipe',
      });
      console.log('   ✅ Initial commit created');
    } catch (err) {
      console.log(`   ⚠️  Git initialization skipped: ${err.message}`);
    }
  }

  // Success message
  console.log('\n✨ Template initialization complete!\n');
  console.log(`📂 Project location: ${absoluteTargetPath}\n`);
  console.log('Next steps:');
  console.log(`  1. cd "${absoluteTargetPath}"`);
  console.log(`  2. code ${path.basename(absoluteTargetPath)}.code-workspace`);
  if (!initGit) {
    console.log('  3. git init (or use: node init-template.js <folder> --git)\n');
  }
}

// Run initialization
try {
  initialize();
} catch (err) {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
}
