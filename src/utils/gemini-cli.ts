/// <reference types="node" />
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import type { GeminiConfig, GenerationOptions } from '../types/index.js';
import { GeminiCliExtended } from './gemini-cli-extended.js';

export class GeminiCliWrapper extends GeminiCliExtended {
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    if (!config.useCliPath) {
      throw new Error('Gemini CLI path is required');
    }
    super(config.useCliPath);
    this.config = config;
  }

  async generateText(options: GenerationOptions): Promise<string> {
    const args = ['generate'];

    if (this.config.model) {
      args.push('--model', this.config.model);
    }

    if (options.temperature !== undefined) {
      args.push('--temperature', options.temperature.toString());
    } else if (this.config.temperature !== undefined) {
      args.push('--temperature', this.config.temperature.toString());
    }

    if (options.maxTokens !== undefined) {
      args.push('--max-tokens', options.maxTokens.toString());
    } else if (this.config.maxTokens !== undefined) {
      args.push('--max-tokens', this.config.maxTokens.toString());
    }

    if (options.systemPrompt) {
      args.push('--system', options.systemPrompt);
    }

    // Handle images
    if (options.images && options.images.length > 0) {
      for (const image of options.images) {
        const tempPath = path.join(os.tmpdir(), `gemini-image-${Date.now()}.png`);
        await fs.writeFile(tempPath, image);
        args.push('--image', tempPath);
      }
    }

    // Handle documents
    if (options.documents && options.documents.length > 0) {
      for (const doc of options.documents) {
        if (doc.type === 'pdf' || doc.type === 'image') {
          const ext = doc.type === 'pdf' ? 'pdf' : 'png';
          const tempPath = path.join(os.tmpdir(), `gemini-doc-${Date.now()}.${ext}`);
          await fs.writeFile(tempPath, doc.content);
          args.push('--file', tempPath);
        }
      }
    }

    args.push('--prompt', options.prompt);

    return this.executeCli(args);
  }

  async searchWeb(query: string, options?: { numResults?: number }): Promise<string> {
    const args = ['search', '--query', query];

    if (options?.numResults) {
      args.push('--num-results', options.numResults.toString());
    }

    return this.executeCli(args);
  }

  async generateImage(prompt: string, options?: { size?: string }): Promise<Buffer> {
    const args = ['generate-image', '--prompt', prompt];

    if (options?.size) {
      args.push('--size', options.size);
    }

    const outputPath = path.join(os.tmpdir(), `gemini-output-${Date.now()}.png`);
    args.push('--output', outputPath);

    await this.executeCli(args);
    const imageData = await fs.readFile(outputPath);
    await fs.unlink(outputPath).catch(() => {}); // Clean up

    return imageData;
  }

  async generateVideoLegacy(prompt: string, options?: { duration?: number }): Promise<Buffer> {
    const args = ['generate-video', '--prompt', prompt];

    if (options?.duration) {
      args.push('--duration', options.duration.toString());
    }

    const outputPath = path.join(os.tmpdir(), `gemini-output-${Date.now()}.mp4`);
    args.push('--output', outputPath);

    await this.executeCli(args);
    const videoData = await fs.readFile(outputPath);
    await fs.unlink(outputPath).catch(() => {}); // Clean up

    return videoData;
  }

  async generatePdf(content: string, options?: { template?: string }): Promise<Buffer> {
    const args = ['generate-pdf', '--content', content];

    if (options?.template) {
      args.push('--template', options.template);
    }

    const outputPath = path.join(os.tmpdir(), `gemini-output-${Date.now()}.pdf`);
    args.push('--output', outputPath);

    await this.executeCli(args);
    const pdfData = await fs.readFile(outputPath);
    await fs.unlink(outputPath).catch(() => {}); // Clean up

    return pdfData;
  }

  // Remove duplicate executeCli method since it's now in the parent class
}
