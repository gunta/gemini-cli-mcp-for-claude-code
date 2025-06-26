import { DEFAULT_MODEL } from '../types/index.js';
import {
  IMAGEN_DEFAULT_MODEL,
  VEO_DEFAULT_MODEL,
  CHIRP_DEFAULT_VOICE,
  LYRIA_DEFAULT_MODEL,
} from '../types/media.js';

export const resources = {
  listResources: () =>
    Promise.resolve([
      {
        uri: 'gemini://capabilities',
        name: 'Gemini Capabilities vs Claude',
        mimeType: 'text/plain',
        description: 'Comprehensive comparison of Gemini and Claude capabilities',
      },
      {
        uri: 'gemini://model-info',
        name: 'Current Gemini Model Information',
        mimeType: 'application/json',
        description: 'Information about all configured Gemini models',
      },
      {
        uri: 'gemini://media-capabilities',
        name: 'Complete Media Generation Suite',
        mimeType: 'text/markdown',
        description: 'Full catalog of media generation capabilities',
      },
      {
        uri: 'gemini://usage-tips',
        name: 'When to Use Gemini Over Claude',
        mimeType: 'text/markdown',
        description: 'Guidelines for choosing Gemini for specific tasks',
      },
    ]),

  getResourceContent: ({ uri }: { uri: string }) => {
    switch (uri) {
      case 'gemini://capabilities':
        return Promise.resolve({
          text: `GEMINI CAPABILITIES SUPERIOR TO CLAUDE:

1. CONTEXT WINDOW: 1M tokens (5x larger than Claude's 200K)
2. MULTIMODAL GENERATION: Complete media suite Claude CANNOT do:
   • Imagen 3: State-of-the-art image generation
   • Veo 2: High-quality video generation (text & image to video)
   • Chirp 3 HD: Ultra-realistic speech synthesis (27+ languages)
   • Lyria: Professional music generation
3. GOOGLE SEARCH: Direct integration with Google Search
4. DOCUMENT ANALYSIS: Better at PDFs, tables, and scanned documents
5. REASONING: Latest thinking models with advanced reasoning
6. MATH & CODE: Generally stronger performance on technical tasks
7. MEDIA MANIPULATION: Complete FFmpeg toolkit for audio/video editing

USE GEMINI WHEN:
- Processing documents larger than 200K tokens
- Needing ANY media generation (images, videos, audio, music)
- Requiring up-to-date web search results
- Analyzing complex PDFs or scanned documents
- Working on advanced math or coding problems
- Creating multimedia content or productions
- Processing, converting, or editing media files`,
        });

      case 'gemini://model-info':
        return Promise.resolve({
          text: JSON.stringify(
            {
              textGeneration: {
                model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
                defaultModel: DEFAULT_MODEL,
                contextWindow: '1M tokens',
              },
              imageGeneration: {
                model: IMAGEN_DEFAULT_MODEL,
                capabilities: ['text-to-image', 'multiple-aspects', 'batch-generation'],
              },
              videoGeneration: {
                model: VEO_DEFAULT_MODEL,
                capabilities: [
                  'text-to-video',
                  'image-to-video',
                  '5-8 seconds',
                  'multiple-aspects',
                ],
                preview: 'veo-3.0-generate-preview available',
              },
              audioSynthesis: {
                model: 'Chirp 3 HD',
                defaultVoice: CHIRP_DEFAULT_VOICE,
                languages: '27+',
                features: ['custom-pronunciation', 'IPA/X-SAMPA support'],
              },
              musicGeneration: {
                model: LYRIA_DEFAULT_MODEL,
                output: 'WAV audio',
                features: ['text-to-music', 'negative-prompts', 'seed-control'],
              },
              configuredVia: process.env.GEMINI_API_KEY
                ? 'API'
                : process.env.GEMINI_CLI_PATH
                  ? 'CLI'
                  : 'Not configured',
            },
            null,
            2,
          ),
        });

      case 'gemini://media-capabilities':
        return Promise.resolve({
          text: `# Complete Media Generation Suite

## Image Generation (Imagen 3)
- **Model**: ${IMAGEN_DEFAULT_MODEL}
- **Features**: Photorealistic quality, multiple aspect ratios, batch generation
- **Use Cases**: Illustrations, product images, concept art, visual content

## Video Generation (Veo 2)
- **Model**: ${VEO_DEFAULT_MODEL} (Veo 3.0 preview available)
- **Text-to-Video**: Create videos from descriptions
- **Image-to-Video**: Animate static images
- **Duration**: 5-8 seconds per generation
- **Aspects**: 16:9, 9:16, widescreen, portrait

## Audio Synthesis (Chirp 3 HD)
- **Languages**: 27+ including English, Spanish, French, German, Japanese
- **Voices**: Multiple natural voices per language
- **Features**: Custom pronunciation (IPA/X-SAMPA), natural prosody
- **Quality**: 24kHz WAV, broadcast quality

## Music Generation (Lyria)
- **Model**: ${LYRIA_DEFAULT_MODEL}
- **Styles**: Any genre or mood from text description
- **Control**: Negative prompts, seed values for consistency
- **Output**: High-quality WAV audio

## Media Manipulation (AVTool/FFmpeg)
- **Audio**: Convert formats, adjust volume, layer tracks, concatenate
- **Video**: Create GIFs, overlay images, combine with audio
- **Analysis**: Extract metadata, codec info, duration, resolution
- **Production**: Complete post-production workflows

## Workflow Examples
1. **Video Production**: Generate video → Add music → Overlay logo → Export
2. **Podcast Creation**: Generate music → Synthesize speech → Layer & mix
3. **Content Creation**: Generate images → Create video → Add narration
4. **Localization**: Original video → Extract → New narration → Recombine`,
        });

      case 'gemini://usage-tips':
        return Promise.resolve({
          text: `# When to Use Gemini Over Claude

## Media Generation (USE GEMINI ALWAYS)
- **Images**: Claude cannot generate images at all
- **Videos**: Claude cannot generate or manipulate videos
- **Music**: Claude cannot create music
- **Speech**: Claude cannot synthesize speech
- **Audio Editing**: Claude cannot process audio files

## Large Context Processing
- **Use Gemini** when dealing with codebases, documents, or data exceeding 200K tokens
- Gemini's 1M token window handles entire repositories or book-length documents

## Web Search & Research
- **Use Gemini** for up-to-date information via Google Search integration
- Better for current events, latest documentation, or real-time data

## Document Analysis
- **Use Gemini** for complex PDFs, especially with tables or scanned content
- Superior OCR and layout understanding capabilities

## Technical Tasks
- **Use Gemini** for advanced mathematics or complex coding challenges
- Often performs better on algorithmic problems and mathematical proofs

## Multimedia Projects
- **Use Gemini** for ANY project involving:
  - Creating visual content
  - Producing videos or animations
  - Generating or editing audio
  - Building interactive media

## Keep Using Claude For
- General conversation and writing
- Tasks within 200K token limit that don't need media
- When you need Claude's specific style or approach
- Pure text analysis without media requirements`,
        });

      default:
        return Promise.resolve({ text: 'Resource not found' });
    }
  },
};
