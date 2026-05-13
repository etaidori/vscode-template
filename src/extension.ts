import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Define your template types and their files
const templates: Record<string, string[]> = {
  'node-js': ['readme.md', 'package.json', 'src/index.js', 'template.code-workspace'],
  'python': ['readme.md', 'requirements.txt', 'src/main.py', 'template.code-workspace'],
  'web': ['readme.md', 'index.html', 'src/app.js', 'src/style.css', 'template.code-workspace']
};

function copyTemplateFiles(templateType: string, targetDir: string, extensionPath: string) {
  const files: string[] | undefined = templates[templateType];
  if (!files) return;
  const projectName = path.basename(targetDir);
  
  files.forEach((file: string) => {
    const src = path.join(extensionPath, 'templates', templateType.toLowerCase().replace('.', '-'), file);
    let destFile = file;
    
    // Rename readme.md to {projectName}-readme.md
    if (file === 'readme.md') {
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
