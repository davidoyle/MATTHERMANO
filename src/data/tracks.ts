import type { BotanicalKind } from "../lib/botanical";

export type JacketTone = "rust" | "wine" | "clay" | "ember" | "sand";

export interface Track {
  /** URL slug: /track/<slug>/ (each needs src/track/<slug>/index.html). */
  slug: string;
  /** Release order, oldest first. Printed as Nº on labels. */
  no: number;
  title: string;
  /** m:ss */
  duration: string;
  /** ISO date. Month precision ("2025-02") is fine. */
  released: string;
  genre: string;
  soundcloudId: string;
  soundcloudUrl: string;
  spotifyId?: string;
  /** Short liner note. Leave undefined until there is real copy. */
  description?: string;
  /** Plain text, blank line between verses. */
  lyrics?: string;
  /** YouTube id of the related video. */
  videoId?: string;
  botanical: BotanicalKind;
  jacket: JacketTone;
}

/*
 * Source: soundcloud.com/officialmatthermano (titles, durations, descriptions, upload dates).
 * Lost in Your Eyes uses the September 2023 debut date from the SoundCloud bio;
 * the others use their SoundCloud upload month.
 * Listed newest first; that order drives the Music page, the calendar and next/previous links.
 */
export const tracks: Track[] = [
  {
    slug: "chill-with-me",
    no: 5,
    title: "Chill With Me",
    duration: "3:20",
    released: "2026-07-29",
    genre: "Pop soul",
    soundcloudId: "2369934689",
    soundcloudUrl: "https://soundcloud.com/officialmatthermano/chill-with-me",
    videoId: "-DBJuCmYbjo",
    botanical: "eucalyptus",
    jacket: "clay"
  },
  {
    slug: "late-night-drive",
    no: 4,
    title: "Late Night Drive",
    duration: "3:41",
    released: "2026-06-25",
    genre: "Pop soul",
    soundcloudId: "2346181823",
    soundcloudUrl: "https://soundcloud.com/officialmatthermano/late-night-drive",
    description: "Late night drives kinda vibes.",
    botanical: "moonflower",
    jacket: "rust"
  },
  {
    slug: "one-night-love",
    no: 3,
    title: "One Night Love",
    duration: "3:01",
    released: "2025-02",
    genre: "Pop soul",
    soundcloudId: "2027330360",
    soundcloudUrl: "https://soundcloud.com/officialmatthermano/one-night-love",
    description: "Have you ever had a one night love? This song is for you.",
    videoId: "KRCVbN71pVE",
    botanical: "poppy",
    jacket: "ember"
  },
  {
    slug: "ghost-me",
    no: 2,
    title: "Ghost Me",
    duration: "2:47",
    released: "2025-02",
    genre: "Pop soul",
    soundcloudId: "2027326360",
    soundcloudUrl: "https://soundcloud.com/officialmatthermano/ghost-me",
    spotifyId: "0ldl4VDhEEukukchrnVDhI",
    description: "Have you ever been ghosted? This song is for you.",
    videoId: "HMJvGZpne7A",
    botanical: "dandelion",
    jacket: "wine"
  },
  {
    slug: "lost-in-your-eyes",
    no: 1,
    title: "Lost in Your Eyes",
    duration: "3:33",
    released: "2023-09",
    genre: "Pop soul",
    soundcloudId: "2027329340",
    soundcloudUrl: "https://soundcloud.com/officialmatthermano/lost-in-your-eyes-wav",
    spotifyId: "0kuTNBoL52fIatGLuJ7CJO",
    description: "Matt's debut single. The song started when he was 18.",
    botanical: "iris",
    jacket: "sand"
  }
];

/** The track the hero "Listen" button starts. Most played on SoundCloud by a wide margin. */
export const leadTrackSlug = "late-night-drive";

/** Home page row, in display order. */
export const featuredSlugs = ["late-night-drive", "chill-with-me", "ghost-me", "one-night-love"];

export const getTrack = (slug: string): Track | undefined => tracks.find((track) => track.slug === slug);

export const requireTrack = (slug: string): Track => {
  const track = getTrack(slug);
  if (!track) throw new Error(`Unknown track: ${slug}`);
  return track;
};

export const soundcloudWidgetUrl = (track: Track, autoPlay = false): string => {
  const params = new URLSearchParams({
    url: `https://api.soundcloud.com/tracks/${track.soundcloudId}`,
    color: "#8a312c",
    auto_play: String(autoPlay),
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false"
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const releaseLabel = (iso: string): string => {
  const [year, month] = iso.split("-");
  return month ? `${months[Number(month) - 1]} ${year}` : year;
};

export const releaseYear = (iso: string): string => iso.slice(0, 4);

export const durationSeconds = (duration: string): number => {
  const [m, s] = duration.split(":").map(Number);
  return m * 60 + s;
};
