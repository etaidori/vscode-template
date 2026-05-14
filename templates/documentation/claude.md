# Workspace Agent Instructions

## Git Workflow — Optional with "Process Git"

By default, code changes are made **without git operations**. The full git workflow (version bumping, packaging, committing, pushing) only runs when you include `"Process Git"` in your request.

### Default Behavior (No Git Operations)
- Update code, files, and documentation
- Build and compile as needed
- **Skip:** version bumping, git commit, git push

### With "Process Git" Instruction
When you include `"Process Git"` in your request, complete these steps:

1. **Update the version** in `package.json` (e.g. `0.0.9` → `0.0.10`)
2. **Update documentation** (`template-readme.md`, etc.) to reflect any changes
3. **Build and package**: run `npm run package`. Auto-cleans old VSIX files and versions the output.
4. **Stage** changed files: `git add -A`
5. **Commit** with a meaningful message using one of these prefixes:
   - `feat:` — new feature
   - `fix:` — bug fix
   - `refactor:` — restructuring without behavior change
   - `chore:` — build, deps, tooling
   - `docs:` — documentation only
   - Format: `prefix: description` (no scope parentheses)
   - Avoid vague messages like "update files" or "misc fixes"
6. **Push** to remote

## Examples

- `"Add a new template"` → Code changes only
- `"Fix the file copying issue. Process Git"` → Code changes + full git workflow
- `"Update documentation"` → Documentation only, no git operations

## Commit Message Guidance

- Keep commit summaries specific and meaningful
- Be descriptive: `feat: add git initialization prompt to extension` instead of `update files`
- Avoid vague messages like "update files" or "misc fixes"
