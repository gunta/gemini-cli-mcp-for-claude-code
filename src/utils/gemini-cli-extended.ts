/// <reference types="node" />
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import type {
  ImageGenerationOptions,
  VideoGenerationOptions,
  ImageToVideoOptions,
  AudioSynthesisOptions,
  MusicGenerationOptions,
  MediaInfo,
  ConvertOptions,
  VideoToGifOptions,
  CombineMediaOptions,
  OverlayOptions,
  ConcatenateOptions,
  VolumeOptions,
  LayerAudioOptions,
  ChirpVoice,
} from '../types/media.js';

export class GeminiCliExtended {
  private cliPath: string;

  constructor(cliPath: string) {
    this.cliPath = cliPath;
  }

  // Imagen 3 - Image Generation
  async generateImagen(
    options: ImageGenerationOptions,
  ): Promise<{ images: Buffer[]; paths?: string[] }> {
    const args = ['imagen', 't2i', '--prompt', options.prompt];

    if (options.model) args.push('--model', options.model);
    if (options.numImages) args.push('--num-images', options.numImages.toString());
    if (options.aspectRatio) args.push('--aspect-ratio', options.aspectRatio);
    if (options.gcsBucketUri) args.push('--gcs-bucket-uri', options.gcsBucketUri);
    if (options.outputDirectory) args.push('--output-directory', options.outputDirectory);

    const result = await this.executeCli(args);

    // Parse result based on output mode
    if (options.gcsBucketUri || options.outputDirectory) {
      return {
        images: [],
        paths: result
          .split('\n')
          .filter((line) => line.includes('Saved') || line.includes('gs://')),
      };
    }

    // Return base64 images
    const images: Buffer[] = [];
    const base64Images = result.split('\n').filter((line) => line.startsWith('data:image'));
    for (const b64 of base64Images) {
      const data = b64.split(',')[1];
      images.push(Buffer.from(data, 'base64'));
    }
    return { images };
  }

  // Veo 2 - Video Generation
  async generateVideo(
    options: VideoGenerationOptions,
  ): Promise<{ paths: string[]; gcsUris: string[] }> {
    const args = ['veo', 't2v', '--prompt', options.prompt, '--bucket', options.bucket];

    if (options.model) args.push('--model', options.model);
    if (options.numVideos) args.push('--num-videos', options.numVideos.toString());
    if (options.aspectRatio) args.push('--aspect-ratio', options.aspectRatio);
    if (options.duration) args.push('--duration', options.duration.toString());
    if (options.outputDirectory) args.push('--output-directory', options.outputDirectory);

    const result = await this.executeCli(args);

    // Parse GCS URIs and local paths from output
    const gcsUris = result.match(/gs:\/\/[^\s]+/g) || [];
    const paths = options.outputDirectory
      ? result.match(/Saved to: (.+)/g)?.map((m) => m.replace('Saved to: ', '')) || []
      : [];

    return { paths, gcsUris };
  }

  async imageToVideo(
    options: ImageToVideoOptions,
  ): Promise<{ paths: string[]; gcsUris: string[] }> {
    const args = ['veo', 'i2v', '--image-uri', options.imageUri, '--bucket', options.bucket];

    if (options.prompt) args.push('--prompt', options.prompt);
    if (options.mimeType) args.push('--mime-type', options.mimeType);
    if (options.model) args.push('--model', options.model);
    if (options.numVideos) args.push('--num-videos', options.numVideos.toString());
    if (options.aspectRatio) args.push('--aspect-ratio', options.aspectRatio);
    if (options.duration) args.push('--duration', options.duration.toString());
    if (options.outputDirectory) args.push('--output-directory', options.outputDirectory);

    const result = await this.executeCli(args);

    const gcsUris = result.match(/gs:\/\/[^\s]+/g) || [];
    const paths = options.outputDirectory
      ? result.match(/Saved to: (.+)/g)?.map((m) => m.replace('Saved to: ', '')) || []
      : [];

    return { paths, gcsUris };
  }

  // Chirp 3 HD - Audio Synthesis
  async synthesizeAudio(options: AudioSynthesisOptions): Promise<Buffer> {
    const args = ['chirp', 'tts', '--text', options.text];

    if (options.voiceName) args.push('--voice-name', options.voiceName);
    if (options.outputFilenamePrefix)
      args.push('--output-filename-prefix', options.outputFilenamePrefix);
    if (options.outputDirectory) args.push('--output-directory', options.outputDirectory);
    if (options.pronunciations) {
      for (const p of options.pronunciations) {
        args.push('--pronunciations', p);
      }
    }
    if (options.pronunciationEncoding)
      args.push('--pronunciation-encoding', options.pronunciationEncoding);

    const outputPath = path.join(os.tmpdir(), `chirp-${Date.now()}.wav`);
    args.push('--output', outputPath);

    await this.executeCli(args);
    const audioData = await fs.readFile(outputPath);
    await fs.unlink(outputPath).catch(() => {});

    return audioData;
  }

  async listChirpVoices(language: string): Promise<ChirpVoice[]> {
    const args = ['chirp', 'list-voices', '--language', language];
    const result = await this.executeCli(args);

    try {
      return JSON.parse(result) as ChirpVoice[];
    } catch {
      // Parse text output
      const voices: ChirpVoice[] = [];
      const lines = result.split('\n');
      for (const line of lines) {
        if (line.includes('Voice:')) {
          const match = line.match(/Voice: (.+) \((.+)\)/);
          if (match) {
            voices.push({
              name: match[1],
              languageCode: match[2],
              displayName: match[1],
            });
          }
        }
      }
      return voices;
    }
  }

  // Lyria - Music Generation
  async generateMusic(options: MusicGenerationOptions): Promise<Buffer> {
    const args = ['lyria', 'generate-music', '--prompt', options.prompt];

    if (options.negativePrompt) args.push('--negative-prompt', options.negativePrompt);
    if (options.seed) args.push('--seed', options.seed.toString());
    if (options.sampleCount) args.push('--sample-count', options.sampleCount.toString());
    if (options.outputGcsBucket) args.push('--output-gcs-bucket', options.outputGcsBucket);
    if (options.fileName) args.push('--file-name', options.fileName);
    if (options.localPath) args.push('--local-path', options.localPath);
    if (options.modelId) args.push('--model-id', options.modelId);

    const outputPath = path.join(os.tmpdir(), `lyria-${Date.now()}.wav`);
    args.push('--output', outputPath);

    await this.executeCli(args);
    const musicData = await fs.readFile(outputPath);
    await fs.unlink(outputPath).catch(() => {});

    return musicData;
  }

  // AVTool - Media Manipulation
  async getMediaInfo(inputFile: string): Promise<MediaInfo> {
    const args = ['avtool', 'ffmpeg-get-media-info', '--input-file', inputFile];
    const result = await this.executeCli(args);
    return JSON.parse(result) as MediaInfo;
  }

  async convertAudioToMp3(options: ConvertOptions): Promise<void> {
    const args = [
      'avtool',
      'ffmpeg-convert-audio-wav-to-mp3',
      '--input-file',
      options.inputPath,
      '--output-file',
      options.outputPath,
    ];
    await this.executeCli(args);
  }

  async videoToGif(options: VideoToGifOptions): Promise<void> {
    const args = [
      'avtool',
      'ffmpeg-video-to-gif',
      '--input-file',
      options.inputPath,
      '--output-file',
      options.outputPath,
    ];
    if (options.scaleWidthFactor)
      args.push('--scale-width-factor', options.scaleWidthFactor.toString());
    if (options.fps) args.push('--fps', options.fps.toString());
    await this.executeCli(args);
  }

  async combineAudioVideo(options: CombineMediaOptions): Promise<void> {
    const args = [
      'avtool',
      'ffmpeg-combine-audio-and-video',
      '--video-file',
      options.videoPath,
      '--audio-file',
      options.audioPath,
      '--output-file',
      options.outputPath,
    ];
    await this.executeCli(args);
  }

  async overlayImage(options: OverlayOptions): Promise<void> {
    const args = [
      'avtool',
      'ffmpeg-overlay-image-on-video',
      '--video-file',
      options.videoPath,
      '--image-file',
      options.imagePath,
      '--output-file',
      options.outputPath,
      '--x-coordinate',
      options.xCoordinate.toString(),
      '--y-coordinate',
      options.yCoordinate.toString(),
    ];
    await this.executeCli(args);
  }

  async concatenateMedia(options: ConcatenateOptions): Promise<void> {
    const args = ['avtool', 'ffmpeg-concatenate-media-files', '--output-file', options.outputPath];
    for (const input of options.inputPaths) {
      args.push('--input-files', input);
    }
    await this.executeCli(args);
  }

  async adjustVolume(options: VolumeOptions): Promise<void> {
    const args = [
      'avtool',
      'ffmpeg-adjust-volume',
      '--input-file',
      options.inputPath,
      '--output-file',
      options.outputPath,
      '--volume-db',
      options.volumeDb.toString(),
    ];
    await this.executeCli(args);
  }

  async layerAudio(options: LayerAudioOptions): Promise<void> {
    const args = ['avtool', 'ffmpeg-layer-audio-files', '--output-file', options.outputPath];
    for (const input of options.inputPaths) {
      args.push('--input-files', input);
    }
    await this.executeCli(args);
  }

  protected executeCli(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn(this.cliPath, args);
      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(`Gemini CLI failed with code ${code}: ${stderr}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }
}
