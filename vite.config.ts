import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';
  
  return {
    plugins: [react()],
    
    // prevent vite from obscuring rust errors
    clearScreen: false,
    
    // Tauri expects a fixed port, fail if that port is not available
    server: {
      strictPort: false,
      port: 3000,
    },
    
    // to access the Tauri environment variables set by the CLI with information about the current target
    envPrefix: ["VITE_", "TAURI_"],
    
    // Resolve aliases
    resolve: {
      alias: {
        '@tauri-apps/api/tauri': resolve(__dirname, 'src/tauri-api.ts')
      }
    },
    
    build: {
      // Tauri uses Chromium on Windows and WebKit on macOS and Linux
      target: process.env.TAURI_PLATFORM === "windows" ? "chrome110" : "safari15",
      
      // don't minify for debug builds
      minify: isProduction ? 'terser' : false,
      
      // produce sourcemaps for debug builds
      sourcemap: !isProduction,
      
      // Optimization settings for production
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      } : undefined,
      
      // Split chunks for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            tauri: ['@tauri-apps/api'],
          },
        },
      },
    },
  };
});
