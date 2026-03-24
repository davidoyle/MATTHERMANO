import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        about: resolve(__dirname, "src/about/index.html"),
        book: resolve(__dirname, "src/book/index.html"),
        track1: resolve(__dirname, "src/track/3547680/lost-in-your-eyes.html"),
        track2: resolve(__dirname, "src/track/3657550/one-night-love.html"),
        track3: resolve(__dirname, "src/track/3920363/ghost-me.html")
      }
    }
  }
});
