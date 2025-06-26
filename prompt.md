I want to create a MCP server that basically wraps Gemini CLI. It should be targetted at being used from Claude Desktop and Claude Code. So the MCP server should be able
  to tell what are the differences that Claude is missing and could use.

  In particular: Gemini has context window of 1M (Claude Code has only 200K).
  Gemini has multimodal (Supports generating images,video,pdf,etc)
  Gemini has very powerful Google Search, usefull for getting latest stuff and Research.
  Gemini is very good for reading lots of stuff, its just not as good as Claude for writting code.

  I want the MCP server to be made using https://mastra.ai/ using the latest version that supports creating MCP servers.
  The MCP server shall work locally only its ok stdio.

  Some repos for reference: https://github.com/ml0-1337/mcp-gemini-grounding
  In particular I wanna implement all the stuff that this one supports: https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia

  But if possible, lets use Gemini CLI https://github.com/google-gemini/gemini-cli https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/

  We can support both local Gemini CLI, and the API key. I think we could also add support for latest MCP features like
  https://modelcontextprotocol.io/specification/draft/client/elicitation

  Lets use only TypeScript, no other languages please.