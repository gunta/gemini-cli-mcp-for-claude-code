/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiCliWrapper } from './gemini-cli.js';
import type { GeminiConfig } from '../types/index.js';

// Mock child_process
vi.mock('child_process', () => ({
  spawn: vi.fn(() => ({
    stdout: {
      on: vi.fn((event, callback) => {
        if (event === 'data') {
          callback(Buffer.from('Mock CLI output'));
        }
      }),
    },
    stderr: {
      on: vi.fn(),
    },
    on: vi.fn((event, callback) => {
      if (event === 'close') {
        callback(0);
      }
    }),
  })),
}));

describe('GeminiCliWrapper', () => {
  let wrapper: GeminiCliWrapper;
  const mockConfig: GeminiConfig = {
    useCliPath: '/usr/local/bin/gemini',
    model: 'gemini-2.0-flash-thinking-exp-1219',
    temperature: 0.7,
    maxTokens: 8192,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = new GeminiCliWrapper(mockConfig);
  });

  describe('constructor', () => {
    it('should throw error if CLI path is not provided', () => {
      expect(() => new GeminiCliWrapper({ useCliPath: undefined })).toThrow(
        'Gemini CLI path is required',
      );
    });

    it('should create instance with valid config', () => {
      expect(wrapper).toBeInstanceOf(GeminiCliWrapper);
    });
  });

  describe('generateText', () => {
    it('should generate text with basic prompt', async () => {
      const result = await wrapper.generateText({
        prompt: 'Hello world',
      });

      expect(result).toBe('Mock CLI output');
    });

    it('should include model parameter when configured', async () => {
      const executeSpy = vi.spyOn(wrapper as any, 'executeCli');

      await wrapper.generateText({
        prompt: 'Test prompt',
      });

      expect(executeSpy).toHaveBeenCalledWith(
        expect.arrayContaining(['--model', 'gemini-2.0-flash-thinking-exp-1219']),
      );
    });

    it('should include temperature parameter', async () => {
      const executeSpy = vi.spyOn(wrapper as any, 'executeCli');

      await wrapper.generateText({
        prompt: 'Test prompt',
        temperature: 0.9,
      });

      expect(executeSpy).toHaveBeenCalledWith(expect.arrayContaining(['--temperature', '0.9']));
    });

    it('should handle images', async () => {
      const executeSpy = vi.spyOn(wrapper as any, 'executeCli');
      const imageBuffer = Buffer.from('fake image data');

      await wrapper.generateText({
        prompt: 'Describe this image',
        images: [imageBuffer],
      });

      expect(executeSpy).toHaveBeenCalledWith(expect.arrayContaining(['--image']));
    });

    it('should handle documents', async () => {
      const executeSpy = vi.spyOn(wrapper as any, 'executeCli');

      await wrapper.generateText({
        prompt: 'Analyze this document',
        documents: [
          {
            type: 'pdf',
            content: Buffer.from('fake pdf data'),
          },
        ],
      });

      expect(executeSpy).toHaveBeenCalledWith(expect.arrayContaining(['--file']));
    });
  });

  describe('searchWeb', () => {
    it('should search web with query', async () => {
      const result = await wrapper.searchWeb('test query');
      expect(result).toBe('Mock CLI output');
    });

    it('should include numResults parameter', async () => {
      const executeSpy = vi.spyOn(wrapper as any, 'executeCli');

      await wrapper.searchWeb('test query', { numResults: 5 });

      expect(executeSpy).toHaveBeenCalledWith(expect.arrayContaining(['--num-results', '5']));
    });
  });

  describe('generateImage', () => {
    it('should generate image with prompt', async () => {
      const result = await wrapper.generateImage('A beautiful sunset');
      expect(result).toBeInstanceOf(Buffer);
    });

    it('should include size parameter', async () => {
      const executeSpy = vi.spyOn(wrapper as any, 'executeCli');

      await wrapper.generateImage('A cat', { size: '1024x1024' });

      expect(executeSpy).toHaveBeenCalledWith(expect.arrayContaining(['--size', '1024x1024']));
    });
  });

  describe('generateVideoLegacy', () => {
    it('should generate video with prompt', async () => {
      const result = await wrapper.generateVideoLegacy('A flying bird');
      expect(result).toBeInstanceOf(Buffer);
    });

    it('should include duration parameter', async () => {
      const executeSpy = vi.spyOn(wrapper as any, 'executeCli');

      await wrapper.generateVideoLegacy('Animation', { duration: 10 });

      expect(executeSpy).toHaveBeenCalledWith(expect.arrayContaining(['--duration', '10']));
    });
  });

  describe('generatePdf', () => {
    it('should generate PDF with content', async () => {
      const result = await wrapper.generatePdf('# Hello World\nThis is a test');
      expect(result).toBeInstanceOf(Buffer);
    });

    it('should include template parameter', async () => {
      const executeSpy = vi.spyOn(wrapper as any, 'executeCli');

      await wrapper.generatePdf('Content', { template: 'invoice' });

      expect(executeSpy).toHaveBeenCalledWith(expect.arrayContaining(['--template', 'invoice']));
    });
  });
});
