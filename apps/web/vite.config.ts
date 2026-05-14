import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'favicon-96x96.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Wander city',
        short_name: 'Wander',
        description: 'Carte interactive de Paris',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        screenshots: [
          {
            src: '/screenshots/map-mobile.png',
            sizes: '438x933',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Carte interactive mobile de Paris',
          },
          {
            src: '/screenshots/filters-mobile.png',
            sizes: '438x933',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Filtres mobiles de la carte Wander',
          },
          {
            src: '/screenshots/weather-mobile.png',
            sizes: '438x933',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Météo mobile dans Wander',
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
