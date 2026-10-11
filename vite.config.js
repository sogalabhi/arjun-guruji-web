import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // panchangam-js uses CommonJS internally. Keep Observer and its consumers
  // on the same astronomy-engine instance, including during dev prebundling.
  resolve: { alias: { 'astronomy-engine': require.resolve('astronomy-engine') } },
})
