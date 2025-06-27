import { vi } from 'vitest';

// Check if running in Bun
const isBun = typeof Bun !== 'undefined';

if (!isBun) {
  // Set up global test environment for Vitest
  vi.stubGlobal('process', {
    ...process,
    env: {
      ...process.env,
      GEMINI_API_KEY: 'test-api-key',
      GEMINI_CLI_PATH: '/usr/local/bin/gemini',
      GEMINI_MODEL: 'gemini-2.0-flash-thinking-exp-1219',
      GEMINI_TEMPERATURE: '0.7',
      GEMINI_MAX_TOKENS: '8192',
    },
  });

  // Mock fs promises for file operations
  vi.mock('fs', () => ({
    promises: {
      readFile: vi.fn(() => Promise.resolve(Buffer.from('mock file content'))),
      writeFile: vi.fn(() => Promise.resolve()),
      unlink: vi.fn(() => Promise.resolve()),
    },
  }));

  // Mock Google Generative AI
  vi.mock('@google/genai', () => ({
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn(() => ({
        generateContent: vi.fn(() =>
          Promise.resolve({
            response: {
              text: () => 'Mock generated text',
            },
          }),
        ),
      })),
    })),
  }));
} else {
  // For Bun, set environment variables directly
  process.env.GEMINI_API_KEY = 'test-api-key';
  process.env.GEMINI_CLI_PATH = '/usr/local/bin/gemini';
  process.env.GEMINI_MODEL = 'gemini-2.0-flash-thinking-exp-1219';
  process.env.GEMINI_TEMPERATURE = '0.7';
  process.env.GEMINI_MAX_TOKENS = '8192';
}
