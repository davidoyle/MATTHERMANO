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
        gallery: resolve(__dirname, "src/gallery/index.html"),
        video: resolve(__dirname, "src/video/index.html"),
        trackGhostMe: resolve(__dirname, "src/track/ghost-me/index.html"),
        trackLostInYourEyes: resolve(__dirname, "src/track/lost-in-your-eyes/index.html")
      }
    }
  }
});
