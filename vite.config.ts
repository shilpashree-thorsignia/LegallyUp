import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // External problematic Node.js dependencies
      external: [],
      // Split chunks for better caching
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
          pdf: ['html2pdf.js', 'jspdf', 'html2canvas'],
          office: ['docx']
        },
        // Use content hash for better caching
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
    },
    // Enable build optimizations
    minify: 'terser',
    sourcemap: false,
    outDir: 'dist',
    copyPublicDir: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable tree-shaking
    treeshake: {
      moduleSideEffects: false,
      preset: 'recommended'
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2
      },
      mangle: true,
      format: {
        comments: false
      }
    },
    // Handle CommonJS modules better
    commonjsOptions: {
      include: [/node_modules/],
      exclude: ['html-docx-js']
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'framer-motion',
      'lucide-react'
    ],
    esbuildOptions: {
      target: 'esnext',
      drop: ['console', 'debugger']
    },
  },
  // Set the target to a modern browser environment
  esbuild: {
    target: 'esnext',
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none'
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  publicDir: 'public',
  // Performance optimizations
  css: {
    devSourcemap: false
  },
  // Handle Node.js modules for browser
  define: {
    global: 'globalThis',
    'process.env': {}
  }
})