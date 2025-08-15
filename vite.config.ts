import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      'process.env.NEXT_PUBLIC_CATALYST_APP_URL': JSON.stringify(env.NEXT_PUBLIC_CATALYST_APP_URL),
      'process.env.NEXT_PUBLIC_ENVIRONMENT': JSON.stringify(env.NEXT_PUBLIC_ENVIRONMENT),
      'process.env.NEXT_PUBLIC_CATALYST_PROJECT_ID': JSON.stringify(env.CATALYST_PROJECT_ID),
    },
    server: {
      port: 3000,
      host: true,
    },
    preview: {
      port: 5000,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production',
    },
  };
});
