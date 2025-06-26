# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Why This MCP Server is Different (Important!)

Unlike other Gemini MCP servers that require extensive documentation about when to use which tool, this server is **self-documenting and Claude-aware**. Every tool description explicitly tells Claude:
- When Gemini is SUPERIOR (e.g., "1M token context window (5x larger than Claude's 200K)")
- What capabilities Claude COMPLETELY LACKS (e.g., "CAPABILITY NOT AVAILABLE IN CLAUDE")
- Exactly when to use each tool

**You don't need to document Gemini's capabilities here** - the tools themselves contain all necessary context for Claude to make intelligent decisions about when to use them.

## Project Overview

This is a TypeScript MCP (Model Context Protocol) server that provides Claude with Google's COMPLETE media generation suite. It's a superset of Google's own mcp-genmedia, offering:

**Core Advantages Over Claude:**
- 1M token context window (5x larger than Claude's 200K)
- Complete multimodal generation Claude CANNOT do:
  - Imagen 3: State-of-the-art image generation
  - Veo 2: Video generation (text-to-video, image-to-video)
  - Chirp 3 HD: Speech synthesis in 27+ languages
  - Lyria: Professional music generation
- Google Search integration
- Comprehensive media manipulation tools (FFmpeg/AVTool)
- Enhanced document processing

**Version 2.0** includes all media generation capabilities from Google's Creative Studio.

## Architecture

The project uses the Mastra.ai framework to create a local stdio-based MCP server. Key architectural decisions:
- TypeScript-only implementation
- Supports both local Gemini CLI and API key authentication
- Implements reference patterns from:
  - https://github.com/smithery-ai/mcp-server-gemini
  - https://github.com/andybrandt/mcp-gemini-server

## Development Commands

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript
npm run dev          # Development mode with watch
npm run test         # Run tests (not yet implemented)
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run typecheck    # TypeScript type checking
npm run inspector    # Test with MCP Inspector
npm start            # Run the compiled server
```

## Key Implementation Areas

1. **MCP Server Setup**: Use Mastra.ai's MCP utilities for server creation
2. **Gemini Integration**: Implement both CLI wrapper and API client
3. **Tool Definitions**: Define MCP tools for multimodal capabilities, search, and document processing
4. **Error Handling**: Robust error handling for both Gemini failures and MCP protocol errors

## Distribution

The project will support distribution via DXT (Developer Experience Tools) - Anthropic's newly released tool for discovering and installing MCP servers. See: https://github.com/anthropics/dxt

This means:
- Package the MCP server for easy installation through DXT
- Follow DXT packaging conventions and metadata requirements
- Ensure compatibility with DXT's discovery and installation flow

## Important Considerations

- Prioritize feature parity with reference implementations
- Ensure proper streaming support for large context operations
- Implement proper authentication handling for both CLI and API modes
- Follow MCP protocol specifications strictly for Claude compatibility
- Design with DXT distribution in mind from the start