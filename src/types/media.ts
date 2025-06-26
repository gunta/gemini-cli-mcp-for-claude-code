/// <reference types="node" />

// Imagen 3 Types
export interface ImageGenerationOptions {
  prompt: string;
  model?: string;
  numImages?: number;
  aspectRatio?: string;
  outputDirectory?: string;
  gcsBucketUri?: string;
}

// Veo 2 Types
export interface VideoGenerationOptions {
  prompt: string;
  model?: string;
  bucket: string;
  numVideos?: number;
  aspectRatio?: string;
  duration?: number;
  outputDirectory?: string;
}

export interface ImageToVideoOptions extends Omit<VideoGenerationOptions, 'prompt'> {
  imageUri: string;
  mimeType?: string;
  prompt?: string; // Optional for i2v
}

// Chirp 3 HD Types
export interface AudioSynthesisOptions {
  text: string;
  voiceName?: string;
  outputFilenamePrefix?: string;
  outputDirectory?: string;
  pronunciations?: string[];
  pronunciationEncoding?: 'ipa' | 'xsampa';
}

export interface ChirpVoice {
  name: string;
  languageCode: string;
  displayName: string;
  description?: string;
}

// Lyria Types
export interface MusicGenerationOptions {
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  sampleCount?: number;
  outputGcsBucket?: string;
  fileName?: string;
  localPath?: string;
  modelId?: string;
}

// AVTool Types
export interface MediaInfo {
  streams: Array<{
    index: number;
    codec_name?: string;
    codec_type?: string;
    width?: number;
    height?: number;
    duration?: string;
    bit_rate?: string;
    [key: string]: unknown;
  }>;
  format: {
    duration?: string;
    size?: string;
    bit_rate?: string;
    [key: string]: unknown;
  };
}

export interface ConvertOptions {
  inputPath: string;
  outputPath: string;
}

export interface VideoToGifOptions extends ConvertOptions {
  scaleWidthFactor?: number;
  fps?: number;
}

export interface CombineMediaOptions {
  videoPath: string;
  audioPath: string;
  outputPath: string;
}

export interface OverlayOptions {
  videoPath: string;
  imagePath: string;
  outputPath: string;
  xCoordinate: number;
  yCoordinate: number;
}

export interface ConcatenateOptions {
  inputPaths: string[];
  outputPath: string;
}

export interface VolumeOptions extends ConvertOptions {
  volumeDb: number;
}

// LayerAudioOptions uses same structure as ConcatenateOptions
export type LayerAudioOptions = ConcatenateOptions;

// Model defaults
export const IMAGEN_DEFAULT_MODEL = 'imagen-3.0-generate-002';
export const VEO_DEFAULT_MODEL = 'veo-2.0-generate-001';
export const CHIRP_DEFAULT_VOICE = 'en-US-Chirp3-HD-Zephyr';
export const LYRIA_DEFAULT_MODEL = 'lyria-002';
