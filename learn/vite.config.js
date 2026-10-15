import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

/* SCA Learn lives inside the Student Code Alliance site at /learn/.
   - Built, it uses relative paths (base "./"), like the main site, so it works
     wherever GitHub Pages serves it.
   - In development the main site's dev server mounts this one at /learn/
     (see ../vite.config.js), so the "Learn" tab works there too. */
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, root, 'VITE_')
  // Without Firebase the app runs in local mode: no accounts, no sign-up.
  // That must never reach the live site.
  if (command === 'build' && mode === 'production' && !(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID && env.VITE_FIREBASE_APP_ID)) {
    throw new Error('SCA Learn: the Firebase config is missing (learn/.env), so the build would skip sign-up. Refusing to build.')
  }
  return {
    root,
    base: command === 'build' ? './' : '/learn/',
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            editor: ['@uiw/react-codemirror', '@codemirror/lang-python', '@codemirror/lang-javascript'],
          },
        },
      },
    },
  }
})
