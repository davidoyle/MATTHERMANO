import { tracks, type Track } from "../data/tracks";

const buildEmbed = (track: Track): string => {
  const src = track.spotifyId ? `https://open.spotify.com/embed/track/${track.spotifyId}` : track.fallbackUrl;

  if (!src) {
    return "";
  }

  const title = track.spotifyId ? `${track.title} Spotify player` : `${track.title} player`;

  return `<iframe
    src="${src}"
    width="100%"
    height="152"
    frameborder="0"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
    title="${title}"
  ></iframe>`;
};

export const renderTrackRows = (selector: string): void => {
  const container = document.querySelector<HTMLElement>(selector);
  if (!container) return;

  container.innerHTML = tracks
    .map(
      (track, index) => `
      <article class="track-card" data-track-card>
        <button class="track-row" type="button" data-track-toggle aria-expanded="false" aria-controls="track-${track.id}">
          <span class="track-number">${String(index + 1).padStart(2, "0")}</span>
          <h3 class="track-title">${track.title}</h3>
          <span class="duration">${track.duration}</span>
          <span class="share-link" aria-hidden="true">Share</span>
        </button>
        <div class="embed-wrap track-embed ${track.spotifyId ? "spotify" : "fallback"}" id="track-${track.id}" hidden>
          ${buildEmbed(track)}
          <p class="track-actions">
            <a class="track-detail-link" href="/track/${track.id}/">Open track page</a>
          </p>
        </div>
      </article>
    `
    )
    .join("");

  const toggles = Array.from(container.querySelectorAll<HTMLButtonElement>("[data-track-toggle]"));

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const card = toggle.closest<HTMLElement>("[data-track-card]");
      const panel = card?.querySelector<HTMLElement>(".track-embed");
      if (!card || !panel) return;

      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      card.classList.toggle("is-open", !expanded);
      panel.hidden = expanded;
    });
  });
};
