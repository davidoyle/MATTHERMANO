/** Horizontal video strip: native scroll-snap, arrow buttons scroll by a page. */
export const initializeCarousel = (): void => {
  document.querySelectorAll<HTMLElement>("[data-carousel]").forEach((root) => {
    const track = root.querySelector<HTMLElement>("[data-carousel-track]");
    const prev = root.querySelector<HTMLButtonElement>("[data-prev]");
    const next = root.querySelector<HTMLButtonElement>("[data-next]");
    if (!track || !prev || !next) return;

    const update = (): void => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };

    const page = (direction: 1 | -1): void => {
      track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
    };

    prev.addEventListener("click", () => page(-1));
    next.addEventListener("click", () => page(1));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    update();
  });
};
