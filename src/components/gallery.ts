const imageModules = import.meta.glob("../assets/gallery/*.{jpg,webp}", { eager: true, import: "default" }) as Record<string, string>;

const orderedImages = Object.entries(imageModules)
  .map(([key, url]) => ({ key, url }))
  .sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true, sensitivity: "base" }));

export const initializeGallery = (): void => {
  const root = document.querySelector<HTMLElement>("[data-gallery]");
  if (!root) return;

  const viewport = root.querySelector<HTMLElement>("[data-gallery-viewport]");
  const prevButton = root.querySelector<HTMLButtonElement>("[data-gallery-prev]");
  const nextButton = root.querySelector<HTMLButtonElement>("[data-gallery-next]");
  const thumbs = root.querySelector<HTMLElement>("[data-gallery-thumbs]");
  const count = root.querySelector<HTMLElement>("[data-gallery-count]");

  if (!viewport || !prevButton || !nextButton || !thumbs || orderedImages.length === 0) return;

  const total = orderedImages.length;

  // Slides start without src: only the current photo and its neighbours load.
  viewport.innerHTML = orderedImages
    .map(
      (image, index) =>
        `<figure class="gallery-slide" data-slide-index="${index}" aria-hidden="true">
          <img data-src="${image.url}" alt="Matt Hermano, photo ${index + 1} of ${total}" decoding="async" />
        </figure>`
    )
    .join("");

  thumbs.innerHTML = orderedImages
    .map(
      (image, index) =>
        `<button type="button" class="gallery-thumb" data-thumb-index="${index}" aria-label="Show photo ${index + 1}">
          <img src="${image.url}" alt="" loading="lazy" decoding="async" />
        </button>`
    )
    .join("");

  const slides = Array.from(viewport.querySelectorAll<HTMLElement>(".gallery-slide"));
  const thumbButtons = Array.from(thumbs.querySelectorAll<HTMLButtonElement>(".gallery-thumb"));
  let current = 0;

  const ensureLoaded = (index: number): void => {
    const img = slides[(index + total) % total]?.querySelector<HTMLImageElement>("img[data-src]");
    if (img?.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    }
  };

  const setSlide = (value: number): void => {
    current = (value + total) % total;
    [current, current + 1, current - 1].forEach(ensureLoaded);
    slides.forEach((slide, index) => {
      const active = index === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    thumbButtons.forEach((thumb, index) => {
      thumb.classList.toggle("is-active", index === current);
      thumb.setAttribute("aria-current", String(index === current));
    });
    if (count) count.textContent = `${current + 1} / ${total}`;
  };

  prevButton.addEventListener("click", () => setSlide(current - 1));
  nextButton.addEventListener("click", () => setSlide(current + 1));
  thumbButtons.forEach((thumb) => thumb.addEventListener("click", () => setSlide(Number(thumb.dataset.thumbIndex ?? 0))));
  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") setSlide(current - 1);
    if (event.key === "ArrowRight") setSlide(current + 1);
  });

  setSlide(0);
};
