# Workspace Agent Instructions

## Required Workflow For Every Code Change

1. Update version in `package.json`.
2. Update documentation with changes.
3. Build a new package with `npm run package` (automatically deletes old packages and includes version number in filename).
4. Stage changes with `git add -A`.
5. Add an intelligent commit comment with one of these prefixes:
   - `feat:` — new feature
   - `fix:` — bug fix
   - `refactor:` — restructuring without behavior change
   - `chore:` — build, deps, tooling
   - `docs:` — documentation only
6. Commit with `git commit -m "..."`
7. Push with `git push`.

## Package Details

- **Build Command:** `npm run package`
- **Output Location:** `./package/`
- **Filename Format:** `project-template-generator-VERSION.vsix` (e.g., `project-template-generator-0.0.6.vsix`)
- **Automatic Cleanup:** Old VSIX files are automatically deleted before creating a new package
- **Version Source:** Version is automatically read from `package.json`

## Commit Message Guidance

- Keep commit summaries specific and meaningful.
- Avoid vague messages such as "update files" or "misc fixes".
- Use the format: `prefix: description` (e.g., `feat: add template validation`)
