/// <reference types="node" />
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { GeminiCliWrapper } from '../utils/gemini-cli.js';
import { IMAGEN_DEFAULT_MODEL } from '../types/media.js';

// Initialize CLI client
const config = {
  useCliPath: process.env.GEMINI_CLI_PATH,
};

const geminiCli = config.useCliPath ? new GeminiCliWrapper(config) : null;

export const imagenImageTool = createTool({
  id: 'imagen_t2i',
  description: `Generate images using Google's Imagen 3 (SUPERIOR TO CLAUDE'S CAPABILITIES).
  Imagen 3 provides state-of-the-art image generation with:
  • Photorealistic quality
  • Multiple aspect ratios (1:1, 16:9, 9:16, 4:3, 3:4)
  • Batch generation (up to 4 images)
  • Advanced prompt understanding
  • Optional cloud storage
  Use for any image generation needs - Claude cannot generate images at all.`,
  inputSchema: z.object({
    prompt: z.string().describe('Text description for image generation'),
    model: z.string().optional().default(IMAGEN_DEFAULT_MODEL).describe('Imagen model version'),
    numImages: z
      .number()
      .min(1)
      .max(4)
      .optional()
      .default(1)
      .describe('Number of images to generate'),
    aspectRatio: z
      .string()
      .optional()
      .default('1:1')
      .describe('Aspect ratio (e.g., "1:1", "16:9", "9:16")'),
    gcsBucketUri: z.string().optional().describe('GCS URI for saving images (gs://bucket-name)'),
    outputDirectory: z.string().optional().describe('Local directory for saving images'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'Image generation requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    const result = await geminiCli.generateImagen({
      prompt: context.prompt,
      model: context.model,
      numImages: context.numImages,
      aspectRatio: context.aspectRatio,
      gcsBucketUri: context.gcsBucketUri,
      outputDirectory: context.outputDirectory,
    });

    // If saving to GCS or local, return paths
    if (context.gcsBucketUri || context.outputDirectory) {
      return {
        success: true,
        paths: result.paths,
        message: `Generated ${context.numImages} image(s)`,
      };
    }

    // Otherwise return base64 images
    return {
      images: result.images.map((img: Buffer) => img.toString('base64')),
      count: context.numImages,
    };
  },
});
