# Infrastructure as Code (IaC) with Alchemy

This directory contains TypeScript-based deployment scripts using [Alchemy.run](https://alchemy.run) for deploying the Gemini CLI MCP landing page and documentation to various platforms.

## Quick Start

```bash
# Install dependencies
cd iac
bun install

# Set up environment files
cp providers/cloudflare.env.example providers/cloudflare.env
cp providers/github.env.example providers/github.env
cp providers/mintlify.env.example providers/mintlify.env
# Edit the .env files with your credentials

# Deploy
bun run deploy:landing:cloudflare  # Deploy landing to Cloudflare Pages
bun run deploy:landing:github      # Deploy landing to GitHub Pages
bun run deploy:docs:cloudflare     # Deploy docs to Cloudflare Pages
bun run deploy:docs:mintlify       # Deploy docs to Mintlify.com

# Destroy all resources
bun run destroy --force
```

## Available Deployment Scripts

### 1. Cloudflare Pages (Landing Page)
Deploy the Astro landing page to Cloudflare Pages using Alchemy.

```bash
bun run deploy:landing:cloudflare
```

Environment Variables:
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare Account ID (required)
- `CLOUDFLARE_API_TOKEN` - API Token with Pages permissions (required)
- `CLOUDFLARE_PROJECT_NAME` - Project name (default: gemini-cli-landing)
- `DEPLOY_BRANCH` - Branch to deploy (default: main)

### 2. GitHub Pages (Landing Page)
Deploy the landing page to GitHub Pages.

```bash
bun run deploy:landing:github
```

Environment Variables:
- `GITHUB_TOKEN` - Personal Access Token (optional but recommended)
- `GITHUB_OWNER` - Repository owner
- `GITHUB_REPO` - Repository name
- `DEPLOY_BRANCH` - Deploy branch (default: gh-pages)
- `CUSTOM_DOMAIN` - Custom domain for CNAME file
- `GIT_USER_NAME` - Git user name for commits
- `GIT_USER_EMAIL` - Git user email for commits

### 3. Mintlify to Cloudflare (Documentation)
Deploy Mintlify documentation to Cloudflare Pages.

```bash
bun run deploy:docs:cloudflare
```

Options:
- `--keep-build` - Keep build artifacts after deployment

Environment Variables:
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare Account ID (required)
- `CLOUDFLARE_API_TOKEN` - API Token with Pages permissions (required)
- `CLOUDFLARE_DOCS_PROJECT_NAME` - Project name (default: gemini-cli-docs)
- `DEPLOY_BRANCH` - Branch to deploy (default: main)

### 4. Mintlify.com (Documentation)
Deploy documentation to Mintlify's hosted service.

```bash
bun run deploy:docs:mintlify
```

Environment Variables:
- `MINTLIFY_API_KEY` - API key from Mintlify dashboard
- `MINTLIFY_SUBDOMAIN` - Your Mintlify subdomain
- `CUSTOM_DOMAIN` - Custom domain (for reference)

## Architecture

This project uses [Alchemy.run](https://alchemy.run), a TypeScript-native Infrastructure-as-Code library that:
- Provides type-safe infrastructure definitions
- Manages state locally in `.alchemy/` directory
- Supports multiple cloud providers
- Works with any JavaScript runtime (Node.js, Bun, Deno)

## Prerequisites

### Required
- [Bun](https://bun.sh) or Node.js 18+
- Git installed and configured
- Active accounts on deployment platforms

### Platform-Specific Requirements

**Cloudflare Pages:**
- Cloudflare account with Pages enabled
- API token with Pages permissions

**GitHub Pages:**
- GitHub repository with appropriate permissions
- Optional: Personal Access Token for automation

**Mintlify:**
- Mintlify account (for Mintlify.com deployment)
- API key from Mintlify dashboard

## Environment Configuration

Each provider has an example environment file in the `providers/` directory:

1. Copy the `.env.example` file to `.env`
2. Fill in your credentials
3. Source the file before running deployment scripts

Example:
```bash
cp providers/cloudflare.env.example providers/cloudflare.env
# Edit the file with your credentials
source providers/cloudflare.env
./scripts/deploy-cloudflare-pages.sh
```

## Security Notes

- Never commit `.env` files with actual credentials
- Use environment variables or secure secret management
- Rotate API tokens regularly
- Use minimal required permissions for tokens

## Development

```bash
# Type checking
bun run typecheck

# Linting
bun run lint

# Format code
bun run format
```

## Troubleshooting

### Cloudflare Deployment Issues
- Verify API token has Pages:Edit permissions
- Check account ID is correct
- Ensure project name is unique in your account
- For direct uploads, the script will fall back to wrangler CLI

### GitHub Pages Not Updating
- Ensure gh-pages branch was created and pushed
- Check GitHub Pages is enabled in repository settings
- Allow a few minutes for changes to propagate
- Clear browser cache when viewing

### Mintlify Build Errors
- Run `bunx mintlify validate` in docs directory
- Check all referenced files exist
- Verify mint.json syntax is valid
- Ensure subdomain is configured

### Alchemy State Issues
- State is stored in `.alchemy/` directory
- Delete this directory to reset state
- Run `bun run destroy --force` to clean up

## How Alchemy Works

1. **State Management**: Alchemy stores deployment state locally in `.alchemy/`
2. **Resource Definition**: Resources are defined as TypeScript functions
3. **Deployment**: Running the script creates/updates resources
4. **Destruction**: The `--destroy` flag removes resources

## Adding New Deployment Targets

To add a new deployment target:

1. Create a new TypeScript file in `scripts/`
2. Import Alchemy and required providers
3. Define resources using Alchemy's API
4. Add npm script to `package.json`
5. Update this README

Example structure:
```typescript
import alchemy from "alchemy";
import { YourResource } from "alchemy/provider";

const app = await alchemy("deployment-name");
const resource = await YourResource("name", { /* config */ });
await app.finalize();
```

## Resources

- [Alchemy Documentation](https://alchemy.run/docs)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [GitHub Pages Docs](https://docs.github.com/pages)
- [Mintlify Documentation](https://mintlify.com/docs)

## Support

For issues:
- Check error messages and script output
- Review environment variables
- Ensure all prerequisites are installed
- Check provider-specific documentation linked above