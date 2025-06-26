/// <reference types="node" />
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { GeminiCliWrapper } from '../utils/gemini-cli.js';

// Initialize CLI client
const config = {
  useCliPath: process.env.GEMINI_CLI_PATH,
};

const geminiCli = config.useCliPath ? new GeminiCliWrapper(config) : null;

export const ffmpegGetMediaInfoTool = createTool({
  id: 'ffmpeg_get_media_info',
  description: `Extract detailed metadata from audio/video files.
  Returns comprehensive information about:
  • Streams (video, audio, subtitles)
  • Codecs and formats
  • Duration, bitrate, resolution
  • All technical metadata`,
  inputSchema: z.object({
    inputFile: z.string().describe('Path to media file (local or gs://)'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'AVTool requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    const info = await geminiCli.getMediaInfo(context.inputFile);
    return info;
  },
});

export const ffmpegConvertAudioTool = createTool({
  id: 'ffmpeg_convert_audio_wav_to_mp3',
  description: `Convert WAV audio files to MP3 format.
  • Preserves audio quality
  • Reduces file size significantly
  • Uses libmp3lame codec
  • Supports both local and GCS paths`,
  inputSchema: z.object({
    inputFile: z.string().describe('Input WAV file path'),
    outputFile: z.string().describe('Output MP3 file path'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'AVTool requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    await geminiCli.convertAudioToMp3({
      inputPath: context.inputFile,
      outputPath: context.outputFile,
    });

    return {
      success: true,
      outputPath: context.outputFile,
      message: 'Audio converted to MP3 successfully',
    };
  },
});

export const ffmpegVideoToGifTool = createTool({
  id: 'ffmpeg_video_to_gif',
  description: `Create high-quality animated GIFs from videos.
  • Two-pass process with palette generation
  • Adjustable scale and frame rate
  • Optimized file size
  • Perfect for creating shareable animations`,
  inputSchema: z.object({
    inputFile: z.string().describe('Input video file path'),
    outputFile: z.string().describe('Output GIF file path'),
    scaleWidthFactor: z
      .number()
      .min(0.1)
      .max(1)
      .optional()
      .default(0.33)
      .describe('Scale factor (0.33 = 1/3 width)'),
    fps: z.number().min(1).max(50).optional().default(15).describe('Frames per second'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'AVTool requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    await geminiCli.videoToGif({
      inputPath: context.inputFile,
      outputPath: context.outputFile,
      scaleWidthFactor: context.scaleWidthFactor,
      fps: context.fps,
    });

    return {
      success: true,
      outputPath: context.outputFile,
      message: `GIF created at ${context.fps} fps, ${context.scaleWidthFactor * 100}% scale`,
    };
  },
});

export const ffmpegCombineAudioVideoTool = createTool({
  id: 'ffmpeg_combine_audio_and_video',
  description: `Merge separate audio and video files into one.
  • Preserves video quality
  • Syncs audio with video
  • Uses shortest duration
  • Essential for post-production`,
  inputSchema: z.object({
    videoFile: z.string().describe('Input video file path'),
    audioFile: z.string().describe('Input audio file path'),
    outputFile: z.string().describe('Output combined file path'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'AVTool requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    await geminiCli.combineAudioVideo({
      videoPath: context.videoFile,
      audioPath: context.audioFile,
      outputPath: context.outputFile,
    });

    return {
      success: true,
      outputPath: context.outputFile,
      message: 'Audio and video combined successfully',
    };
  },
});

export const ffmpegOverlayImageTool = createTool({
  id: 'ffmpeg_overlay_image_on_video',
  description: `Overlay images on videos at specific positions.
  • Add watermarks, logos, or graphics
  • Precise positioning with x,y coordinates
  • Maintains video quality
  • Perfect for branding or annotations`,
  inputSchema: z.object({
    videoFile: z.string().describe('Input video file path'),
    imageFile: z.string().describe('Image to overlay (PNG recommended)'),
    outputFile: z.string().describe('Output video file path'),
    xCoordinate: z.number().describe('X position for overlay'),
    yCoordinate: z.number().describe('Y position for overlay'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'AVTool requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    await geminiCli.overlayImage({
      videoPath: context.videoFile,
      imagePath: context.imageFile,
      outputPath: context.outputFile,
      xCoordinate: context.xCoordinate,
      yCoordinate: context.yCoordinate,
    });

    return {
      success: true,
      outputPath: context.outputFile,
      message: `Image overlaid at position (${context.xCoordinate}, ${context.yCoordinate})`,
    };
  },
});

export const ffmpegConcatenateMediaTool = createTool({
  id: 'ffmpeg_concatenate_media_files',
  description: `Join multiple audio or video files into one.
  • Seamless concatenation
  • Handles format conversion if needed
  • Special WAV handling for compatibility
  • Perfect for creating compilations`,
  inputSchema: z.object({
    inputFiles: z.array(z.string()).min(2).describe('Array of input file paths to concatenate'),
    outputFile: z.string().describe('Output concatenated file path'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'AVTool requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    await geminiCli.concatenateMedia({
      inputPaths: context.inputFiles,
      outputPath: context.outputFile,
    });

    return {
      success: true,
      outputPath: context.outputFile,
      message: `Concatenated ${context.inputFiles.length} files successfully`,
    };
  },
});

export const ffmpegAdjustVolumeTool = createTool({
  id: 'ffmpeg_adjust_volume',
  description: `Adjust audio volume by decibels.
  • Increase or decrease volume
  • Preserves audio quality
  • Works with any audio format
  • Use positive dB to increase, negative to decrease`,
  inputSchema: z.object({
    inputFile: z.string().describe('Input audio file path'),
    outputFile: z.string().describe('Output audio file path'),
    volumeDb: z.number().min(-50).max(50).describe('Volume adjustment in dB (+/- values)'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'AVTool requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    await geminiCli.adjustVolume({
      inputPath: context.inputFile,
      outputPath: context.outputFile,
      volumeDb: context.volumeDb,
    });

    return {
      success: true,
      outputPath: context.outputFile,
      message: `Volume adjusted by ${context.volumeDb}dB`,
    };
  },
});

export const ffmpegLayerAudioTool = createTool({
  id: 'ffmpeg_layer_audio_files',
  description: `Mix multiple audio files together.
  • Creates layered audio compositions
  • All inputs play simultaneously
  • Duration set to longest input
  • Perfect for creating soundscapes or mixing tracks`,
  inputSchema: z.object({
    inputFiles: z.array(z.string()).min(2).describe('Array of audio files to layer'),
    outputFile: z.string().describe('Output mixed audio file path'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'AVTool requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    await geminiCli.layerAudio({
      inputPaths: context.inputFiles,
      outputPath: context.outputFile,
    });

    return {
      success: true,
      outputPath: context.outputFile,
      message: `Layered ${context.inputFiles.length} audio files successfully`,
    };
  },
});
