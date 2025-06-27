# Gemini MCP Landing Page

A modern, high-performance landing page built with the latest web technologies.

## Tech Stack

- **Astro 5.10** - Static site generator with islands architecture
- **React 19** - For interactive components with latest features
- **Tailwind CSS 4.1** - Next-gen CSS framework with Vite plugin
- **Framer Motion 12** - Smooth animations and transitions
- **TypeScript 5.8** - Type safety and modern JS features

## Features

- 🚀 **Performance First** - Static generation with selective hydration
- 🎨 **Modern Design** - Glassmorphism, gradients, and smooth animations
- 📱 **Fully Responsive** - Mobile-first design approach
- ♿ **Accessible** - WCAG compliant with proper ARIA labels
- 🔍 **SEO Optimized** - Meta tags, Open Graph, structured data
- 🎭 **View Transitions** - Smooth page transitions with View Transitions API
- 🌙 **Dark Mode** - Elegant dark theme by default

## Modern Features Used

### React 19
- Server Components support
- `useTransition` for smooth state updates
- Automatic batching
- Concurrent features

### Tailwind CSS 3.4
- JIT compilation
- Container queries support
- Custom properties
- Advanced animations

### Astro 5.1
- View Transitions API
- Content Collections
- Image optimization
- Partial hydration

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Format code
npm run format

# Lint code
npm run lint
```

## Project Structure

```
landing/
├── src/
│   ├── components/     # React components
│   ├── layouts/        # Astro layouts
│   ├── pages/          # Route pages
│   ├── styles/         # Global styles
│   └── env.d.ts        # TypeScript declarations
├── public/             # Static assets
└── astro.config.ts     # Astro configuration
```

## Performance Optimizations

- Lazy loading images with blur placeholders
- Code splitting per route
- Preloading critical assets
- Font subsetting and preloading
- CSS purging in production
- Minification and compression

## Browser Support

- Chrome/Edge 120+
- Firefox 120+
- Safari 17+
- Mobile browsers (iOS 17+, Android Chrome)

All modern features have appropriate fallbacks for older browsers.