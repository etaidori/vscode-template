import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Define your template types and their files
const templates: Record<string, string[]> = {
  'Node.js': ['README.md', 'package.json', 'src/index.js'],
  'Python': ['README.md', 'requirements.txt', 'src/main.py'],
  'Web': ['README.md', 'index.html', 'src/app.js', 'src/style.css']
};

function copyTemplateFiles(templateType: string, targetDir: string, extensionPath: string) {
  const files: string[] | undefined = templates[templateType];
  if (!files) return;
  files.forEach((file: string) => {
    const src = path.join(extensionPath, 'templates', templateType, file);
    const dest = path.join(targetDir, file);
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
