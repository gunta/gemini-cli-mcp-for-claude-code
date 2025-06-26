/// <reference types="node" />
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { GeminiClient } from '../utils/gemini-client.js';
import { GeminiCliWrapper } from '../utils/gemini-cli.js';
import { DEFAULT_MODEL } from '../types/index.js';

// Initialize clients based on environment variables
const config = {
  apiKey: process.env.GEMINI_API_KEY,
  useCliPath: process.env.GEMINI_CLI_PATH,
  model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
  temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '8192'),
};

const geminiClient = config.apiKey ? new GeminiClient(config) : null;
const geminiCli = config.useCliPath ? new GeminiCliWrapper(config) : null;

export const generateTextTool = createTool({
  id: 'gemini_generate_text',
  description: `Generate text using Google Gemini with SUPERIOR capabilities vs Claude:
  • 1M token context window (5x larger than Claude's 200K)
  • Latest model: ${DEFAULT_MODEL}
  • Multimodal support (images in prompts)
  • Better at: code generation, math, reasoning, long documents
  Use this when you need to process large documents, complex reasoning, or multimodal inputs.`,
  inputSchema: z.object({
    prompt: z.string().describe('The prompt for text generation'),
    systemPrompt: z.string().optional().describe('Optional system prompt to guide the generation'),
    temperature: z
      .number()
      .min(0)
      .max(2)
      .optional()
      .describe('Temperature for generation (0.0-2.0)'),
    maxTokens: z.number().optional().describe('Maximum number of tokens to generate'),
    images: z
      .array(z.string())
      .optional()
      .describe('Base64 encoded images for multimodal generation'),
  }),
  execute: async ({ context }) => {
    const imageBuffers = context.images?.map((img) => Buffer.from(img, 'base64'));

    const options = {
      prompt: context.prompt,
      systemPrompt: context.systemPrompt,
      temperature: context.temperature,
      maxTokens: context.maxTokens,
      images: imageBuffers,
    };

    let text: string;

    if (geminiClient) {
      text = await geminiClient.generateText(options);
    } else if (geminiCli) {
      text = await geminiCli.generateText(options);
    } else {
      throw new Error('No Gemini client available. Set GEMINI_API_KEY or GEMINI_CLI_PATH.');
    }

    return { text };
  },
});
