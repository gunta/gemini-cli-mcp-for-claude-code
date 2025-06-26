/// <reference types="node" />
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { GeminiCliWrapper } from '../utils/gemini-cli.js';
import { CHIRP_DEFAULT_VOICE } from '../types/media.js';

// Initialize CLI client
const config = {
  useCliPath: process.env.GEMINI_CLI_PATH,
};

const geminiCli = config.useCliPath ? new GeminiCliWrapper(config) : null;

export const chirpTtsTool = createTool({
  id: 'chirp_tts',
  description: `Text-to-speech synthesis using Google's Chirp 3 HD (CAPABILITY NOT AVAILABLE IN CLAUDE).
  Chirp 3 HD provides ultra-realistic voice synthesis in 27+ languages with:
  • Natural prosody and intonation
  • Custom pronunciation support (IPA/X-SAMPA)
  • Multiple voice options per language
  • High-quality WAV output
  Perfect for narration, voiceovers, and accessibility.`,
  inputSchema: z.object({
    text: z.string().describe('Text to synthesize into speech'),
    voiceName: z
      .string()
      .optional()
      .default(CHIRP_DEFAULT_VOICE)
      .describe('Specific Chirp3-HD voice name'),
    outputFilenamePrefix: z
      .string()
      .optional()
      .default('chirp_audio')
      .describe('Prefix for output files'),
    outputDirectory: z.string().optional().describe('Local directory to save audio'),
    pronunciations: z
      .array(z.string())
      .optional()
      .describe('Custom pronunciations as "phrase:phonetic_form"'),
    pronunciationEncoding: z
      .enum(['ipa', 'xsampa'])
      .optional()
      .default('ipa')
      .describe('Phonetic encoding system'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'Audio synthesis requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    const audioBuffer = await geminiCli.synthesizeAudio({
      text: context.text,
      voiceName: context.voiceName,
      outputFilenamePrefix: context.outputFilenamePrefix,
      outputDirectory: context.outputDirectory,
      pronunciations: context.pronunciations,
      pronunciationEncoding: context.pronunciationEncoding,
    });

    // If saving locally, return the path
    if (context.outputDirectory) {
      const path = `${context.outputDirectory}/${context.outputFilenamePrefix}.wav`;
      return {
        success: true,
        path,
        message: `Audio synthesized and saved to ${path}`,
      };
    }

    // Otherwise return base64 audio
    return {
      audio: audioBuffer.toString('base64'),
      format: 'wav',
      sampleRate: 24000,
      encoding: 'LINEAR16',
    };
  },
});

export const listChirpVoicesTool = createTool({
  id: 'list_chirp_voices',
  description: `List available Chirp 3 HD voices for text-to-speech.
  Filter by language to find voices that support specific languages.
  Supports 27+ languages including English, Spanish, French, German, Japanese, and more.`,
  inputSchema: z.object({
    language: z.string().describe('Language filter (e.g., "English", "Spanish", "en-US", "es-ES")'),
  }),
  execute: async ({ context }) => {
    if (!geminiCli) {
      throw new Error(
        'Listing voices requires Gemini CLI. Please set GEMINI_CLI_PATH environment variable.',
      );
    }

    const voices = await geminiCli.listChirpVoices(context.language);

    return {
      voices,
      count: voices.length,
      language: context.language,
    };
  },
});
