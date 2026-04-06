const imageModules = import.meta.glob("../assets/gallery/*.webp", { eager: true, import: "default" }) as Record<string, string>;

const orderedImages = Object.entries(imageModules)
  .map(([key, url]) => ({ key, url }))
  .sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true, sensitivity: "base" }));

const slugToLabel = (slug: string): string => slug.replace(/-/g, " ");

export const initializeGallery = (): void => {
  const root = document.querySelector<HTMLElement>("[data-gallery]");
  if (!root) return;

  const viewport = root.querySelector<HTMLElement>("[data-gallery-viewport]");
  const prevButton = root.querySelector<HTMLButtonElement>("[data-gallery-prev]");
  const nextButton = root.querySelector<HTMLButtonElement>("[data-gallery-next]");
  const thumbs = root.querySelector<HTMLElement>("[data-gallery-thumbs]");

  if (!viewport || !prevButton || !nextButton || !thumbs || orderedImages.length === 0) return;

  const slides = orderedImages.map((entry, index) => {
    const slug = entry.key.split("/").pop()?.replace(".webp", "") ?? `photo-${index + 1}`;
    return { ...entry, slug, label: slugToLabel(slug) };
  });

  viewport.innerHTML = slides
    .map(
      (slide, index) =>
        `<figure class="gallery-slide${index === 0 ? " is-active" : ""}" data-slide-index="${index}" role="img" aria-label="${slide.label}">
          <img src="${slide.url}" alt="${slide.label}" loading="lazy" />
        </figure>`
    )
    .join("");

  thumbs.innerHTML = slides
    .map(
      (slide, index) =>
        `<button type="button" class="gallery-thumb${index === 0 ? " is-active" : ""}" data-thumb-index="${index}" aria-label="View photo ${index + 1}">
          <img src="${slide.url}" alt="" loading="lazy" />
        </button>`
    )
    .join("");

  const slideElements = Array.from(viewport.querySelectorAll<HTMLElement>(".gallery-slide"));
  const thumbButtons = Array.from(thumbs.querySelectorAll<HTMLButtonElement>(".gallery-thumb"));
  let currentIndex = 0;

  const setSlide = (value: number): void => {
    currentIndex = (value + slideElements.length) % slideElements.length;
    slideElements.forEach((slide, index) => slide.classList.toggle("is-active", index === currentIndex));
    thumbButtons.forEach((thumb, index) => thumb.classList.toggle("is-active", index === currentIndex));
  };

  prevButton.addEventListener("click", () => setSlide(currentIndex - 1));
  nextButton.addEventListener("click", () => setSlide(currentIndex + 1));
  thumbButtons.forEach((thumb) => {
    thumb.addEventListener("click", () => setSlide(Number(thumb.dataset.thumbIndex ?? 0)));
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") setSlide(currentIndex - 1);
    if (event.key === "ArrowRight") setSlide(currentIndex + 1);
  });

  setSlide(0);
};
