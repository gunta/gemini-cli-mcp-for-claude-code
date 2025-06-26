export const prompts = {
  listPrompts: () =>
    Promise.resolve([
      {
        name: 'analyze_large_codebase',
        description: "Analyze a large codebase (>200K tokens) using Gemini's 1M token context",
        version: '1.0',
      },
      {
        name: 'multimodal_analysis',
        description: 'Analyze images, PDFs, and text together in a single prompt',
        version: '1.0',
      },
      {
        name: 'advanced_reasoning',
        description: "Complex reasoning tasks that benefit from Gemini's thinking capabilities",
        version: '1.0',
      },
      {
        name: 'google_search_research',
        description: 'Research a topic using Google Search integration',
        version: '1.0',
      },
      {
        name: 'create_multimedia_content',
        description: 'Generate complete multimedia content: images, videos, audio, and music',
        version: '2.0',
      },
      {
        name: 'video_production_workflow',
        description: 'Complete video production: generate video, add music, overlay graphics',
        version: '2.0',
      },
      {
        name: 'audio_composition',
        description: 'Create layered audio compositions with music, narration, and effects',
        version: '2.0',
      },
    ]),

  getPromptMessages: ({ name }: { name: string; version?: string; args?: unknown }) => {
    const messages = (() => {
      switch (name) {
        case 'analyze_large_codebase':
          return [
            {
              role: 'assistant' as const,
              content: {
                type: 'text' as const,
                text: "You are analyzing a large codebase. Use Gemini's 1M token context to understand the entire codebase structure and relationships.",
              },
            },
            {
              role: 'user' as const,
              content: {
                type: 'text' as const,
                text: 'Analyze this codebase and provide insights about its architecture, patterns, and potential improvements.',
              },
            },
          ];

        case 'multimodal_analysis':
          return [
            {
              role: 'assistant' as const,
              content: {
                type: 'text' as const,
                text: 'You are performing multimodal analysis. Combine insights from images, PDFs, and text to provide comprehensive understanding.',
              },
            },
            {
              role: 'user' as const,
              content: {
                type: 'text' as const,
                text: 'Analyze these documents and images together to extract key information and relationships.',
              },
            },
          ];

        case 'advanced_reasoning':
          return [
            {
              role: 'assistant' as const,
              content: {
                type: 'text' as const,
                text: "You are using Gemini's advanced reasoning capabilities. Think step-by-step through complex problems.",
              },
            },
            {
              role: 'user' as const,
              content: {
                type: 'text' as const,
                text: 'Solve this complex problem using careful reasoning and analysis.',
              },
            },
          ];

        case 'google_search_research':
          return [
            {
              role: 'assistant' as const,
              content: {
                type: 'text' as const,
                text: 'You are researching using Google Search. Gather comprehensive, up-to-date information from multiple sources.',
              },
            },
            {
              role: 'user' as const,
              content: {
                type: 'text' as const,
                text: 'Research this topic thoroughly using web search and synthesize the findings.',
              },
            },
          ];

        case 'create_multimedia_content':
          return [
            {
              role: 'assistant' as const,
              content: {
                type: 'text' as const,
                text: "You have access to Google's complete media generation suite: Imagen 3 for images, Veo 2 for videos, Chirp 3 HD for speech, and Lyria for music. Create rich multimedia content.",
              },
            },
            {
              role: 'user' as const,
              content: {
                type: 'text' as const,
                text: 'Create multimedia content using the available tools: generate images, videos, narration, and background music as needed.',
              },
            },
          ];

        case 'video_production_workflow':
          return [
            {
              role: 'assistant' as const,
              content: {
                type: 'text' as const,
                text: 'You can create complete video productions: generate videos with Veo 2, add music with Lyria, overlay graphics, combine audio tracks, and produce professional results.',
              },
            },
            {
              role: 'user' as const,
              content: {
                type: 'text' as const,
                text: 'Create a complete video production: generate the base video, add background music, overlay graphics/logos, and produce the final output.',
              },
            },
          ];

        case 'audio_composition':
          return [
            {
              role: 'assistant' as const,
              content: {
                type: 'text' as const,
                text: 'You can create complex audio compositions: generate music with Lyria, synthesize speech with Chirp 3 HD, layer multiple tracks, adjust volumes, and produce professional audio.',
              },
            },
            {
              role: 'user' as const,
              content: {
                type: 'text' as const,
                text: 'Create a layered audio composition: generate background music, add narration, mix multiple tracks, and produce the final audio.',
              },
            },
          ];

        default:
          return [];
      }
    })();
    return Promise.resolve(messages);
  },
};
