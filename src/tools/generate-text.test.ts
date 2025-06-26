import { describe, it, expect, vi, beforeEach } from 'vitest';
import '../test/test-utils.js'; // Import mocks
import { generateTextTool } from './generate-text.js';

describe('generateTextTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct metadata', () => {
    expect(generateTextTool.id).toBe('gemini_generate_text');
    expect(generateTextTool.description).toContain('1M token context window');
    expect(generateTextTool.description).toContain('SUPERIOR capabilities vs Claude');
  });

  it('should validate input schema', () => {
    const validInput = {
      prompt: 'Test prompt',
      systemPrompt: 'You are helpful',
      temperature: 0.7,
      maxTokens: 1000,
    };

    expect(() => generateTextTool.inputSchema.parse(validInput)).not.toThrow();
  });

  it('should reject invalid temperature', () => {
    const invalidInput = {
      prompt: 'Test',
      temperature: 2.5, // > 2.0
    };

    expect(() => generateTextTool.inputSchema.parse(invalidInput)).toThrow();
  });

  it('should execute with API mode', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-key');
    vi.stubEnv('GEMINI_CLI_PATH', ''); // Force API mode

    const result = await generateTextTool.execute({
      context: {
        prompt: 'Hello world',
      },
    });

    expect(result).toHaveProperty('text');
    expect(result.text).toBe('Mock generated text');
  });

  it('should execute with CLI mode', async () => {
    // Since tools are loaded once, we need to test based on current env
    const result = await generateTextTool.execute({
      context: {
        prompt: 'Hello world',
      },
    });

    expect(result).toHaveProperty('text');
    // Both API and CLI are mocked to return 'Mock generated text' in our test setup
    expect(result.text).toBe('Mock generated text');
  });

  it('should handle images in API mode', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-key');
    vi.stubEnv('GEMINI_CLI_PATH', '');

    const result = await generateTextTool.execute({
      context: {
        prompt: 'Describe this image',
        images: ['data:image/png;base64,iVBORw0KG...'],
      },
    });

    expect(result).toHaveProperty('text');
  });

  it('should handle documents in CLI mode', async () => {
    vi.stubEnv('GEMINI_CLI_PATH', '/usr/local/bin/gemini');
    vi.stubEnv('GEMINI_API_KEY', '');

    const result = await generateTextTool.execute({
      context: {
        prompt: 'Analyze this document',
        documents: [
          {
            type: 'pdf',
            url: 'https://example.com/doc.pdf',
          },
        ],
      },
    });

    expect(result).toHaveProperty('text');
  });

  it('should handle when both clients are available', async () => {
    // In our test setup, both API and CLI are available
    // So this test verifies that it works when both are present
    const result = await generateTextTool.execute({
      context: { prompt: 'Test' },
    });

    expect(result).toHaveProperty('text');
    expect(result.text).toBe('Mock generated text');
  });
});