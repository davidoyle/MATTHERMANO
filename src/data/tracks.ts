export type Tone = "rust" | "wine" | "clay" | "ember" | "sand";

export interface Track {
  /** URL slug: /track/<slug>/ (each needs src/track/<slug>/index.html). */
  slug: string;
  title: string;
  /** m:ss */
  duration: string;
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
  /** Palette colour for this release's title strip and colour block. */
  tone: Tone;
}

/*
 * Source: soundcloud.com/officialmatthermano (titles, durations, descriptions).
 * Cover art lives in src/assets/art/<slug>-640.webp and <slug>-1200.webp.
 * No release dates on purpose: SoundCloud upload dates are not the real release dates.
 * List order drives the Music page and next/previous links.
 */
export const tracks: Track[] = [
  {
    slug: "chill-with-me",
    title: "Chill With Me",
    duration: "3:20",
    genre: "Pop soul",
    soundcloudId: "2369934689",
    soundcloudUrl: "https://soundcloud.com/officialmatthermano/chill-with-me",
    videoId: "-DBJuCmYbjo",
    tone: "clay"
  },
  {
    slug: "late-night-drive",
    title: "Late Night Drive",
    duration: "3:41",
    genre: "Pop soul",
    soundcloudId: "2346181823",
    soundcloudUrl: "https://soundcloud.com/officialmatthermano/late-night-drive",
    description: "Late night drives kinda vibes.",
    tone: "rust"
  },
  {
    slug: "one-night-love",
    title: "One Night Love",
    duration: "3:01",
    genre: "Pop soul",
    soundcloudId: "2027330360",
    soundcloudUrl: "https://soundcloud.com/officialmatthermano/one-night-love",
    description: "Have you ever had a one night love? This song is for you.",
    videoId: "KRCVbN71pVE",
    tone: "ember"
  },
  {
    slug: "ghost-me",
    title: "Ghost Me",
    duration: "2:47",
    genre: "Pop soul",
    soundcloudId: "2027326360",
    soundcloudUrl: "https://soundcloud.com/officialmatthermano/ghost-me",
    spotifyId: "0ldl4VDhEEukukchrnVDhI",
    description: "Have you ever been ghosted? This song is for you.",
    videoId: "HMJvGZpne7A",
    tone: "wine"
  },
  {
    slug: "lost-in-your-eyes",
    title: "Lost in Your Eyes",
    duration: "3:33",
    genre: "Pop soul",
    soundcloudId: "2027329340",
    soundcloudUrl: "https://soundcloud.com/officialmatthermano/lost-in-your-eyes-wav",
    spotifyId: "0kuTNBoL52fIatGLuJ7CJO",
    description: "Matt's debut single. The song started when he was 18.",
    tone: "sand"
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
