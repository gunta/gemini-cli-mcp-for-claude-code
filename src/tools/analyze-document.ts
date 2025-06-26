/// <reference types="node" />
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { GeminiClient } from '../utils/gemini-client.js';
import { GeminiCliWrapper } from '../utils/gemini-cli.js';
import { DEFAULT_MODEL } from '../types/index.js';
import type { DocumentContent } from '../types/index.js';

// Initialize clients
const config = {
  apiKey: process.env.GEMINI_API_KEY,
  useCliPath: process.env.GEMINI_CLI_PATH,
  model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
};

const geminiClient = config.apiKey ? new GeminiClient(config) : null;
const geminiCli = config.useCliPath ? new GeminiCliWrapper(config) : null;

export const analyzeDocumentTool = createTool({
  id: 'gemini_analyze_document',
  description: `Analyze documents using Gemini's SUPERIOR document understanding (vs Claude).
  Gemini excels at:
  • PDF analysis with layout understanding
  • Complex table extraction
  • Multi-page document comprehension
  • Image-based documents (scanned PDFs, photos)
  • 1M token context for huge documents
  Use this when Claude struggles with document complexity or size.`,
  inputSchema: z.object({
    document: z.string().describe('Base64 encoded document content'),
    mimeType: z
      .string()
      .describe('MIME type of the document (e.g., application/pdf, image/png, text/plain)'),
    prompt: z.string().describe('Analysis prompt - what to extract or analyze from the document'),
  }),
  execute: async ({ context }) => {
    const documentBuffer = Buffer.from(context.document, 'base64');

    if (geminiClient) {
      const analysis = await geminiClient.analyzeDocument(
        documentBuffer,
        context.mimeType,
        context.prompt,
      );
      return { analysis };
    } else if (geminiCli) {
      // Determine document type from MIME type
      let docType: DocumentContent['type'] = 'text';
      if (context.mimeType.startsWith('image/')) {
        docType = 'image';
      } else if (context.mimeType === 'application/pdf') {
        docType = 'pdf';
      }

      const result = await geminiCli.generateText({
        prompt: context.prompt,
        documents: [
          {
            type: docType,
            content: documentBuffer,
            mimeType: context.mimeType,
          },
        ],
      });

      return { analysis: result };
    } else {
      throw new Error('No Gemini client available. Set GEMINI_API_KEY or GEMINI_CLI_PATH.');
    }
  },
});
