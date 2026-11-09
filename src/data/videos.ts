export interface Video {
  youtubeId: string;
  title: string;
  /** Only set when the YouTube title says so. */
  kind?: "Original" | "Live" | "Cover";
  trackSlug?: string;
}

/* Titles from YouTube (youtube.com/@Matthermanomusic), tidied for capitalisation only. */

/** Leads the Video page and appears on the home page. */
export const featuredVideo: Video = {
  youtubeId: "-DBJuCmYbjo",
  title: "Chill With Me",
  kind: "Original",
  trackSlug: "chill-with-me"
};

/** Carousel under the featured video, in display order. */
export const videos: Video[] = [
  { youtubeId: "HMJvGZpne7A", title: "Ghost Me", kind: "Original", trackSlug: "ghost-me" },
  { youtubeId: "BK00ifR-EKE", title: "Who I Am" },
  { youtubeId: "KwGidTiQ4K8", title: "Have Mercy" },
  { youtubeId: "dDRbSqwH6FQ", title: "Reassure Me With a Kiss" },
  { youtubeId: "XMwrqn1HvYM", title: "Dancehall Queen" },
  { youtubeId: "KRCVbN71pVE", title: "One Night Love", kind: "Live", trackSlug: "one-night-love" },
  { youtubeId: "zP4MzKu0PgA", title: "Chill With Me", kind: "Live", trackSlug: "chill-with-me" },
  { youtubeId: "YKsPn_j0HNs", title: "Chill With Me, live performances", kind: "Live", trackSlug: "chill-with-me" },
  { youtubeId: "gpOq1hdZJ6c", title: "Treasure (Bruno Mars)", kind: "Cover" },
  { youtubeId: "BQ_VmxkvsDA", title: "September (Earth, Wind & Fire)", kind: "Cover" },
  { youtubeId: "ZOnkXGnhoG8", title: "Grenade (Bruno Mars)", kind: "Cover" },
  { youtubeId: "WtYUpsrYhk0", title: "My Girl (The Temptations)", kind: "Cover" }
];

export const allVideos: Video[] = [featuredVideo, ...videos];

export const videoById = (id: string): Video | undefined => allVideos.find((video) => video.youtubeId === id);
