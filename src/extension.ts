import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Define your template types and their files
const commonFiles = [
  '.gitignore',
  '.vscode/extensions.json',
  '.vscode/settings.json',
  '.vscode/style.css',
  'agents.md',
  'claude.md',
  'README.md',
  'template.code-workspace',
  'assets/.gitkeep'
];

const templates: Record<string, string[]> = {
  'node-js': [
    ...commonFiles,
    'package.json',
    'src/index.js'
  ],
  'python': [
    ...commonFiles,
    'requirements.txt',
    'src/main.py'
  ],
  'web': [
    ...commonFiles,
    'index.html',
    'src/app.js',
    'src/style.css'
  ],
  'documentation': [
    '.gitignore',
    'README.md',
    'template.code-workspace',
    'assets/.gitkeep'
  ],
  'vscode-extension': [
    '.gitignore',
    '.vscode/extensions.json',
    '.vscode/settings.json',
    '.vscode/style.css',
    '.vscodeignore',
    'agents.md',
    'claude.md',
    'package.json',
    'package/package.json',
    'README.md',
    'tsconfig.json',
    'src/extension.ts',
    'template.code-workspace',
    'assets/.gitkeep'
  ]
};

function copyTemplateFiles(templateType: string, targetDir: string, extensionPath: string) {
  const files: string[] | undefined = templates[templateType];
  if (!files) return;
  const projectName = path.basename(targetDir);
  
  files.forEach((file: string) => {
    const src = path.join(extensionPath, 'templates', templateType.toLowerCase().replace('.', '-'), file);
    let destFile = file;
    
    // Rename README.md to {projectName}-readme.md
    if (file === 'README.md') {
      destFile = `${projectName}-readme.md`;
    }
    
    // Rename template.code-workspace to {projectName}.code-workspace
    if (file === 'template.code-workspace') {
      destFile = `${projectName}.code-workspace`;
    }
    
    const dest = path.join(targetDir, destFile);
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  });
}

async function initializeGit(targetDir: string): Promise<void> {
  const { execSync } = require('child_process');
  try {
    execSync('git init', { cwd: targetDir });
    execSync('git add .', { cwd: targetDir });
    execSync('git commit -m "chore: initialize project from template"', { cwd: targetDir });
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to initialize git repository: ${error}`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('projectTemplateGenerator.createProject', async (uri: vscode.Uri) => {
    const templateType = await vscode.window.showQuickPick(Object.keys(templates), {
      placeHolder: 'Select a project template type'
    });
    if (!templateType) {
      vscode.window.showWarningMessage('No template type selected.');
      return;
    }
    let targetDir = uri?.fsPath || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!targetDir) {
      vscode.window.showErrorMessage('No target directory found.');
      return;
    }
    copyTemplateFiles(templateType, targetDir, context.extensionPath);
    vscode.window.showInformationMessage(`Project created using ${templateType} template.`);
    
    // Ask if user wants to initialize git
    const initGit = await vscode.window.showQuickPick(['Yes', 'No'], {
      placeHolder: 'Initialize Git repository?'
    });
    if (initGit === 'Yes') {
      await initializeGit(targetDir);
      vscode.window.showInformationMessage('Git repository initialized with initial commit.');
    }
  });
  context.subscriptions.push(disposable);
}

export function deactivate() {}
