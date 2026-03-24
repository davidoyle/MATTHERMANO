export const markActiveNav = (): void => {
  const path = window.location.pathname;
  const links = document.querySelectorAll<HTMLAnchorElement>(".nav-links a");

  links.forEach((link) => {
    const href = link.getAttribute("href") ?? "";

    const isMusicRoute = href === "/" && (path === "/" || path === "/index.html" || path.startsWith("/track/"));
    const isAboutRoute = href === "/about/" && (path === "/about" || path === "/about/");
    const isBookRoute = href === "/book/" && (path === "/book" || path === "/book/");

    link.classList.toggle("active", isMusicRoute || isAboutRoute || isBookRoute);
  });
};
