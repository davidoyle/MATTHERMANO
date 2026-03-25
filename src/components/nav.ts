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
