#!/usr/bin/env node
import { MCPServer } from '@mastra/mcp';

// Original tools
import { generateTextTool } from './tools/generate-text.js';
import { generateImageTool } from './tools/generate-image.js';
import { searchWebTool } from './tools/search-web.js';
import { analyzeDocumentTool } from './tools/analyze-document.js';
import { generateVideoTool } from './tools/generate-video.js';
import { generatePdfTool } from './tools/generate-pdf.js';

// Enhanced media tools
import { imagenImageTool } from './tools/imagen-image.js';
import { veoTextToVideoTool, veoImageToVideoTool } from './tools/veo-video.js';
import { chirpTtsTool, listChirpVoicesTool } from './tools/chirp-audio.js';
import { lyriaMusicTool } from './tools/lyria-music.js';
import {
  ffmpegGetMediaInfoTool,
  ffmpegConvertAudioTool,
  ffmpegVideoToGifTool,
  ffmpegCombineAudioVideoTool,
  ffmpegOverlayImageTool,
  ffmpegConcatenateMediaTool,
  ffmpegAdjustVolumeTool,
  ffmpegLayerAudioTool,
} from './tools/avtool-media.js';

import { prompts } from './prompts/index.js';
import { resources } from './resources/index.js';

const server = new MCPServer({
  name: 'gemini-cli-mcp-for-claude',
  version: '2.0.0',
  description:
    "MCP server providing Claude with Google's FULL media generation suite: Imagen 3, Veo 2, Chirp 3 HD, Lyria, and comprehensive media manipulation tools. Supercharges Claude with capabilities it completely lacks.",
  tools: {
    // Text and search (enhanced)
    generateTextTool,
    searchWebTool,
    analyzeDocumentTool,

    // Image generation (Imagen 3)
    generateImageTool, // Legacy
    imagenImageTool, // Enhanced Imagen 3

    // Video generation (Veo 2)
    generateVideoTool, // Legacy
    veoTextToVideoTool, // Enhanced text-to-video
    veoImageToVideoTool, // Image-to-video

    // Audio synthesis (Chirp 3 HD)
    chirpTtsTool,
    listChirpVoicesTool,

    // Music generation (Lyria)
    lyriaMusicTool,

    // PDF generation
    generatePdfTool,

    // Media manipulation (AVTool)
    ffmpegGetMediaInfoTool,
    ffmpegConvertAudioTool,
    ffmpegVideoToGifTool,
    ffmpegCombineAudioVideoTool,
    ffmpegOverlayImageTool,
    ffmpegConcatenateMediaTool,
    ffmpegAdjustVolumeTool,
    ffmpegLayerAudioTool,
  },
  prompts,
  resources,
});

// Start the server with stdio transport (for Claude Desktop/Code)
server.startStdio().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
