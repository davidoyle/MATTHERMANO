import { videos } from "../data/videos";

export const initializeVideoCarousel = (selector: string): void => {
  const container = document.querySelector<HTMLElement>(selector);
  if (!container || videos.length === 0) return;

  container.classList.add("video-carousel");
  container.innerHTML = `
    <div class="video-carousel-viewport" data-video-carousel-viewport></div>
    <div class="video-carousel-controls">
      <button type="button" class="video-carousel-arrow" data-video-carousel-prev aria-label="Previous video">‹</button>
      <p class="video-carousel-count" data-video-carousel-count aria-live="polite"></p>
      <button type="button" class="video-carousel-arrow" data-video-carousel-next aria-label="Next video">›</button>
    </div>
    <div class="video-carousel-thumbs" data-video-carousel-thumbs aria-label="Choose a video"></div>
  `;

  const viewport = container.querySelector<HTMLElement>("[data-video-carousel-viewport]");
  const prevButton = container.querySelector<HTMLButtonElement>("[data-video-carousel-prev]");
  const nextButton = container.querySelector<HTMLButtonElement>("[data-video-carousel-next]");
  const count = container.querySelector<HTMLElement>("[data-video-carousel-count]");
  const thumbs = container.querySelector<HTMLElement>("[data-video-carousel-thumbs]");

  if (!viewport || !prevButton || !nextButton || !count || !thumbs) return;

  viewport.innerHTML = videos
    .map(
      (video, index) => `
        <article class="video-card video-carousel-slide${index === 0 ? " is-active" : ""}" data-video-slide-index="${index}">
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

  thumbs.innerHTML = videos
    .map(
      (video, index) => `
        <button type="button" class="video-carousel-thumb${index === 0 ? " is-active" : ""}" data-video-thumb-index="${index}" aria-label="Watch ${video.title}">
          <img src="https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg" alt="" loading="lazy" />
          <span>${video.title}</span>
        </button>
      `
    )
    .join("");

  const slides = Array.from(viewport.querySelectorAll<HTMLElement>(".video-carousel-slide"));
  const thumbButtons = Array.from(thumbs.querySelectorAll<HTMLButtonElement>(".video-carousel-thumb"));
  let currentIndex = 0;

  const setSlide = (value: number): void => {
    currentIndex = (value + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === currentIndex));
    thumbButtons.forEach((thumb, index) => thumb.classList.toggle("is-active", index === currentIndex));
    count.textContent = `${currentIndex + 1} / ${slides.length}`;
  };

  prevButton.addEventListener("click", () => setSlide(currentIndex - 1));
  nextButton.addEventListener("click", () => setSlide(currentIndex + 1));
  thumbButtons.forEach((thumb) => {
    thumb.addEventListener("click", () => setSlide(Number(thumb.dataset.videoThumbIndex ?? 0)));
  });

  container.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") setSlide(currentIndex - 1);
    if (event.key === "ArrowRight") setSlide(currentIndex + 1);
  });

  setSlide(0);
};
