export const site = {
  name: "Matt Hermano",
  tagline: "Warm vocals, late-night soul",
  genre: "Pop soul",
  location: "Vancouver, BC",
  /*
   * Public contact address shown in the footer.
   * Taken from the site's original upload. Confirm it still receives mail.
   */
  email: "bookings@heymhmusic.com",
  bookingFormAction: "https://formspree.io/f/xeepnjjr"
};

export interface Social {
  id: "instagram" | "tiktok" | "youtube" | "soundcloud" | "spotify";
  label: string;
  href: string;
  /** Shown in the header next to the nav. */
  inHeader?: boolean;
}

export const socials: Social[] = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/matthermanomusic/", inHeader: true },
  { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@matthermanomusic", inHeader: true },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@Matthermanomusic/videos" },
  { id: "soundcloud", label: "SoundCloud", href: "https://soundcloud.com/officialmatthermano" },
  { id: "spotify", label: "Spotify", href: "https://open.spotify.com/artist/2rAj9dUueDgnwhQOz8vtOS" }
];

export const socialById = (id: Social["id"]): Social => {
  const found = socials.find((social) => social.id === id);
  if (!found) throw new Error(`Unknown social: ${id}`);
  return found;
};

export const navLinks = [
  { href: "/music/", label: "Music" },
  { href: "/about/", label: "About" },
  { href: "/shows/", label: "Shows" },
  { href: "/video/", label: "Video" },
  { href: "/gallery/", label: "Gallery" }
];
