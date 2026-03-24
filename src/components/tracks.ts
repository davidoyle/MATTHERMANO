export type Track = {
  id: string;
  slug: string;
  title: string;
  duration: string;
  embedUrl: string;
};

export const tracks: Track[] = [
  {
    id: "3547680",
    slug: "lost-in-your-eyes",
    title: "Lost in your eyes",
    duration: "3:33",
    embedUrl: "https://heymhmusic.com/embed/track/3547680/lost-in-your-eyes"
  },
  {
    id: "3657550",
    slug: "one-night-love",
    title: "One night love",
    duration: "3:01",
    embedUrl: "https://heymhmusic.com/embed/track/3657550/one-night-love"
  },
  {
    id: "3920363",
    slug: "ghost-me",
    title: "Ghost me",
    duration: "2:47",
    embedUrl: "https://heymhmusic.com/embed/track/3920363/matt-hermano-ghost-me"
  }
];

const waveBars = [25, 45, 38, 70, 48, 90, 54, 82, 62, 35, 75, 50, 64, 40]
  .map((height) => `<span style="height:${height}%"></span>`)
  .join("");

export const renderTrackRows = (selector: string): void => {
  const container = document.querySelector<HTMLElement>(selector);

  if (!container) {
    return;
  }

  container.innerHTML = tracks
    .map(
      (track, index) => `
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
