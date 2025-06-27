import { vi } from 'vitest';

export const mockGeminiClient = {
  generateText: vi.fn(() => Promise.resolve('Mock generated text')),
};

export const mockGeminiCliWrapper = {
  generateText: vi.fn(() => Promise.resolve('Mock generated text')), // Changed to match client output
  searchWeb: vi.fn(() => Promise.resolve('Mock search results')),
  generateImage: vi.fn(() => Promise.resolve(Buffer.from('mock image data'))),
  generateVideoLegacy: vi.fn(() => Promise.resolve(Buffer.from('mock video data'))),
  generatePdf: vi.fn(() => Promise.resolve(Buffer.from('mock pdf data'))),
  generateImagen: vi.fn(() =>
    Promise.resolve({
      images: [Buffer.from('mock image')],
      paths: [],
    }),
  ),
  generateVideo: vi.fn(() =>
    Promise.resolve({
      paths: ['video.mp4'],
      gcsUris: ['gs://bucket/video.mp4'],
    }),
  ),
  imageToVideo: vi.fn(() =>
    Promise.resolve({
      paths: ['video.mp4'],
      gcsUris: ['gs://bucket/video.mp4'],
    }),
  ),
  synthesizeAudio: vi.fn(() => Promise.resolve(Buffer.from('mock audio data'))),
  listChirpVoices: vi.fn(() =>
    Promise.resolve([
      {
        name: 'en-US-Chirp3-HD-Zephyr',
        languageCode: 'en-US',
        displayName: 'Zephyr',
      },
    ]),
  ),
  generateMusic: vi.fn(() => Promise.resolve(Buffer.from('mock music data'))),
  getMediaInfo: vi.fn(() =>
    Promise.resolve({
      streams: [{ codec_type: 'video' }],
      format: { duration: '60.0' },
    }),
  ),
  convertAudioToMp3: vi.fn(() => Promise.resolve()),
  videoToGif: vi.fn(() => Promise.resolve()),
  combineAudioVideo: vi.fn(() => Promise.resolve()),
  overlayImage: vi.fn(() => Promise.resolve()),
  concatenateMedia: vi.fn(() => Promise.resolve()),
  adjustVolume: vi.fn(() => Promise.resolve()),
  layerAudio: vi.fn(() => Promise.resolve()),
};

// Only mock if not running in Bun test environment
if (typeof Bun === 'undefined') {
  // Mock the constructors for Vitest
  vi.mock('../utils/gemini-client.js', () => ({
    GeminiClient: vi.fn(() => mockGeminiClient),
  }));

  vi.mock('../utils/gemini-cli.js', () => ({
    GeminiCliWrapper: vi.fn(() => mockGeminiCliWrapper),
  }));
}
