# Workspace Agent Instructions

## Required Workflow For Every Code Change

Complete these steps in order for every task:

1. **Update the version** in `package.json` manually (e.g. `2.2.20` → `2.2.21`). Do NOT use `npm version patch` — versioning is managed by hand.
2. **Update `readme.md`** to reflect any changes: features, commands, shortcuts, layout, configuration, VSIX filename.
3. **Build and package**: run `npm run package`. This compiles TypeScript and produces a `.vsix` in `package/`.
4. **Delete old VSIX files** from `package/` — keep only the newly built one. Stage the deletions along with the other changes.
5. **Stage** the relevant changed files.
6. **Commit** with a meaningful message using one of these prefixes:
   - `feat:` — new feature
   - `fix:` — bug fix
   - `refactor:` — restructuring without behavior change
   - `chore:` — build, deps, tooling
   - `docs:` — documentation only
   - Do NOT add a scope in parentheses — use plain prefixes only: `feat: add response time display`
   - Avoid vague messages like "update files" or "misc fixes"
7. **Push** to remote.

## Commit Message Guidance

- Keep commit summaries specific and meaningful.
- Avoid vague messages such as "update files" or "misc fixes".
