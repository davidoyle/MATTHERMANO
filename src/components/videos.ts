import { videos } from "../data/videos";

export const renderVideoGrid = (selector: string): void => {
  const container = document.querySelector<HTMLElement>(selector);
  if (!container) return;

  container.innerHTML = videos
    .map(
      (video) => `
      <article class="video-card">
        <div class="embed-wrap video-embed">
          <iframe
            src="https://www.youtube.com/embed/${video.youtubeId}"
            title="${video.title}"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </article>
      `
    )
    .join("");
};
