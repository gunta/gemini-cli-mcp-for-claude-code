/// <reference types="node" />
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { GeminiCliWrapper } from '../utils/gemini-cli.js';

// Initialize CLI client
const config = {
  useCliPath: process.env.GEMINI_CLI_PATH,
};

const geminiCli = config.useCliPath ? new GeminiCliWrapper(config) : null;

export const generateVideoTool = createTool({
  id: 'gemini_generate_video',
  description: `Generate videos using Google Gemini (CAPABILITY NOT AVAILABLE IN CLAUDE).
  This is a unique Gemini capability that Claude completely lacks.
  Perfect for creating:
  • Explainer videos
  • Animated demonstrations
  • Short video clips from text descriptions
  Requires Gemini CLI to be configured.`,
  inputSchema: z.object({
    prompt: z.string().describe('The prompt for video generation'),
    duration: z
      .number()
      .min(1)
      .max(60)
      .optional()
      .default(5)
      .describe('Duration of the video in seconds'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'Video generation requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    const videoBuffer = await geminiCli.generateVideoLegacy(context.prompt, {
      duration: context.duration,
    });

    return {
      video: videoBuffer.toString('base64'),
    };
  },
});
