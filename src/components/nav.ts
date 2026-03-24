export const markActiveNav = (): void => {
  const path = window.location.pathname;
  const links = document.querySelectorAll<HTMLAnchorElement>(".nav-links a");

  links.forEach((link) => {
    const href = link.getAttribute("href") ?? "";
    const isActive = path === href || (href === "/" && path === "/index.html");
    link.classList.toggle("active", isActive);
  });
};
