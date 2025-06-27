/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiCliExtended } from './gemini-cli-extended.js';
import type {
  ImageGenerationOptions,
  VideoGenerationOptions,
  AudioSynthesisOptions,
  MusicGenerationOptions,
} from '../types/media.js';

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

describe('GeminiCliExtended', () => {
  let cli: GeminiCliExtended;
  const mockCliPath = '/usr/local/bin/gemini';

  beforeEach(() => {
    vi.clearAllMocks();
    cli = new GeminiCliExtended(mockCliPath);
  });

  describe('generateImagen', () => {
    it('should generate images with Imagen 3', async () => {
      const options: ImageGenerationOptions = {
        prompt: 'A beautiful landscape',
        numImages: 2,
        aspectRatio: '16:9',
      };

      const result = await cli.generateImagen(options);
      expect(result).toHaveProperty('images');
      expect(result.images).toBeInstanceOf(Array);
    });

    it('should handle GCS bucket output', async () => {
      const options: ImageGenerationOptions = {
        prompt: 'A sunset',
        gcsBucketUri: 'gs://my-bucket',
      };

      const result = await cli.generateImagen(options);
      expect(result).toHaveProperty('paths');
      expect(result.images).toHaveLength(0);
    });
  });

  describe('generateVideo', () => {
    it('should generate video with Veo 2', async () => {
      const options: VideoGenerationOptions = {
        prompt: 'A flying bird',
        bucket: 'my-bucket',
        duration: 8,
        aspectRatio: '16:9',
      };

      const result = await cli.generateVideo(options);
      expect(result).toHaveProperty('paths');
      expect(result).toHaveProperty('gcsUris');
    });

    it('should include all optional parameters', async () => {
      const executeSpy = vi.spyOn(cli as any, 'executeCli');

      const options: VideoGenerationOptions = {
        prompt: 'Test video',
        bucket: 'test-bucket',
        model: 'veo-3.0-preview',
        numVideos: 3,
        outputDirectory: '/tmp/videos',
      };

      await cli.generateVideo(options);

      expect(executeSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          '--model',
          'veo-3.0-preview',
          '--num-videos',
          '3',
          '--output-directory',
          '/tmp/videos',
        ]),
      );
    });
  });

  describe('imageToVideo', () => {
    it('should convert image to video', async () => {
      const result = await cli.imageToVideo({
        imageUri: 'gs://bucket/image.jpg',
        bucket: 'output-bucket',
        prompt: 'Make it move',
      });

      expect(result).toHaveProperty('paths');
      expect(result).toHaveProperty('gcsUris');
    });
  });

  describe('synthesizeAudio', () => {
    it('should synthesize audio with Chirp 3 HD', async () => {
      const options: AudioSynthesisOptions = {
        text: 'Hello, world!',
        voiceName: 'en-US-Chirp3-HD-Zephyr',
      };

      const result = await cli.synthesizeAudio(options);
      expect(result).toBeInstanceOf(Buffer);
    });

    it('should handle pronunciations', async () => {
      const executeSpy = vi.spyOn(cli as any, 'executeCli');

      const options: AudioSynthesisOptions = {
        text: 'Test text',
        pronunciations: ['word=wɜrd', 'test=tɛst'],
        pronunciationEncoding: 'ipa',
      };

      await cli.synthesizeAudio(options);

      expect(executeSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          '--pronunciations',
          'word=wɜrd',
          '--pronunciations',
          'test=tɛst',
          '--pronunciation-encoding',
          'ipa',
        ]),
      );
    });
  });

  describe('listChirpVoices', () => {
    it('should list available voices', async () => {
      vi.spyOn(cli as any, 'executeCli').mockResolvedValueOnce(
        JSON.stringify([
          {
            name: 'en-US-Chirp3-HD-Zephyr',
            languageCode: 'en-US',
            displayName: 'Zephyr',
          },
        ]),
      );

      const voices = await cli.listChirpVoices('en-US');
      expect(voices).toHaveLength(1);
      expect(voices[0]).toHaveProperty('name', 'en-US-Chirp3-HD-Zephyr');
    });

    it('should parse text output fallback', async () => {
      vi.spyOn(cli as any, 'executeCli').mockResolvedValueOnce(
        'Voice: en-US-Chirp3-HD-Zephyr (en-US)\nVoice: en-US-Chirp3-HD-Aurora (en-US)',
      );

      const voices = await cli.listChirpVoices('en-US');
      expect(voices).toHaveLength(2);
    });
  });

  describe('generateMusic', () => {
    it('should generate music with Lyria', async () => {
      const options: MusicGenerationOptions = {
        prompt: 'Upbeat electronic dance music',
        negativePrompt: 'slow, sad',
        seed: 42,
      };

      const result = await cli.generateMusic(options);
      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe('AVTool methods', () => {
    it('should get media info', async () => {
      vi.spyOn(cli as any, 'executeCli').mockResolvedValueOnce(
        JSON.stringify({
          streams: [{ codec_type: 'video' }],
          format: { duration: '60.0' },
        }),
      );

      const info = await cli.getMediaInfo('/path/to/video.mp4');
      expect(info).toHaveProperty('streams');
      expect(info).toHaveProperty('format');
    });

    it('should convert audio to MP3', async () => {
      await expect(
        cli.convertAudioToMp3({
          inputPath: '/input.wav',
          outputPath: '/output.mp3',
        }),
      ).resolves.toBeUndefined();
    });

    it('should create GIF from video', async () => {
      const executeSpy = vi.spyOn(cli as any, 'executeCli');

      await cli.videoToGif({
        inputPath: '/video.mp4',
        outputPath: '/output.gif',
        scaleWidthFactor: 0.5,
        fps: 15,
      });

      expect(executeSpy).toHaveBeenCalledWith(
        expect.arrayContaining(['--scale-width-factor', '0.5', '--fps', '15']),
      );
    });

    it('should combine audio and video', async () => {
      await expect(
        cli.combineAudioVideo({
          videoPath: '/video.mp4',
          audioPath: '/audio.wav',
          outputPath: '/output.mp4',
        }),
      ).resolves.toBeUndefined();
    });

    it('should overlay image on video', async () => {
      await expect(
        cli.overlayImage({
          videoPath: '/video.mp4',
          imagePath: '/logo.png',
          outputPath: '/output.mp4',
          xCoordinate: 10,
          yCoordinate: 10,
        }),
      ).resolves.toBeUndefined();
    });

    it('should concatenate media files', async () => {
      await expect(
        cli.concatenateMedia({
          inputPaths: ['/video1.mp4', '/video2.mp4'],
          outputPath: '/output.mp4',
        }),
      ).resolves.toBeUndefined();
    });

    it('should adjust volume', async () => {
      await expect(
        cli.adjustVolume({
          inputPath: '/audio.wav',
          outputPath: '/output.wav',
          volumeDb: -3,
        }),
      ).resolves.toBeUndefined();
    });

    it('should layer audio files', async () => {
      await expect(
        cli.layerAudio({
          inputPaths: ['/audio1.wav', '/audio2.wav'],
          outputPath: '/mixed.wav',
        }),
      ).resolves.toBeUndefined();
    });
  });

  describe('executeCli', () => {
    it('should handle CLI errors', async () => {
      const { spawn } = await import('child_process');
      const mockSpawn = spawn as unknown as ReturnType<typeof vi.fn>;
      mockSpawn.mockReturnValueOnce({
        stdout: { on: vi.fn() },
        stderr: {
          on: vi.fn((event, callback) => {
            if (event === 'data') callback(Buffer.from('Error message'));
          }),
        },
        on: vi.fn((event, callback) => {
          if (event === 'close') callback(1);
        }),
      });

      await expect(cli['executeCli'](['bad-command'])).rejects.toThrow(
        'Gemini CLI failed with code 1',
      );
    });
  });
});
