const imageModules = import.meta.glob("../../*.webp", { eager: true, import: "default" }) as Record<string, string>;

const orderedImageUrls = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
  .map(([, url]) => url);

export const initializeGallery = (): void => {
  const root = document.querySelector<HTMLElement>("[data-gallery]");
  if (!root) {
    return;
  }

  const viewport = root.querySelector<HTMLElement>("[data-gallery-viewport]");
  const counter = root.querySelector<HTMLElement>("[data-gallery-counter]");
  const prevButton = root.querySelector<HTMLButtonElement>("[data-gallery-prev]");
  const nextButton = root.querySelector<HTMLButtonElement>("[data-gallery-next]");

  if (!viewport || !counter || !prevButton || !nextButton || orderedImageUrls.length === 0) {
    return;
  }

  viewport.innerHTML = orderedImageUrls
    .map(
      (url, index) =>
        `<figure class="gallery-slide${index === 0 ? " is-active" : ""}" data-slide-index="${index}">
          <img src="${url}" alt="Matt Hermano live show photo ${index + 1}" loading="lazy" />
        </figure>`
    )
    .join("");

  const slides = Array.from(viewport.querySelectorAll<HTMLElement>(".gallery-slide"));
  let currentIndex = 0;

  const clampIndex = (value: number): number => {
    if (value < 0) {
      return slides.length - 1;
    }
    if (value >= slides.length) {
      return 0;
    }
    return value;
  };

  const setSlide = (value: number): void => {
    currentIndex = clampIndex(value);

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === currentIndex);
    });

    counter.textContent = `${currentIndex + 1} / ${slides.length}`;
  };

  prevButton.addEventListener("click", () => setSlide(currentIndex - 1));
  nextButton.addEventListener("click", () => setSlide(currentIndex + 1));

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setSlide(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setSlide(currentIndex + 1);
    }
  });

  let touchStartX = 0;
  viewport.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0]?.clientX ?? 0;
    },
    { passive: true }
  );

  viewport.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0]?.clientX ?? 0;
      const delta = touchEndX - touchStartX;

      if (Math.abs(delta) < 40) {
        return;
      }

      if (delta > 0) {
        setSlide(currentIndex - 1);
      } else {
        setSlide(currentIndex + 1);
      }
    },
    { passive: true }
  );

  setSlide(0);
};
