# Gemini MCP Documentation

This directory contains the Mintlify documentation for the Gemini CLI MCP for Claude.

## Viewing Documentation

### Option 1: Online (Recommended)
Visit the deployed documentation at: https://gemini-mcp.mintlify.app

### Option 2: Local Development
Due to compatibility issues with Node.js 24+, you'll need Node.js 18 or 20 to run Mintlify locally:

```bash
# Install Node 18 or 20 (using nvm)
nvm install 20
nvm use 20

# Run the documentation locally
cd docs && npx mint dev

# Or from the root directory (after switching Node version)
bun run docs:dev:force
```

## Documentation Structure

```
docs/
├── mint.json           # Mintlify configuration
├── introduction.mdx    # Getting started guide
├── quickstart.mdx      # Quick start tutorial
└── tools/
    └── overview.mdx    # Tools overview
```

## Deployment

The documentation is automatically deployed to Mintlify when changes are pushed to the main branch.

To build the documentation:
```bash
bun run docs:build
```

## Adding New Pages

1. Create a new `.mdx` file in the appropriate directory
2. Add the page to the navigation in `mint.json`
3. Follow the existing page structure for consistency

## Resources

- [Mintlify Documentation](https://mintlify.com/docs)
- [MDX Syntax Guide](https://mdxjs.com/docs/what-is-mdx/)