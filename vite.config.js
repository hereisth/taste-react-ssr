import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: './src/client.jsx',
      output: {
        dir: 'dist',
        entryFileNames: 'client.js',
        format: 'es'
      }
    }
  }
});