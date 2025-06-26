/// <reference types="node" />
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { GeminiCliWrapper } from '../utils/gemini-cli.js';
import { VEO_DEFAULT_MODEL } from '../types/media.js';

// Initialize CLI client
const config = {
  useCliPath: process.env.GEMINI_CLI_PATH,
};

const geminiCli = config.useCliPath ? new GeminiCliWrapper(config) : null;

export const veoTextToVideoTool = createTool({
  id: 'veo_t2v',
  description: `Generate videos from text using Google's Veo 2 (CAPABILITY NOT AVAILABLE IN CLAUDE).
  Veo 2 creates high-quality videos with:
  • Advanced motion understanding
  • Multiple aspect ratios (16:9, 9:16, widescreen, portrait)
  • Duration control (5-8 seconds)
  • Cinematic quality
  • Support for Veo 3.0 preview
  Perfect for creating video content, animations, and visual storytelling.`,
  inputSchema: z.object({
    prompt: z.string().describe('Text description for video generation'),
    model: z
      .string()
      .optional()
      .default(VEO_DEFAULT_MODEL)
      .describe('Veo model version (veo-2.0 or veo-3.0-preview)'),
    bucket: z.string().describe('GCS bucket for video storage (required by API)'),
    numVideos: z
      .number()
      .min(1)
      .max(4)
      .optional()
      .default(1)
      .describe('Number of videos to generate'),
    aspectRatio: z
      .string()
      .optional()
      .default('16:9')
      .describe('Aspect ratio: "16:9", "9:16", "widescreen", "portrait"'),
    duration: z.number().min(5).max(8).optional().default(5).describe('Video duration in seconds'),
    outputDirectory: z.string().optional().describe('Local directory to download generated videos'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'Video generation requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    const result = await geminiCli.generateVideo({
      prompt: context.prompt,
      model: context.model,
      bucket: context.bucket,
      numVideos: context.numVideos,
      aspectRatio: context.aspectRatio,
      duration: context.duration,
      outputDirectory: context.outputDirectory,
    });

    return {
      success: true,
      videos: result.paths,
      gcsUris: result.gcsUris,
      message: `Generated ${context.numVideos} video(s) in ${context.bucket}`,
    };
  },
});

export const veoImageToVideoTool = createTool({
  id: 'veo_i2v',
  description: `Generate videos from images using Google's Veo 2 (CAPABILITY NOT AVAILABLE IN CLAUDE).
  Transform static images into dynamic videos with:
  • Intelligent motion synthesis
  • Optional text guidance
  • Preserves image content while adding movement
  • Multiple aspect ratios and durations
  Perfect for bringing photos to life or creating animated sequences.`,
  inputSchema: z.object({
    imageUri: z.string().describe('GCS URI of input image (gs://bucket/image.jpg)'),
    mimeType: z.enum(['image/jpeg', 'image/png']).optional().describe('Image MIME type'),
    prompt: z.string().optional().describe('Optional text guidance for video generation'),
    model: z.string().optional().default(VEO_DEFAULT_MODEL).describe('Veo model version'),
    bucket: z.string().describe('GCS bucket for video storage'),
    numVideos: z
      .number()
      .min(1)
      .max(4)
      .optional()
      .default(1)
      .describe('Number of videos to generate'),
    aspectRatio: z.string().optional().default('16:9').describe('Aspect ratio'),
    duration: z.number().min(5).max(8).optional().default(5).describe('Video duration in seconds'),
    outputDirectory: z.string().optional().describe('Local directory to download videos'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'Image-to-video requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    const result = await geminiCli.imageToVideo({
      imageUri: context.imageUri,
      mimeType: context.mimeType,
      prompt: context.prompt,
      model: context.model,
      bucket: context.bucket,
      numVideos: context.numVideos,
      aspectRatio: context.aspectRatio,
      duration: context.duration,
      outputDirectory: context.outputDirectory,
    });

    return {
      success: true,
      videos: result.paths,
      gcsUris: result.gcsUris,
      message: `Generated ${context.numVideos} video(s) from image`,
    };
  },
});
