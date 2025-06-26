/// <reference types="node" />
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { GeminiCliWrapper } from '../utils/gemini-cli.js';

// Initialize CLI client
const config = {
  useCliPath: process.env.GEMINI_CLI_PATH,
};

const geminiCli = config.useCliPath ? new GeminiCliWrapper(config) : null;

export const generatePdfTool = createTool({
  id: 'gemini_generate_pdf',
  description: `Generate PDF documents using Google Gemini (CAPABILITY NOT AVAILABLE IN CLAUDE).
  Transform text content into professionally formatted PDFs.
  Perfect for:
  • Reports and documentation
  • Articles and whitepapers
  • Presentations
  Requires Gemini CLI to be configured.`,
  inputSchema: z.object({
    content: z.string().describe('The text content to convert to PDF'),
    template: z
      .enum(['report', 'article', 'presentation'])
      .optional()
      .default('report')
      .describe('PDF template style'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'PDF generation requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    const pdfBuffer = await geminiCli.generatePdf(context.content, {
      template: context.template,
    });

    return {
      pdf: pdfBuffer.toString('base64'),
    };
  },
});
