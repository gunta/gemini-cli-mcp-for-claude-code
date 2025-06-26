# gemini-cli-mcp-for-claude

An MCP (Model Context Protocol) server that provides Claude Desktop and Claude Code with access to Google's COMPLETE media generation suite. This server is a superset of Google's own mcp-genmedia, providing ALL capabilities Claude lacks.

## 🚀 Features

### Core Capabilities
- **1M Token Context Window** - 5x larger than Claude's 200K limit
- **Google Search Integration** - Direct access to real-time web search

### 🎨 Image Generation (Imagen 3)
- State-of-the-art photorealistic image generation
- Multiple aspect ratios (1:1, 16:9, 9:16, 4:3, 3:4)
- Batch generation (up to 4 images)
- Cloud storage support

### 🎬 Video Generation (Veo 2)
- Text-to-video generation
- Image-to-video animation
- Multiple aspect ratios and durations (5-8 seconds)
- Veo 3.0 preview support

### 🎵 Music Generation (Lyria)
- Professional music composition from text
- Any genre or style
- Negative prompts for fine control
- Seed values for reproducibility

### 🗣️ Speech Synthesis (Chirp 3 HD)
- Ultra-realistic voices in 27+ languages
- Multiple voices per language
- Custom pronunciation (IPA/X-SAMPA)
- Broadcast-quality 24kHz WAV output

### 🛠️ Media Manipulation (AVTool/FFmpeg)
- Audio: Convert formats, adjust volume, layer tracks
- Video: Create GIFs, overlay images, combine with audio
- Analysis: Extract metadata, codec info
- Production: Complete post-production workflows

## Installation

### Via DXT (Recommended)

```bash
# Install using DXT
dxt install gemini-cli-mcp-for-claude
```

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/gunta/gemini-cli-mcp-for-claude-code.git
cd gemini-cli-mcp-for-claude-code

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

### Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required if not using CLI)
- `GEMINI_CLI_PATH` - Path to Gemini CLI executable (required if not using API)
- `GEMINI_MODEL` - Model to use (default: `gemini-2.0-flash-thinking-exp-1219`)
- `GEMINI_TEMPERATURE` - Default temperature (default: `0.7`)
- `GEMINI_MAX_TOKENS` - Default max tokens (default: `8192`)

### Claude Desktop Configuration

Add to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "gemini": {
      "command": "node",
      "args": ["/path/to/gemini-cli-mcp-for-claude/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## 📚 Complete Tool Catalog

### Text & Analysis
- `gemini_generate_text` - 1M token context generation with multimodal support
- `gemini_search_web` - Google Search integration
- `gemini_analyze_document` - Advanced PDF/document analysis

### Image Generation
- `imagen_t2i` - Imagen 3 text-to-image generation
- `gemini_generate_image` - Legacy image generation

### Video Generation  
- `veo_t2v` - Veo 2 text-to-video
- `veo_i2v` - Veo 2 image-to-video
- `gemini_generate_video` - Legacy video generation

### Audio & Music
- `chirp_tts` - Chirp 3 HD text-to-speech
- `list_chirp_voices` - List available voices by language
- `lyria_generate_music` - Lyria music generation

### Media Processing
- `ffmpeg_get_media_info` - Extract media metadata
- `ffmpeg_convert_audio_wav_to_mp3` - Audio format conversion
- `ffmpeg_video_to_gif` - Create high-quality GIFs
- `ffmpeg_combine_audio_and_video` - Merge audio/video
- `ffmpeg_overlay_image_on_video` - Add watermarks/logos
- `ffmpeg_concatenate_media_files` - Join media files
- `ffmpeg_adjust_volume` - Volume control
- `ffmpeg_layer_audio_files` - Mix audio tracks

### Document Generation
- `gemini_generate_pdf` - Generate PDF documents

## 💡 Usage Examples

### Complete Video Production
```javascript
// 1. Generate a video
await veo_t2v({ 
  prompt: "Aerial view of tropical beach at sunset",
  aspectRatio: "16:9",
  duration: 8
});

// 2. Generate background music
await lyria_generate_music({
  prompt: "Calm tropical ambient music",
  duration: 8
});

// 3. Combine video and music
await ffmpeg_combine_audio_and_video({
  videoFile: "video.mp4",
  audioFile: "music.wav",
  outputFile: "final.mp4"
});
```

### Multilingual Content
```javascript
// Generate narration in multiple languages
await chirp_tts({
  text: "Welcome to our product",
  voiceName: "en-US-Chirp3-HD-Zephyr"
});

await chirp_tts({
  text: "Bienvenido a nuestro producto",
  voiceName: "es-ES-Chirp3-HD-Aurora"
});
```

## Development

```bash
# Run in development mode
npm run dev

# Run linting
npm run lint

# Format code
npm run format

# Type check
npm run typecheck

# Test with MCP Inspector
npm run inspector
```

## Requirements

- Node.js 18+
- Either:
  - Google Gemini API key (for API mode)
  - Gemini CLI installed (for CLI mode with full features)

## Why This MCP Server? (The Hot Take 🔥)

### The Problem with Other Gemini MCP Servers

Yes, there are other MCP servers that wrap Gemini. But they're doing it wrong.

Most Gemini MCP servers are just dumb API wrappers. They expose the endpoints and call it a day. This means:
- You have to manually tell Claude when to use Gemini
- You need a massive CLAUDE.md file explaining what Gemini can do
- Claude has no idea which tool to use when
- You're basically a human router between two AIs

### Why This One is Built Different

**This MCP server is self-documenting and Claude-aware.**

Every single tool tells Claude EXACTLY when it's better than Claude's native capabilities:
- `"SUPERIOR capabilities vs Claude: 1M token context window (5x larger)"`
- `"CAPABILITY NOT AVAILABLE IN CLAUDE"`
- `"Use this when you need..."`

Claude automatically knows to use Gemini for:
- Documents over 200K tokens
- ANY media generation (images, video, music, speech)
- Multimodal inputs
- Google Search

**No CLAUDE.md maintenance. No confusion. It just works.**

### What Claude Can't Do (But Now Can)

Claude **natively cannot**:
- Generate images
- Create videos
- Synthesize speech
- Compose music
- Edit media files
- Process files over 200K tokens
- Search the web

This MCP server doesn't just add these capabilities - it makes Claude **understand** when to use them.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.