import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Define your template types and their files
const commonFiles = [
  '.gitignore',
  '.vscodeignore',
  '.vscode/extensions.json',
  '.vscode/settings.json',
  '.vscode/style.css',
  'agents.md',
  'claude.md',
  'README.md',
  'template.code-workspace'
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
    '.vscodeignore',
    '.vscode/extensions.json',
    '.vscode/settings.json',
    '.vscode/style.css',
    '.github/copilot-instructions.md',
    'agents.md',
    'claude.md',
    'README.md',
    'template.code-workspace'
  ],
  'vscode-extension': [
    '.gitignore',
    '.vscode/extensions.json',
    '.vscode/settings.json',
    '.vscode/style.css',
    'agents.md',
    'claude.md',
    'package.json',
    'package/package.json',
    'README.md',
    'tsconfig.json',
    'src/extension.ts',
    'template.code-workspace'
  ]
};

type TemplateMetadata = {
  templateType: string;
  templateVersion: string;
  extensionVersionGeneratedBy: string;
  generatedAt: string;
  fileManifestVersion: number;
};

function getTargetDir(uri: vscode.Uri | undefined): string | undefined {
  return uri?.fsPath || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

function getTemplateMetadataPath(targetDir: string): string {
  return path.join(targetDir, '.template-meta.json');
}

function copyTemplateFiles(templateType: string, targetDir: string, extensionPath: string) {
  const files: string[] | undefined = templates[templateType];
  if (!files) return;
  const projectName = path.basename(targetDir).toLowerCase();
  
  files.forEach((file: string) => {
    const src = path.join(extensionPath, 'templates', templateType.toLowerCase().replace('.', '-'), file);
    if (!fs.existsSync(src)) {
      throw new Error(`Template file missing: ${src}`);
    }
    let destFile = file;
    
    // Rename README.md to {projectName}-readme.md
    if (file === 'README.md') {
      destFile = `${projectName}-readme.md`;
    }
    
    // Rename template.code-workspace to {projectName}.code-workspace
    if (file === 'template.code-workspace') {
      destFile = `${projectName}.code-workspace`;
    }

    // Normalize all generated file paths to lowercase.
    destFile = destFile.toLowerCase();
    
    const dest = path.join(targetDir, destFile);
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  });
}

function writeTemplateMetadata(targetDir: string, metadata: TemplateMetadata) {
  const metadataPath = getTemplateMetadataPath(targetDir);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}

function readTemplateMetadata(targetDir: string): TemplateMetadata {
  const metadataPath = getTemplateMetadataPath(targetDir);
  return JSON.parse(fs.readFileSync(metadataPath, 'utf8')) as TemplateMetadata;
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
    let targetDir = getTargetDir(uri);
    if (!targetDir) {
      vscode.window.showErrorMessage('No target directory found.');
      return;
    }

    if (fs.existsSync(getTemplateMetadataPath(targetDir))) {
      vscode.window.showWarningMessage('This folder already contains a template project. Use "Update Project Template" instead.');
      return;
    }
    try {
      copyTemplateFiles(templateType, targetDir, context.extensionPath);
      const extensionVersion = String(context.extension.packageJSON.version || '0.0.0');
      writeTemplateMetadata(targetDir, {
        templateType,
        templateVersion: extensionVersion,
        extensionVersionGeneratedBy: extensionVersion,
        generatedAt: new Date().toISOString(),
        fileManifestVersion: 1
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to create project: ${error}`);
      return;
    }
    vscode.window.showInformationMessage(`Project created using ${templateType} template.`);
    
    // Ask if user wants to initialize git
    const initGit = await vscode.window.showInformationMessage(
      'Initialize Git repository?',
      { modal: true },
      'Yes',
      'No'
    );
    if (initGit === 'Yes') {
      await initializeGit(targetDir);
      vscode.window.showInformationMessage('Git repository initialized with initial commit.');
    }
  });

  let updateDisposable = vscode.commands.registerCommand('projectTemplateGenerator.updateProjectTemplate', async (uri: vscode.Uri) => {
    const targetDir = getTargetDir(uri);
    if (!targetDir) {
      vscode.window.showErrorMessage('No target directory found.');
      return;
    }

    const metadataPath = getTemplateMetadataPath(targetDir);
    if (!fs.existsSync(metadataPath)) {
      vscode.window.showErrorMessage('No .template-meta.json found in this folder. Create a template project first.');
      return;
    }

    let metadata: TemplateMetadata;
    try {
      metadata = readTemplateMetadata(targetDir);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to read .template-meta.json: ${error}`);
      return;
    }

    if (!metadata.templateType || !templates[metadata.templateType]) {
      vscode.window.showErrorMessage('Invalid template metadata. Unknown template type.');
      return;
    }

    const extensionVersion = String(context.extension.packageJSON.version || '0.0.0');
    const confirm = await vscode.window.showInformationMessage(
      `Update ${metadata.templateType} template from ${metadata.templateVersion} to ${extensionVersion}?`,
      { modal: true },
      'Update',
      'Cancel'
    );

    if (confirm !== 'Update') {
      return;
    }

    try {
      copyTemplateFiles(metadata.templateType, targetDir, context.extensionPath);
      writeTemplateMetadata(targetDir, {
        ...metadata,
        templateVersion: extensionVersion,
        extensionVersionGeneratedBy: extensionVersion,
        generatedAt: new Date().toISOString()
      });
      vscode.window.showInformationMessage(`Template updated to version ${extensionVersion}.`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to update template: ${error}`);
    }
  });

  context.subscriptions.push(disposable, updateDisposable);
}

export function deactivate() {}
