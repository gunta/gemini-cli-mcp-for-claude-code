# MCP Server Directory

This directory contains the packaged MCP server for distribution as a Desktop Extension (DXT).

## Structure

```
mcp-server/
├── manifest.json     # DXT manifest configuration
├── mcp.json         # MCP server configuration
├── package.json     # Minimal package.json with runtime dependencies only
├── dist/            # Compiled TypeScript output (generated)
└── node_modules/    # Runtime dependencies (generated)
```

## Purpose

This directory is specifically designed for DXT packaging to:
- Minimize package size (20MB vs 42MB)
- Include only runtime dependencies
- Exclude development files, tests, and documentation
- Create a clean, production-ready extension

## Building

The MCP server is built from the parent directory:

```bash
# From the root directory
bun run build:mcp     # Builds TypeScript to mcp-server/dist
bun run dxt:pack      # Creates the .dxt file
```

## Distribution

The generated `.dxt` file can be:
1. Uploaded to GitHub releases
2. Distributed directly to users
3. Installed via Claude Desktop's extension manager

## Do Not Edit

Files in this directory (except this README) should not be edited directly. Instead:
- Edit source files in `../src/`
- Edit manifest.json here (it's the source of truth for DXT)
- Run build commands from the parent directory