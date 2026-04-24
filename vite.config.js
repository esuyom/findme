import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/lottie-web')) return 'lottie';
          if (id.includes('node_modules/swiper')) return 'swiper';
          if (id.includes('node_modules/react-dom')) return 'react-dom';
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router')) return 'router';
        },
      },
    },
  },
});
