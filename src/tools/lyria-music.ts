/// <reference types="node" />
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { GeminiCliWrapper } from '../utils/gemini-cli.js';
import { LYRIA_DEFAULT_MODEL } from '../types/media.js';

// Initialize CLI client
const config = {
  useCliPath: process.env.GEMINI_CLI_PATH,
};

const geminiCli = config.useCliPath ? new GeminiCliWrapper(config) : null;

export const lyriaMusicTool = createTool({
  id: 'lyria_generate_music',
  description: `Generate professional music using Google's Lyria AI (CAPABILITY NOT AVAILABLE IN CLAUDE).
  Lyria creates high-quality, original music compositions from text descriptions.
  Perfect for:
  • Background music for videos
  • Ambient soundscapes
  • Genre-specific compositions
  • Mood-based musical pieces
  Outputs high-quality WAV audio files.`,
  inputSchema: z.object({
    prompt: z.string().describe('Text description of the music to generate'),
    negativePrompt: z.string().optional().describe('What to avoid in the music'),
    seed: z.number().optional().describe('Random seed for reproducibility'),
    sampleCount: z
      .number()
      .min(1)
      .max(10)
      .optional()
      .default(1)
      .describe('Number of samples to generate'),
    outputGcsBucket: z.string().optional().describe('GCS bucket for saving (gs://bucket-name)'),
    fileName: z.string().optional().describe('Custom filename for output'),
    localPath: z.string().optional().describe('Local directory for saving'),
    modelId: z.string().optional().default(LYRIA_DEFAULT_MODEL).describe('Lyria model version'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'Music generation requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    const musicBuffer = await geminiCli.generateMusic({
      prompt: context.prompt,
      negativePrompt: context.negativePrompt,
      seed: context.seed,
      sampleCount: context.sampleCount,
      outputGcsBucket: context.outputGcsBucket,
      fileName: context.fileName,
      localPath: context.localPath,
      modelId: context.modelId,
    });

    // If saving to GCS or local, return the path
    if (context.outputGcsBucket || context.localPath) {
      const path = context.outputGcsBucket
        ? `${context.outputGcsBucket}/${context.fileName || 'lyria_music.wav'}`
        : `${context.localPath}/${context.fileName || 'lyria_music.wav'}`;
      return {
        success: true,
        path,
        message: `Music generated and saved to ${path}`,
      };
    }

    // Otherwise return base64 audio
    return {
      audio: musicBuffer.toString('base64'),
      format: 'wav',
    };
  },
});
