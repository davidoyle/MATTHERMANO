export type Track = {
  routeId: string;
  spotifyId?: string;
  slug: string;
  title: string;
  duration: string;
  fallbackEmbedUrl?: string;
};

export const tracks: Track[] = [
  {
    routeId: "3547680",
    spotifyId: "0kuTNBoL52fIatGLuJ7CJO",
    slug: "lost-in-your-eyes",
    title: "Lost in Your Eyes",
    duration: "3:33"
  },
  {
    routeId: "3657550",
    slug: "one-night-love",
    title: "One Night Love",
    duration: "3:01",
    fallbackEmbedUrl: "https://heymhmusic.com/embed/track/3657550/one-night-love"
  },
  {
    routeId: "3920363",
    spotifyId: "0ldl4VDhEEukukchrnVDhI",
    slug: "ghost-me",
    title: "Ghost Me",
    duration: "2:47"
  }
];

const buildEmbed = (track: Track): string => {
  const src = track.spotifyId
    ? `https://open.spotify.com/embed/track/${track.spotifyId}`
    : track.fallbackEmbedUrl;

  const height = track.spotifyId ? 80 : 120;
  const title = track.spotifyId ? `${track.title} Spotify player` : `${track.title} player`;

  return `<iframe
    src="${src}"
    width="100%"
    height="${height}"
    frameborder="0"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
    title="${title}"
  ></iframe>`;
};

export const renderTrackRows = (selector: string): void => {
  const container = document.querySelector<HTMLElement>(selector);

  if (!container) {
    return;
  }

  container.innerHTML = tracks
    .map(
      (track, index) => `
      <article class="track-card">
        <div class="track-row">
          <span class="track-number">${String(index + 1).padStart(2, "0")}</span>
          <h3 class="track-title">${track.title}</h3>
          <span class="duration">${track.duration}</span>
          <a class="share-link" href="/track/${track.routeId}/${track.slug}">Share</a>
        </div>
        <div class="embed-wrap track-embed ${track.spotifyId ? "spotify" : "fallback"}">
          ${buildEmbed(track)}
        </div>
      </article>
      <article class="track-row" data-target="#embed-${track.id}">
        <span class="track-number">${String(index + 1).padStart(2, "0")}</span>
        <button class="track-play" aria-label="Toggle ${track.title} embed" aria-expanded="false"></button>
        <h3 class="track-title">${track.title}</h3>
        <div class="wave" aria-hidden="true">${waveBars}</div>
        <span class="duration">${track.duration}</span>
        <a class="share-link" href="/track/${track.id}/${track.slug}">Share</a>
      </article>
      <div class="embed-wrap" id="embed-${track.id}" hidden>
        <iframe title="${track.title} audio embed" loading="lazy" src="${track.embedUrl}"></iframe>
      </div>
    `
    )
    .join("");
};
