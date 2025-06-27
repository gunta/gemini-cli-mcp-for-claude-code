'use client';

import { motion } from 'framer-motion';
import { Brain, Image, Video, Music, Mic, Wrench, Search, FileText, Sparkles } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: '1M Token Context Window',
      description: '5x larger than Claude\'s 200K limit. Process entire codebases, books, and documents.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Image,
      title: 'Imagen 3 Image Generation',
      description: 'Create photorealistic images with multiple aspect ratios and batch generation.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Video,
      title: 'Veo 2 Video Creation',
      description: 'Generate videos from text or animate images with cinematic quality.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Music,
      title: 'Lyria Music Generation',
      description: 'Compose professional music in any genre with fine control.',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: Mic,
      title: 'Chirp 3 HD Speech',
      description: 'Ultra-realistic voices in 27+ languages with custom pronunciation.',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      icon: Wrench,
      title: 'Complete Media Toolkit',
      description: '8 FFmpeg tools for conversion, manipulation, and post-production.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Search,
      title: 'Google Search Integration',
      description: 'Real-time web search for current events and information.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: FileText,
      title: 'Advanced Document Analysis',
      description: 'Extract and analyze content from PDFs and documents.',
      gradient: 'from-teal-500 to-green-500',
    },
    {
      icon: Sparkles,
      title: 'And Much More',
      description: 'PDF generation, batch processing, cloud storage, and endless possibilities.',
      gradient: 'from-pink-500 to-purple-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="features" className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900" />
      
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
            Everything Claude Can't Do
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Claude has amazing language capabilities, but zero media generation. 
            This MCP server adds everything that's missing.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  '--tw-gradient-from': feature.gradient.split(' ')[1],
                  '--tw-gradient-to': feature.gradient.split(' ')[3],
                } as any}
              />
              
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.gradient} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-slate-400">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Why This MCP Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-24 mb-24 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-white mb-6 text-center">
              Why Not Other Gemini MCP Servers? 🔥
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-red-400 mb-4">❌ Other MCP Servers</h4>
                <ul className="space-y-3 text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Dumb API wrappers with no context</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Require manual CLAUDE.md maintenance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Claude doesn't know when to use them</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>You become a human router</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-green-400 mb-4">✅ This MCP Server</h4>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Self-documenting tool descriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Claude knows exactly when to use each tool</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Zero configuration needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>It just works™</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <p className="text-center text-slate-400 mt-8 text-lg">
              <span className="text-white font-semibold">Bottom line:</span> This MCP server makes Claude understand its own limitations
              <br />and automatically use Gemini to overcome them.
            </p>
          </div>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-24"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Claude vs. Claude + Gemini MCP
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Capability</th>
                  <th className="text-center py-4 px-6 text-slate-400 font-medium">Claude Native</th>
                  <th className="text-center py-4 px-6 text-slate-400 font-medium">With Gemini MCP</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Text Generation', '✅ 200K tokens', '✅ 1M tokens'],
                  ['Web Search', '❌', '✅ Google Search'],
                  ['Image Generation', '❌', '✅ Imagen 3'],
                  ['Video Generation', '❌', '✅ Veo 2'],
                  ['Music Generation', '❌', '✅ Lyria'],
                  ['Speech Synthesis', '❌', '✅ Chirp 3 HD'],
                  ['Media Processing', '❌', '✅ Full FFmpeg'],
                  ['PDF Generation', '❌', '✅'],
                ].map(([capability, native, withMcp], index) => (
                  <tr key={index} className="border-b border-slate-800">
                    <td className="py-4 px-6 text-white">{capability}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={native.startsWith('❌') ? 'text-red-400' : 'text-green-400'}>
                        {native}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-green-400">{withMcp}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}