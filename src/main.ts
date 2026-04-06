import "./style.css";
import { initializeGallery } from "./components/gallery";
import { markActiveNav } from "./components/nav";
import { renderTrackRows } from "./components/tracks";

const socialLinks = [
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@matthermanomusic?is_from_webapp=1&sender_device=pc",
    icon: "https://cdn.simpleicons.org/tiktok/e8e4d8"
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/groups/843931330507580/",
    icon: "https://cdn.simpleicons.org/facebook/e8e4d8"
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/matthermanomusic",
    icon: "https://cdn.simpleicons.org/instagram/e8e4d8"
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@Matthermanomusic",
    icon: "https://cdn.simpleicons.org/youtube/e8e4d8"
  },
  {
    name: "Spotify",
    href: "https://open.spotify.com/artist/2rAj9dUueDgnwhQOz8vtOS?utm_source=copy-link&utm_medium=copy-link&nd=1",
    icon: "https://cdn.simpleicons.org/spotify/e8e4d8"
  }
] as const;

const renderSocialFooter = (): void => {
  if (document.querySelector(".social-footer")) {
    return;
  }

  const siteShell = document.querySelector<HTMLElement>(".site-shell");
  if (!siteShell) {
    return;
  }

  const footer = document.createElement("footer");
  footer.className = "social-footer";
  footer.setAttribute("aria-label", "Social links");

  const heading = document.createElement("p");
  heading.className = "social-footer-title";
  heading.textContent = "Connect";

  const list = document.createElement("ul");
  list.className = "social-links";

  socialLinks.forEach((socialLink) => {
    const item = document.createElement("li");

    const link = document.createElement("a");
    link.href = socialLink.href;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", socialLink.name);

    const icon = document.createElement("img");
    icon.className = "social-icon";
    icon.src = socialLink.icon;
    icon.alt = `${socialLink.name} logo`;
    icon.loading = "lazy";

    const label = document.createElement("span");
    label.className = "social-label";
    label.textContent = socialLink.name;

    link.append(icon, label);
    item.append(link);
    list.append(item);
  });

  footer.append(heading, list);
  siteShell.append(footer);
};

renderTrackRows("#tracks");
initializeGallery();
markActiveNav();
renderSocialFooter();
