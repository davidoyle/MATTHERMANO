import { defineConfig, type Plugin } from "vite";
import { existsSync, readdirSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { renderSlot } from "./src/templates/slots";
import { tracks } from "./src/data/tracks";

const root = resolve(__dirname, "src");

/** Every index.html under src/ is a page. No manual input list to keep in sync. */
const findPages = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "public" ? [] : findPages(full);
    return entry.name === "index.html" ? [full] : [];
  });

const routeOf = (file: string): string => `/${relative(root, file).split(sep).join("/")}`.replace(/index\.html$/, "");

const siteTemplates = (): Plugin => ({
  name: "site-templates",
  buildStart() {
    const missing = tracks.filter((track) => !existsSync(join(root, "track", track.slug, "index.html")));
    if (missing.length) {
      this.error(`Missing track page(s): ${missing.map((track) => `src/track/${track.slug}/index.html`).join(", ")}`);
    }
  },
  transformIndexHtml: {
    order: "pre",
    handler(html, ctx) {
      const route = routeOf(ctx.filename);
      return html.replace(/<!--@([a-z-]+)(?::([a-z0-9-]+))?-->/g, (_match, name: string, arg?: string) => renderSlot(name, arg, route));
    }
  }
});

export default defineConfig({
  root: "src",
  plugins: [siteTemplates()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(findPages(root).map((file) => [routeOf(file).replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home", file]))
    }
  }
});
