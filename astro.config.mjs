// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://yourportfolio.com',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': './src',
      },
    },
  },
  integrations: [
    react(),
  ],
});