export const markActiveNav = (): void => {
  const path = window.location.pathname;
  const links = document.querySelectorAll<HTMLAnchorElement>(".nav-links a");

  links.forEach((link) => {
    const href = link.getAttribute("href") ?? "";
    const isMusicRoute = href === "/" && (path === "/" || path === "/index.html" || path.startsWith("/track/"));
    const isVideoRoute = href === "/video/" && (path === "/video" || path === "/video/");
    const isGalleryRoute = href === "/gallery/" && (path === "/gallery" || path === "/gallery/");
    const isAboutRoute = href === "/about/" && (path === "/about" || path === "/about/");
    const isBookRoute = href === "/book/" && (path === "/book" || path === "/book/");

    link.classList.toggle("active", isMusicRoute || isVideoRoute || isGalleryRoute || isAboutRoute || isBookRoute);
  });
};

export const initializeNavMenu = (): void => {
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const links = document.querySelectorAll<HTMLAnchorElement>(".nav-links a");
  if (!nav || !toggle) return;

  const setMenuState = (isOpen: boolean): void => {
    toggle.setAttribute("aria-expanded", String(isOpen));
    nav.classList.toggle("is-open", isOpen);
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    setMenuState(!expanded);
  });

  links.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) setMenuState(false);
  });
};
