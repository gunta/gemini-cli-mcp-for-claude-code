/// <reference types="node" />

export interface GeminiConfig {
  apiKey?: string;
  useCliPath?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export const DEFAULT_MODEL = 'gemini-2.0-flash-thinking-exp-1219';
export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_MAX_TOKENS = 8192;

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface DocumentContent {
  type: 'text' | 'image' | 'video' | 'pdf';
  content: string | Buffer;
  mimeType?: string;
}

export interface GenerationOptions {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  images?: Buffer[];
  documents?: DocumentContent[];
}
