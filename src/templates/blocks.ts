import { botanical, cornerSprig, divider, heroVine, svg } from "../lib/botanical";
import { icons } from "../lib/icons";
import { navLinks, site, socialById, socials } from "../data/site";
import { featuredSlugs, leadTrackSlug, releaseLabel, releaseYear, requireTrack, soundcloudWidgetUrl, tracks, type Track } from "../data/tracks";
import { featuredVideo, videoById, videos, type Video } from "../data/videos";

export const esc = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const no = (track: Track): string => `Nº ${String(track.no).padStart(2, "0")}`;
const trackHref = (track: Track): string => `/track/${track.slug}/`;

/* ---------- ornaments ---------- */

export const ornament = {
  divider: (extra = ""): string => svg(divider(), `ornament ornament--divider ${extra}`.trim()),
  corner: (extra = ""): string => svg(cornerSprig(), `ornament ornament--corner ${extra}`.trim()),
  heroVine: (): string => svg(heroVine(), "ornament ornament--vine")
};

/* ---------- header / footer ---------- */

const isActive = (href: string, route: string): boolean =>
  route === href || (href === "/music/" && route.startsWith("/track/"));

export const header = (route: string): string => `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-nav>
  <div class="wrap site-header__inner">
    <a class="wordmark" href="/">Matt Hermano</a>
    <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav">
      <span class="nav-toggle__label">Menu</span>${icons.menu}
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul class="site-nav__links">
        ${navLinks
          .map((link) => `<li><a href="${link.href}"${isActive(link.href, route) ? ' aria-current="page"' : ""}>${link.label}</a></li>`)
          .join("")}
      </ul>
      <ul class="site-nav__social">
        ${socials
          .filter((social) => social.inHeader)
          .map((social) => `<li><a href="${social.href}" target="_blank" rel="noopener" aria-label="${social.label}">${icons[social.id]}</a></li>`)
          .join("")}
      </ul>
      <a class="btn btn--primary btn--small" href="/book/"${route === "/book/" ? ' aria-current="page"' : ""}>Book</a>
    </nav>
  </div>
</header>`;

export const footer = (): string => {
  const ig = socialById("instagram");
  const tt = socialById("tiktok");
  return `
<footer class="site-footer">
  <div class="wrap site-footer__inner">
    ${ornament.divider("site-footer__ornament")}
    <p class="site-footer__name">Matt Hermano</p>
    <p class="site-footer__line">${site.tagline}. ${site.location}.</p>
    <ul class="site-footer__primary">
      <li><a href="${ig.href}" target="_blank" rel="noopener">${icons.instagram}<span>Instagram</span></a></li>
      <li><a href="${tt.href}" target="_blank" rel="noopener">${icons.tiktok}<span>TikTok</span></a></li>
      <li><a href="mailto:${site.email}">${icons.mail}<span>${site.email}</span></a></li>
    </ul>
    <ul class="site-footer__secondary">
      ${(["youtube", "soundcloud", "spotify"] as const)
        .map((id) => socialById(id))
        .map((social) => `<li><a href="${social.href}" target="_blank" rel="noopener">${social.label}</a></li>`)
        .join("")}
    </ul>
    <nav class="site-footer__nav" aria-label="Footer">
      ${[...navLinks, { href: "/book/", label: "Book" }].map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
    </nav>
    <p class="site-footer__legal">© ${new Date().getFullYear()} Matt Hermano</p>
  </div>
</footer>
<div class="player-dock" data-player-dock hidden>
  <div class="wrap player-dock__inner">
    <button class="play-btn play-btn--dock" type="button" data-dock-toggle aria-label="Pause">${icons.play}${icons.pause}</button>
    <p class="player-dock__now"><span class="player-dock__label">Now playing</span><a data-dock-title href="/music/"></a></p>
    <div class="player-dock__widget" data-dock-widget></div>
    <button class="player-dock__close" type="button" data-dock-close aria-label="Close player">${icons.close}</button>
  </div>
</div>`;
};

/* ---------- music ---------- */

export const jacket = (track: Track, extra = ""): string => `
<div class="jacket jacket--${track.jacket} ${extra}">
  ${svg(botanical(track.botanical), "jacket__art")}
  <span class="jacket__artist">Matt Hermano</span>
  <span class="jacket__no">${no(track)}</span>
  <span class="jacket__title">${esc(track.title)}</span>
</div>`;

export const playButton = (track: Track, extra = ""): string =>
  `<a class="play-btn ${extra}" href="${track.soundcloudUrl}" data-play="${track.slug}" aria-label="Play ${esc(track.title)}">${icons.play}${icons.pause}</a>`;

export const featured = (): string => `
<ol class="feature-row">
  ${featuredSlugs
    .map(requireTrack)
    .map(
      (track) => `
  <li class="feature">
    <a class="feature__jacket" href="${trackHref(track)}" tabindex="-1" aria-hidden="true">${jacket(track)}</a>
    <div class="feature__meta">
      ${playButton(track)}
      <div class="feature__text">
        <a class="feature__title" href="${trackHref(track)}">${esc(track.title)}</a>
        <span class="feature__dur">${track.duration}</span>
      </div>
    </div>
  </li>`
    )
    .join("")}
</ol>`;

export const labels = (): string =>
  tracks
    .map(
      (track) => `
<article class="label" id="${track.slug}">
  <a class="label__jacket" href="${trackHref(track)}" tabindex="-1" aria-hidden="true">${jacket(track)}</a>
  <div class="label__card">
    <div class="label__head"><span>${no(track)}</span><span>${releaseYear(track.released)}</span></div>
    <h3 class="label__title"><a href="${trackHref(track)}">${esc(track.title)}</a></h3>
    <p class="label__artist">Matt Hermano</p>
    <dl class="label__specs">
      <div><dt>Length</dt><dd>${track.duration}</dd></div>
      <div><dt>Released</dt><dd>${releaseLabel(track.released)}</dd></div>
      <div><dt>Genre</dt><dd>${esc(track.genre)}</dd></div>
    </dl>
    ${track.description ? `<p class="label__note">${esc(track.description)}</p>` : ""}
    <div class="label__actions">
      ${playButton(track, "play-btn--large")}
      <a class="text-link" href="${trackHref(track)}">Track page</a>
      <a class="text-link" href="${track.soundcloudUrl}" target="_blank" rel="noopener">SoundCloud</a>
    </div>
  </div>
</article>`
    )
    .join("");

export const soundcloudProfile = (): string => `
<div class="sc-frame sc-frame--profile">
  <iframe
    title="Matt Hermano on SoundCloud: all tracks"
    loading="lazy"
    allow="autoplay"
    src="https://w.soundcloud.com/player/?${new URLSearchParams({
      url: "https://soundcloud.com/officialmatthermano",
      color: "#8a312c",
      auto_play: "false",
      hide_related: "true",
      show_comments: "false",
      show_user: "true",
      show_reposts: "false",
      show_teaser: "false",
      visual: "false"
    }).toString()}"
  ></iframe>
</div>`;

/* ---------- video ---------- */

export const youtube = (video: Video, extra = "", quality: "hq" | "maxres" = "hq"): string => {
  const thumb = quality === "maxres" ? "maxresdefault" : "hqdefault";
  const label = video.kind ? `${video.title} (${video.kind.toLowerCase()})` : video.title;
  return `
<a class="yt ${extra}" href="https://www.youtube.com/watch?v=${video.youtubeId}" data-yt="${video.youtubeId}" data-yt-title="${esc(label)}">
  <img src="https://img.youtube.com/vi/${video.youtubeId}/${thumb}.jpg" alt="" loading="lazy" decoding="async" />
  <span class="yt__play">${icons.play}</span>
  <span class="sr-only">Play video: ${esc(label)}</span>
</a>`;
};

const videoCaption = (video: Video): string => {
  const track = video.trackSlug ? requireTrack(video.trackSlug) : undefined;
  return `
<div class="video-caption">
  ${video.kind ? `<span class="tag">${video.kind}</span>` : ""}
  <h3 class="video-caption__title">${esc(video.title)}</h3>
  ${track ? `<a class="text-link" href="${trackHref(track)}">Listen to the track</a>` : ""}
</div>`;
};

export const videoFeatured = (withCaption = true): string => `
<figure class="video-feature">
  ${youtube(featuredVideo, "yt--feature", "maxres")}
  ${withCaption ? `<figcaption>${videoCaption(featuredVideo)}</figcaption>` : ""}
</figure>`;

/** Hero call to action: starts the lead track. */
export const listen = (): string => {
  const track = requireTrack(leadTrackSlug);
  return `
<div class="hero__actions">
  <a class="btn btn--primary btn--play btn--hero" href="${track.soundcloudUrl}" data-play="${track.slug}">${icons.play}${icons.pause}<span data-play-label>Listen</span></a>
  <p class="hero__cue">Starts with <a href="${trackHref(track)}">${esc(track.title)}</a> <span aria-hidden="true">·</span> ${track.duration}</p>
</div>`;
};

export const videoCarousel = (): string => `
<div class="carousel" data-carousel>
  <div class="carousel__controls">
    <p class="carousel__count">${videos.length} videos</p>
    <div class="carousel__arrows">
      <button class="icon-btn" type="button" data-prev aria-label="Scroll to earlier videos">${icons.arrowLeft}</button>
      <button class="icon-btn" type="button" data-next aria-label="Scroll to more videos">${icons.arrowRight}</button>
    </div>
  </div>
  <ol class="carousel__track" data-carousel-track tabindex="0" aria-label="More videos, scroll sideways">
    ${videos
      .map(
        (video) => `
    <li class="carousel__card">
      ${youtube(video)}
      ${videoCaption(video)}
    </li>`
      )
      .join("")}
  </ol>
</div>`;

/* ---------- track page ---------- */

const lyricsBlock = (lyrics: string): string => `
<section class="track-lyrics" aria-labelledby="lyrics-heading">
  <p class="eyebrow" id="lyrics-heading">Lyrics</p>
  ${lyrics
    .trim()
    .split(/\n\s*\n/)
    .map((verse) => `<p>${verse.split("\n").map(esc).join("<br />")}</p>`)
    .join("")}
</section>`;

export const trackPage = (slug: string): string => {
  const track = requireTrack(slug);
  const index = tracks.indexOf(track);
  const prev = tracks[(index - 1 + tracks.length) % tracks.length];
  const next = tracks[(index + 1) % tracks.length];
  const video = track.videoId ? videoById(track.videoId) : undefined;
  return `
<article class="track" data-track="${track.slug}">
  <div class="wrap track__hero">
    <div class="track__jacket">${jacket(track, "jacket--large")}</div>
    <div class="track__body">
      <p class="eyebrow"><a href="/music/">Music</a> <span aria-hidden="true">/</span> ${no(track)}</p>
      <h1 class="track__title">${esc(track.title)}</h1>
      <p class="track__meta">Matt Hermano <span aria-hidden="true">·</span> ${releaseLabel(track.released)} <span aria-hidden="true">·</span> ${esc(track.genre)}</p>
      <div class="track__play">
        <a class="btn btn--primary btn--play" href="${track.soundcloudUrl}" data-play="${track.slug}">${icons.play}${icons.pause}<span data-play-label>Play</span></a>
        <span class="track__duration"><span class="sr-only">Duration </span>${track.duration}</span>
      </div>
      ${track.description ? `<p class="track__note">${esc(track.description)}</p>` : ""}
      <div class="sc-frame sc-frame--track">
        <iframe data-sc-inline="${track.slug}" title="${esc(track.title)} on SoundCloud" allow="autoplay" src="${soundcloudWidgetUrl(track)}"></iframe>
      </div>
      <p class="track__links">
        <a class="text-link" href="${track.soundcloudUrl}" target="_blank" rel="noopener">SoundCloud</a>
        ${track.spotifyId ? `<a class="text-link" href="https://open.spotify.com/track/${track.spotifyId}" target="_blank" rel="noopener">Spotify</a>` : ""}
      </p>
    </div>
  </div>
  ${track.lyrics ? `<div class="wrap wrap--narrow">${lyricsBlock(track.lyrics)}</div>` : ""}
  ${
    video
      ? `<section class="wrap track__video" aria-labelledby="video-heading">
    ${ornament.divider()}
    <p class="eyebrow">Watch</p>
    <h2 class="section-title" id="video-heading">${esc(video.title)}${video.kind ? ` <em>${video.kind.toLowerCase()}</em>` : ""}</h2>
    ${youtube(video, "yt--feature", "hq")}
  </section>`
      : ""
  }
  <nav class="wrap track__pager" aria-label="More tracks">
    <a class="pager pager--prev" href="${trackHref(prev)}"><span class="pager__dir">${icons.arrowLeft} Previous</span><span class="pager__title">${esc(prev.title)}</span></a>
    <a class="pager pager--next" href="${trackHref(next)}"><span class="pager__dir">Next ${icons.arrowRight}</span><span class="pager__title">${esc(next.title)}</span></a>
  </nav>
  <section class="wrap track__cta">
    <a class="btn btn--primary" href="/book/">Book Matt</a>
    <a class="btn btn--ghost" href="/music/">More music</a>
  </section>
</article>`;
};
