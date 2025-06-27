'use client';

import { motion } from 'framer-motion';
import { useState, useTransition } from 'react';
import { Play, Image, Video, Music, Mic } from 'lucide-react';

export default function Demo() {
  const [activeDemo, setActiveDemo] = useState('image');
  const [, startTransition] = useTransition();

  const demos = {
    image: {
      icon: Image,
      title: 'Image Generation',
      prompt: 'A futuristic city at sunset with flying cars and neon lights, photorealistic, 4K',
      response: 'Generating photorealistic image with Imagen 3...',
      result: '/demo-image.jpg',
    },
    video: {
      icon: Video,
      title: 'Video Creation',
      prompt: 'A butterfly emerging from its chrysalis and taking its first flight',
      response: 'Creating 8-second video with Veo 2...',
      result: '/demo-video.mp4',
    },
    music: {
      icon: Music,
      title: 'Music Generation',
      prompt: 'Upbeat electronic dance music with tropical house influences, 120 BPM',
      response: 'Composing music with Lyria...',
      result: '/demo-music.wav',
    },
    speech: {
      icon: Mic,
      title: 'Speech Synthesis',
      prompt: 'Welcome to the future of AI-powered media generation',
      response: 'Synthesizing speech with Chirp 3 HD...',
      result: '/demo-speech.wav',
    },
  };

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Watch how Claude can create any type of media with simple prompts
          </p>
        </motion.div>

        {/* Demo selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(demos).map(([key, demo]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startTransition(() => setActiveDemo(key))}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeDemo === key
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70 border border-slate-700/50'
              }`}
            >
              <demo.icon className="w-5 h-5" />
              {demo.title}
            </motion.button>
          ))}
        </div>

        {/* Demo display */}
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden"
        >
          {/* Terminal-like interface */}
          <div className="bg-slate-950 p-6 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-sm text-slate-400">Claude Desktop</span>
            </div>
            
            <div className="space-y-4">
              {/* User prompt */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  U
                </div>
                <div className="flex-1">
                  <p className="text-slate-300">{demos[activeDemo as keyof typeof demos].prompt}</p>
                </div>
              </div>
              
              {/* Claude response */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                  C
                </div>
                <div className="flex-1">
                  <p className="text-slate-300">{demos[activeDemo as keyof typeof demos].response}</p>
                  
                  {/* Progress animation */}
                  <motion.div className="mt-3 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-green-500 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-500">Generating...</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Result preview */}
          <div className="p-8 flex items-center justify-center min-h-[300px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              className="relative"
            >
              {activeDemo === 'image' && (
                <div className="w-full max-w-md mx-auto">
                  <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                    <Image className="w-24 h-24 text-slate-600" />
                  </div>
                  <p className="text-center mt-4 text-sm text-slate-400">Generated image appears here</p>
                </div>
              )}
              
              {activeDemo === 'video' && (
                <div className="w-full max-w-md mx-auto">
                  <div className="aspect-video bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-lg flex items-center justify-center">
                    <Play className="w-16 h-16 text-slate-600" />
                  </div>
                  <p className="text-center mt-4 text-sm text-slate-400">8-second video plays here</p>
                </div>
              )}
              
              {activeDemo === 'music' && (
                <div className="w-full max-w-md mx-auto">
                  <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Music className="w-8 h-8 text-slate-400" />
                      <div className="flex-1">
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                            animate={{ width: ['0%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">Playing generated music...</p>
                  </div>
                </div>
              )}
              
              {activeDemo === 'speech' && (
                <div className="w-full max-w-md mx-auto">
                  <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-lg p-6">
                    <div className="flex items-center justify-center mb-4">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Mic className="w-16 h-16 text-slate-400" />
                      </motion.div>
                    </div>
                    <div className="flex justify-center gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-green-500 rounded-full"
                          animate={{ height: ['8px', '24px', '8px'] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-center mt-4 text-sm text-slate-400">Playing synthesized speech...</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Try it yourself CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 mb-4">Ready to try it yourself?</p>
          <a
            href="https://github.com/gunta/gemini-cli-mcp-for-claude-code"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-purple-500/25"
          >
            Get Started Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}