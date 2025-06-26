/// <reference types="node" />
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { GeminiCliWrapper } from '../utils/gemini-cli.js';

// Initialize CLI client
const config = {
  useCliPath: process.env.GEMINI_CLI_PATH,
};

const geminiCli = config.useCliPath ? new GeminiCliWrapper(config) : null;

export const generateImageTool = createTool({
  id: 'gemini_generate_image',
  description: `Generate images using Google Gemini (CAPABILITY NOT AVAILABLE IN CLAUDE).
  This uses Gemini's image generation capabilities which Claude completely lacks.
  Requires Gemini CLI to be configured.`,
  inputSchema: z.object({
    prompt: z.string().describe('The prompt for image generation'),
    size: z
      .enum(['256x256', '512x512', '1024x1024'])
      .optional()
      .default('512x512')
      .describe('Size of the generated image'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'Image generation requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    const imageBuffer = await geminiCli.generateImage(context.prompt, {
      size: context.size,
    });

    return {
      image: imageBuffer.toString('base64'),
    };
  },
});
