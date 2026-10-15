import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

/* SCA Learn (the learning platform) is its own Vite app in ./learn, served at
   /learn/. `npm run build` builds it into dist/learn after the main site (see
   package.json). In development this plugin runs Learn's dev server inside
   this one, so the "Learn" tab works with a single `npm run dev`. */
const learnRoot = fileURLToPath(new URL('./learn', import.meta.url))

function learnDevServer() {
  let learn
  return {
    name: 'sca-learn-dev',
    apply: 'serve',
    async configureServer(server) {
      const { createServer } = await import('vite')
      learn = await createServer({
        configFile: `${learnRoot}/vite.config.js`,
        root: learnRoot,
        appType: 'spa',
        server: { middlewareMode: true, hmr: { port: 24679 } },
      })
      server.middlewares.use((req, res, next) => {
        if (req.url === '/learn') {
          res.writeHead(302, { Location: '/learn/' })
          return res.end()
        }
        if (req.url.startsWith('/learn/')) return learn.middlewares(req, res, next)
        next()
      })
      server.httpServer?.once('close', () => learn.close())
    },
  }
}

export default defineConfig({
  plugins: [react(), learnDevServer()],
  base: './',
})
