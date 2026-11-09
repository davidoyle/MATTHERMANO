/*
 * Build-time includes. Any HTML page can use <!--@name--> or <!--@name:arg-->
 * and the Vite plugin in vite.config.ts swaps in the markup below.
 */
import { renderCalendar } from "./calendar";
import { site } from "../data/site";
import { featured, footer, header, labels, listen, ornament, soundcloudProfile, trackPage, videoCarousel, videoFeatured } from "./blocks";

const head = (): string => `
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=Oswald:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<meta name="theme-color" content="#BBB29A" />`;

type Slot = (arg: string | undefined, route: string) => string;

const slots: Record<string, Slot> = {
  head: () => head(),
  header: (_arg, route) => header(route),
  footer: () => footer(),
  divider: () => ornament.divider(),
  corner: () => ornament.corner(),
  "hero-vine": () => ornament.heroVine(),
  featured: () => featured(),
  labels: () => labels(),
  "soundcloud-profile": () => soundcloudProfile(),
  track: (arg) => {
    if (!arg) throw new Error("<!--@track:slug--> needs a slug");
    return trackPage(arg);
  },
  calendar: () => renderCalendar(new Date()),
  "video-featured": () => videoFeatured(),
  "video-home": () => videoFeatured(false),
  listen: () => listen(),
  "email-line": () => `<p class="book__alt">Prefer email? <a class="text-link" href="mailto:${site.email}">${site.email}</a></p>`,
  "video-carousel": () => videoCarousel()
};

export const renderSlot = (name: string, arg: string | undefined, route: string): string => {
  const slot = slots[name];
  if (!slot) throw new Error(`Unknown template slot <!--@${name}--> in ${route}`);
  return slot(arg, route);
};
