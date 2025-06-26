/// <reference types="node" />
import { GoogleGenAI, Part } from '@google/genai';
import type { GeminiConfig, GenerationOptions, SearchResult } from '../types/index.js';
import { DEFAULT_MODEL, DEFAULT_TEMPERATURE, DEFAULT_MAX_TOKENS } from '../types/index.js';

export class GeminiClient {
  private genAI: GoogleGenAI;
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    if (!config.apiKey) {
      throw new Error('Gemini API key is required');
    }

    this.config = config;
    this.genAI = new GoogleGenAI({ apiKey: config.apiKey });
  }

  async generateText(options: GenerationOptions): Promise<string> {
    const parts: Part[] = [{ text: options.prompt }];

    // Add images as parts
    if (options.images && options.images.length > 0) {
      for (const image of options.images) {
        parts.push({
          inlineData: {
            mimeType: 'image/png',
            data: image.toString('base64'),
          },
        });
      }
    }

    // Add documents as parts
    if (options.documents && options.documents.length > 0) {
      for (const doc of options.documents) {
        if (doc.type === 'image') {
          parts.push({
            inlineData: {
              mimeType: doc.mimeType || 'image/png',
              data: (doc.content as Buffer).toString('base64'),
            },
          });
        } else if (doc.type === 'pdf') {
          parts.push({
            inlineData: {
              mimeType: 'application/pdf',
              data: (doc.content as Buffer).toString('base64'),
            },
          });
        } else if (doc.type === 'text') {
          parts.push({ text: doc.content as string });
        }
      }
    }

    // Use the models API to generate content
    const modelName = this.config.model || DEFAULT_MODEL;
    const response = await this.genAI.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction: options.systemPrompt ? { text: options.systemPrompt } : undefined,
        temperature: options.temperature ?? this.config.temperature ?? DEFAULT_TEMPERATURE,
        maxOutputTokens: options.maxTokens ?? this.config.maxTokens ?? DEFAULT_MAX_TOKENS,
      },
    });

    return response.text || '';
  }

  async searchWeb(query: string, numResults: number = 10): Promise<SearchResult[]> {
    // Use Gemini to search and format results
    const searchPrompt = `Search the web for: "${query}"
    
Return the top ${numResults} most relevant results in JSON format:
[
  {
    "title": "Page title",
    "url": "https://example.com",
    "snippet": "Brief description of the content"
  }
]

Only return the JSON array, no other text.`;

    const response = await this.generateText({
      prompt: searchPrompt,
      temperature: 0.3,
      maxTokens: 2048,
    });

    try {
      return JSON.parse(response) as SearchResult[];
    } catch (error) {
      console.error('Failed to parse search results:', error);
      return [];
    }
  }

  generateImage(_prompt: string): Promise<Buffer> {
    // Note: Gemini doesn't directly generate images via API
    // This would need to use a different service or return a placeholder
    return Promise.reject(
      new Error(
        'Image generation is not available via Gemini API. Please use the CLI version or configure a different image generation service.',
      ),
    );
  }

  generateVideo(_prompt: string): Promise<Buffer> {
    // Note: Gemini doesn't directly generate videos via API
    return Promise.reject(
      new Error(
        'Video generation is not available via Gemini API. Please use the CLI version or configure a different video generation service.',
      ),
    );
  }

  generatePdf(_content: string): Promise<Buffer> {
    // Note: Gemini doesn't directly generate PDFs via API
    return Promise.reject(
      new Error(
        'PDF generation is not available via Gemini API. Please use the CLI version or configure a different PDF generation service.',
      ),
    );
  }

  async analyzeDocument(document: Buffer, mimeType: string, prompt: string): Promise<string> {
    const parts: Part[] = [
      {
        inlineData: {
          mimeType,
          data: document.toString('base64'),
        },
      },
      { text: prompt },
    ];

    const modelName = this.config.model || DEFAULT_MODEL;
    const response = await this.genAI.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts }],
      config: {
        temperature: 0.3,
        maxOutputTokens: this.config.maxTokens ?? DEFAULT_MAX_TOKENS,
      },
    });

    return response.text || '';
  }
}
