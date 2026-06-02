import { defineConfig } from 'vite'

export default defineConfig({
  // Multi-page app support for index.html, game.html, leaderboard.html, results.html
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        game: 'game.html',
        leaderboard: 'leaderboard.html',
        results: 'results.html',
      }
    }
  },
  server: {
    open: true
  }
})
