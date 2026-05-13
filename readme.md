# Project Template Generator

A VS Code extension that enables quick project creation from customizable templates with intelligent type selection.

## Features

- **Quick Project Generation**: Generate new projects from predefined templates with a single command
- **Multiple Template Types**: Choose from various project templates:
  - Node.js projects
  - Python projects
  - Web projects (HTML/CSS/JS)
  - VS Code extensions
  - Documentation projects
- **Customizable Templates**: Each template includes:
  - Pre-configured project structure
  - Starter code and examples
  - Configuration files (package.json, tsconfig.json, etc.)
  - AI agent instructions (agents.md, claude.md)
  - VS Code workspace settings
  - Asset folders for organizing resources

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Project Template Generator"
4. Click Install

Or install the VSIX file directly:
```bash
code --install-extension project-template-generator-1.0.0.vsix
```

## Usage

1. Open VS Code Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Search for "Generate Project from Template"
3. Select your desired project type from the list
4. Choose a location for your new project
5. The template files will be copied and you can start developing

### Available Templates

#### Node.js
- Modern JavaScript project setup
- Includes package.json with common dependencies
- Ready for npm development

#### Python
- Python project structure with requirements.txt
- Includes src/ folder with main.py starter file
- Ready for development

#### Web
- HTML/CSS/JavaScript frontend project
- Includes basic HTML structure and styling
- JavaScript starter code

#### VS Code Extension
- Complete extension project scaffold
- TypeScript configuration
- Extension activation and command setup
- Ready for publishing to VS Code Marketplace

#### Documentation
- Documentation project template
- Markdown-based structure
- Workspace configuration for documentation development

## Requirements

- VS Code 1.70.0 or higher

## Extension Settings

This extension contributes the following commands:

* `project-template-generator.generateProject`: Generate a new project from a template

## Known Issues

None currently reported.

## Release Notes

### 1.0.0

Initial release of Project Template Generator with support for:
- Multiple project templates
- Interactive template selection
- Customizable template content
- Full project scaffolding

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is licensed under the MIT License.

## Author

Created with ❤️ for developers who value productivity

---

**Enjoy creating projects faster with Project Template Generator!**
