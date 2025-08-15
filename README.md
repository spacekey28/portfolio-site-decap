# Portfolio Site with Decap CMS

A modern portfolio website built with React, TypeScript, Vite, and Decap CMS, now featuring Tailwind CSS for styling.

## Features

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Decap CMS** for content management
- **Tailwind CSS** for utility-first styling
- **Markdown** content support
- **Responsive design** with dark mode support

## Tailwind CSS Setup

This project includes Tailwind CSS for styling. The setup includes:

- **Tailwind CSS v4** with PostCSS integration
- **Autoprefixer** for cross-browser compatibility
- **Custom configuration** in `tailwind.config.js`
- **PostCSS configuration** in `postcss.config.js`

### Using Tailwind Classes

You can now use any Tailwind utility classes in your components:

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
  This div uses Tailwind classes
</div>
```

### Available Utilities

- **Layout**: `flex`, `grid`, `container`, `max-w-*`, `mx-auto`, etc.
- **Spacing**: `p-*`, `m-*`, `gap-*`, etc.
- **Colors**: `bg-*`, `text-*`, `border-*`, etc.
- **Typography**: `text-*`, `font-*`, `leading-*`, etc.
- **Responsive**: `md:`, `lg:`, `xl:` prefixes
- **Dark mode**: `dark:` prefix for dark mode styles

### Customization

To customize Tailwind, edit `tailwind.config.js`:

```js
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
  plugins: [],
}
```

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
```

## Project Structure

```
src/
├── App.tsx          # Main app component with Tailwind classes
├── index.css        # Tailwind directives and custom styles
├── content.ts       # Content fetching utilities
└── main.tsx         # App entry point
```

## Content Management

Content is managed through Decap CMS and stored in:
- `content/pages/` - Static pages
- `content/blog/` - Blog posts
- `content/projects/` - Project showcases

## Deployment

The site is configured for deployment on Netlify with automatic builds from the main branch.