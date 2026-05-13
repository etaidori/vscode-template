import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Define your template types and their files
const commonFiles = [
  '.gitignore',
  '.vscode/extensions.json',
  '.vscode/launch.json',
  '.vscode/settings.json',
  '.vscode/style.css',
  '.vscode/tasks.json',
  '.vscodeignore',
  'agents.md',
  'claude.md',
  'init-template.js',
  'init-template.ps1',
  'init-template.sh',
  'README.md',
  'template.code-workspace',
  'tsconfig.json'
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
  });
  context.subscriptions.push(disposable);
}

export function deactivate() {}
