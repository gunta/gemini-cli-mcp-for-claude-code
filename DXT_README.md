# Desktop Extension (DXT) Distribution

This project supports distribution as a Desktop Extension (DXT) for easy one-click installation in Claude Desktop and other AI applications.

## What is DXT?

Desktop Extensions (`.dxt`) are zip archives containing a local MCP server and a manifest that describes the server's capabilities. They enable single-click installation of MCP servers without manual configuration.

## Installation Methods

### Method 1: Download from GitHub Releases (Recommended)

1. Go to the [latest release](https://github.com/gunta/gemini-cli-mcp-for-claude-code/releases/latest)
2. Download `gemini-cli-mcp-for-claude-vX.X.X.dxt`
3. Open Claude Desktop
4. Navigate to Settings → Extensions
5. Click "Install Extension" and select the downloaded `.dxt` file
6. Configure your Gemini credentials when prompted

### Method 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/gunta/gemini-cli-mcp-for-claude-code.git
cd gemini-cli-mcp-for-claude-code

# Install dependencies
bun install

# Build and pack the DXT
bun run dxt:pack

# The .dxt file will be created in the current directory
```

## DXT Structure

Our DXT package includes:

```
gemini-cli-mcp-for-claude.dxt (20MB)
├── manifest.json          # Extension metadata and configuration
├── dist/                  # Compiled TypeScript files
│   ├── index.js          # Main entry point
│   └── ...               # All compiled source files
├── node_modules/         # Runtime dependencies only
├── mcp.json             # MCP configuration
└── package.json         # Minimal package info
```

The package is built from the `mcp-server/` directory to minimize size.

## Configuration

After installation, configure the extension with one of:

1. **Gemini API Key** (Recommended)
   - Set in Claude Desktop: Extensions → Gemini CLI MCP → Configure
   - Or set environment variable: `GEMINI_API_KEY=your-api-key`

2. **Gemini CLI Path**
   - If you have the Gemini CLI installed locally
   - Set `GEMINI_CLI_PATH=/path/to/gemini`

## Features Included

The DXT package provides Claude with:

- **Text Generation**: Gemini 2.0 Flash (1M token context)
- **Image Generation**: Imagen 3
- **Video Generation**: Veo 2
- **Audio Synthesis**: Chirp 3 HD
- **Music Generation**: Lyria
- **Media Processing**: AVTool utilities
- **Web Search**: Google search integration

## Manifest Details

The extension is self-documenting, meaning Claude automatically knows when to use Gemini's capabilities. Key manifest properties:

- **Name**: `gemini-cli-mcp-for-claude`
- **Type**: Node.js extension
- **Entry Point**: `dist/index.js`
- **Compatibility**: Claude Desktop ≥0.7.3, Node.js ≥18.0.0
- **Platforms**: macOS, Linux, Windows

## Building DXT Files

### Available Commands

```bash
# Initialize manifest (interactive)
bun run dxt:init

# Pack the extension
bun run dxt:pack

# Validate the manifest
bun run dxt:validate
```

### GitHub Actions

DXT files are automatically built and attached to GitHub releases:

1. When a new release is published
2. Via manual workflow dispatch

## Troubleshooting

### Extension Not Loading

1. Check Claude Desktop version (requires ≥0.7.3)
2. Verify Node.js 18+ is available
3. Check logs in Claude Desktop console

### Missing Dependencies

The DXT includes all dependencies, but if issues arise:

1. Rebuild the DXT with `bun run dxt:pack`
2. Ensure all dependencies are properly bundled

### Configuration Issues

1. Verify your Gemini API key is valid
2. Check that the Gemini CLI path exists (if using CLI mode)
3. Restart Claude Desktop after configuration changes

## Development

To modify and test the extension locally:

```bash
# Make your changes
# ...

# Rebuild
bun run build

# Pack new DXT
bun run dxt:pack

# Install in Claude Desktop for testing
```

## Resources

- [DXT Specification](https://github.com/anthropics/dxt)
- [MCP Documentation](https://modelcontextprotocol.io)
- [Project Documentation](https://gemini-mcp.mintlify.app)
- [GitHub Issues](https://github.com/gunta/gemini-cli-mcp-for-claude-code/issues)