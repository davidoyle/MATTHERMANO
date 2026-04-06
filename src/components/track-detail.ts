import { getTrackById } from "../data/tracks";

export const renderTrackDetail = (): void => {
  const page = document.querySelector<HTMLElement>("[data-track-page]");
  if (!page) return;

  const slug = page.dataset.trackSlug ?? "";
  const track = getTrackById(slug);
  if (!track) return;

  const title = page.querySelector<HTMLElement>("[data-track-title]");
  const meta = page.querySelector<HTMLElement>("[data-track-meta]");
  const embed = page.querySelector<HTMLElement>("[data-track-embed]");
  const shareButton = page.querySelector<HTMLButtonElement>("[data-track-share]");
  const shareStatus = page.querySelector<HTMLElement>("[data-track-copy-status]");

  if (title) title.textContent = track.title;
  if (meta) meta.textContent = `Matt Hermano · ${track.duration}`;

  if (embed && track.spotifyId) {
    embed.innerHTML = `<iframe src="https://open.spotify.com/embed/track/${track.spotifyId}" width="100%" height="80" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="${track.title} player"></iframe>`;
  }

  shareButton?.addEventListener("click", async () => {
    const canonical = `${window.location.origin}/track/${track.id}/`;
    try {
      await navigator.clipboard.writeText(canonical);
      if (shareStatus) {
        shareStatus.textContent = "Copied";
        window.setTimeout(() => {
          shareStatus.textContent = "";
        }, 1500);
      }
    } catch {
      if (shareStatus) shareStatus.textContent = "Copy failed";
    }
  });
};
