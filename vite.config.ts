import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Add any external dependencies that shouldn't be bundled
      external: [],
    },
    // Enable build optimizations
    minify: 'terser',
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  // Set the target to a modern browser environment
  esbuild: {
    target: 'esnext',
  },
})