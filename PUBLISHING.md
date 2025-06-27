# Publishing to NPM

This guide explains how to publish the `gemini-cli-mcp-for-claude` package to npm.

## Prerequisites

1. **NPM Account**: You need an npm account with publish permissions
2. **NPM Token**: Set up an NPM token in GitHub Secrets as `NPM_TOKEN`

## Publishing Methods

### 1. Automated Release (Recommended)

Releases are automatically handled via GitHub Actions when changes are merged to the main branch:

1. Create a changeset for your changes:
   ```bash
   bun run changeset
   ```

2. Follow the prompts to describe your changes
3. Commit the changeset file
4. Push to a feature branch and create a PR
5. When merged to main, the GitHub Action will:
   - Create a release PR with version bumps
   - Once the release PR is merged, automatically publish to npm

### 2. Manual Release

Use the GitHub Actions workflow for manual releases:

1. Go to Actions → Manual Release
2. Click "Run workflow"
3. Select release type (patch/minor/major)
4. The workflow will handle versioning and publishing

### 3. Local Publishing (Emergency Only)

If you need to publish locally:

```bash
# 1. Create a changeset
bun run changeset

# 2. Version the package
bun run version

# 3. Build and publish
bun run release
```

**Note**: You'll need to have `NPM_TOKEN` set in your environment:
```bash
export NPM_TOKEN=your-npm-token
```

## Version Management

We use [Changesets](https://github.com/changesets/changesets) for version management:

- **Patch**: Bug fixes and small changes (1.0.0 → 1.0.1)
- **Minor**: New features, backwards compatible (1.0.0 → 1.1.0)
- **Major**: Breaking changes (1.0.0 → 2.0.0)

## Pre-publish Checklist

Before publishing, the following checks are automatically run:

1. ✅ Linting (`bun run lint`)
2. ✅ Tests (`bun test`)
3. ✅ Build (`bun run build`)

## Package Contents

The published package includes:
- `dist/` - Compiled JavaScript files
- `README.md` - Package documentation
- `LICENSE` - License file
- `mcp.json` - MCP configuration
- `package.json` - Package metadata

Files excluded from publishing are listed in `.npmignore`.

## Troubleshooting

### Build Fails
- Ensure all TypeScript errors are resolved
- Run `bun run typecheck` locally

### Tests Fail
- Run `bun test` locally to debug
- Ensure all tests pass before pushing

### Publishing Fails
- Verify NPM_TOKEN is correctly set in GitHub Secrets
- Check if the package name is available on npm
- Ensure you have publish permissions

## First-time Setup

1. Create an npm account at https://www.npmjs.com/
2. Generate an access token:
   - Go to npm Account Settings → Access Tokens
   - Create a new token with "Publish" permissions
3. Add the token to GitHub repository secrets:
   - Go to Settings → Secrets → Actions
   - Add new secret named `NPM_TOKEN`
   - Paste your npm token as the value

## Links

- [NPM Package Page](https://www.npmjs.com/package/gemini-cli-mcp-for-claude)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [NPM Publishing Docs](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)