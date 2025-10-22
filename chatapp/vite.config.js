import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// ✅ FIXED: Named import for the plugin (not default)
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    // ✅ Use ViteImageOptimizer with config (quality for lossy compression)
    ViteImageOptimizer({
      png: { quality: 80 },      // PNG: 80% quality (lossy)
      jpeg: { quality: 80 },     // JPEG: 80% quality
      webp: { quality: 80 },     // WebP: 80% quality (lossy; set lossless: true for no loss)
      // avif: { lossless: true },  // Uncomment if you want AVIF; else excluded via test below
      test: /\.(jpe?g|png|gif|tiff|webp|svg)$/i  // ✅ Exclude AVIF by not including in regex
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Put React + common libs in a shared vendor chunk
          if (id.includes('node_modules') && id.includes('react')) {
            return 'vendor'
          }
          // Optional: Split heavy app files (e.g., if you have a big Profiles component)
          // if (id.includes('src/components/Profiles')) {
          //   return 'profiles'
          // }
        }
      }
    },
    // ✅ Inline small images as base64 to reduce HTTP requests
    assetsInlineLimit: 4096
  }
})