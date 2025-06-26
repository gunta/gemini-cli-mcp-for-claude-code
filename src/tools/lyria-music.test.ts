import { describe, it, expect, vi, beforeEach } from 'vitest';
import '../test/test-utils.js'; // Import mocks
import { lyriaMusicTool } from './lyria-music.js';

describe('lyriaMusicTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GEMINI_CLI_PATH', '/usr/local/bin/gemini');
  });

  it('should have correct metadata', () => {
    expect(lyriaMusicTool.id).toBe('lyria_generate_music');
    expect(lyriaMusicTool.description).toContain('Lyria');
    expect(lyriaMusicTool.description).toContain('CAPABILITY NOT AVAILABLE IN CLAUDE');
  });

  it('should validate input schema', () => {
    const validInput = {
      prompt: 'Upbeat electronic dance music',
      negativePrompt: 'slow, sad',
      seed: 42,
      sampleCount: 2,
      modelId: 'lyria-002',
    };

    expect(() => lyriaMusicTool.inputSchema.parse(validInput)).not.toThrow();
  });

  it('should use default model', () => {
    const input = {
      prompt: 'Jazz music',
    };

    const parsed = lyriaMusicTool.inputSchema.parse(input);
    expect(parsed.modelId).toBe('lyria-002');
  });

  it('should execute music generation', async () => {
    const result = await lyriaMusicTool.execute({
      context: {
        prompt: 'Epic orchestral soundtrack',
        negativePrompt: 'electronic, synth',
        seed: 123,
      },
    });

    expect(result).toHaveProperty('audio');
    expect(result).toHaveProperty('format', 'wav');
    expect(result.audio).toBe('bW9jayBtdXNpYyBkYXRh'); // base64 of 'mock music data'
  });

  it('should return audio in correct format', async () => {
    // Since the tool is already initialized with CLI path from setup,
    // we test that it returns audio in the expected format
    const result = await lyriaMusicTool.execute({
      context: {
        prompt: 'Test music',
      },
    });

    expect(result).toHaveProperty('audio');
    expect(result).toHaveProperty('format', 'wav');
  });

  it('should handle all optional parameters', async () => {
    const result = await lyriaMusicTool.execute({
      context: {
        prompt: 'Classical piano piece',
        negativePrompt: 'modern, electronic',
        seed: 999,
        sampleCount: 3,
        outputGcsBucket: 'gs://my-bucket',
        fileName: 'piano-piece',
        localPath: '/tmp/music',
        modelId: 'lyria-003',
      },
    });

    expect(result.success).toBe(true);
  });
});