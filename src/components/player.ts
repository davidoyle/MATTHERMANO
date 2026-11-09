/*
 * One SoundCloud player per page.
 * - Track pages: the inline widget ([data-sc-inline]) is the player.
 * - Everywhere else: a widget is created in the bottom dock on first play.
 * Every [data-play="slug"] control on the page toggles that track and mirrors its state.
 * Without JavaScript, the same controls are plain links to SoundCloud.
 */
import { getTrack, soundcloudWidgetUrl, tracks, type Track } from "../data/tracks";

interface SCWidget {
  bind(event: string, handler: () => void): void;
  load(url: string, options: { auto_play?: boolean; callback?: () => void } & Record<string, unknown>): void;
  play(): void;
  pause(): void;
  isPaused(callback: (paused: boolean) => void): void;
}

declare global {
  interface Window {
    SC?: { Widget: ((iframe: HTMLIFrameElement) => SCWidget) & { Events: Record<string, string> } };
  }
}

const API_SRC = "https://w.soundcloud.com/player/api.js";

let apiPromise: Promise<void> | null = null;
const loadApi = (): Promise<void> => {
  if (window.SC) return Promise.resolve();
  apiPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = API_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("SoundCloud API failed to load"));
    document.head.append(script);
  });
  return apiPromise;
};

const widgetParams = (): Record<string, unknown> => ({
  color: "#8a312c",
  hide_related: true,
  show_comments: false,
  show_user: true,
  show_reposts: false,
  show_teaser: false,
  visual: false
});

export const initializePlayer = (): void => {
  const controls = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-play]"));
  const inline = document.querySelector<HTMLIFrameElement>("[data-sc-inline]");
  const dock = document.querySelector<HTMLElement>("[data-player-dock]");
  if (!controls.length && !inline) return;

  let iframe: HTMLIFrameElement | null = inline;
  let widget: SCWidget | null = null;
  let current: Track | undefined = inline ? getTrack(inline.dataset.scInline ?? "") : undefined;
  let playing = false;

  const dockTitle = dock?.querySelector<HTMLAnchorElement>("[data-dock-title]");
  const dockToggle = dock?.querySelector<HTMLButtonElement>("[data-dock-toggle]");

  const render = (): void => {
    controls.forEach((control) => {
      const isCurrent = control.dataset.play === current?.slug;
      const on = isCurrent && playing;
      control.classList.toggle("is-playing", on);
      control.setAttribute("aria-pressed", String(on));
      const label = control.querySelector<HTMLElement>("[data-play-label]");
      if (label) {
        label.dataset.idle ??= label.textContent ?? "Play";
        label.textContent = on ? "Pause" : label.dataset.idle;
      }
    });
    if (dockToggle) {
      dockToggle.classList.toggle("is-playing", playing);
      dockToggle.setAttribute("aria-label", playing ? "Pause" : "Play");
    }
    if (dockTitle && current) {
      dockTitle.textContent = current.title;
      dockTitle.href = `/track/${current.slug}/`;
    }
  };

  const next = (): Track | undefined => {
    if (!current) return undefined;
    const index = tracks.indexOf(current);
    return tracks[(index + 1) % tracks.length];
  };

  const bindWidget = async (): Promise<void> => {
    if (!iframe || widget) return;
    try {
      await loadApi();
    } catch {
      return;
    }
    if (!window.SC) return;
    widget = window.SC.Widget(iframe);
    const { Events } = window.SC.Widget;
    widget.bind(Events.PLAY, () => {
      playing = true;
      render();
    });
    widget.bind(Events.PAUSE, () => {
      playing = false;
      render();
    });
    widget.bind(Events.FINISH, () => {
      playing = false;
      render();
      // Dock keeps the night going; track pages stop at the end of their song.
      const following = next();
      if (!inline && following && following !== current) start(following);
    });
  };

  const mountDock = (track: Track): void => {
    if (!dock) return;
    const slot = dock.querySelector<HTMLElement>("[data-dock-widget]");
    if (!slot) return;
    iframe = document.createElement("iframe");
    iframe.title = "SoundCloud player";
    iframe.allow = "autoplay";
    iframe.src = soundcloudWidgetUrl(track, true);
    slot.replaceChildren(iframe);
    dock.hidden = false;
    document.body.classList.add("has-dock");
    void bindWidget();
  };

  const start = (track: Track): void => {
    current = track;
    playing = true;
    render();
    if (!iframe) {
      mountDock(track);
      return;
    }
    if (widget) {
      widget.load(`https://api.soundcloud.com/tracks/${track.soundcloudId}`, { ...widgetParams(), auto_play: true });
    } else {
      iframe.src = soundcloudWidgetUrl(track, true);
      void bindWidget();
    }
  };

  const toggle = (track: Track): void => {
    if (current?.slug === track.slug && widget) {
      widget.isPaused((paused) => (paused ? widget?.play() : widget?.pause()));
      return;
    }
    if (current?.slug === track.slug && inline && !widget) {
      // Inline widget not bound yet: bind, then play.
      void bindWidget().then(() => widget?.play());
      playing = true;
      render();
      return;
    }
    start(track);
  };

  controls.forEach((control) => {
    control.setAttribute("role", "button");
    control.setAttribute("aria-pressed", "false");
    control.addEventListener("click", (event) => {
      const track = getTrack(control.dataset.play ?? "");
      if (!track) return;
      event.preventDefault();
      toggle(track);
    });
  });

  dockToggle?.addEventListener("click", () => {
    if (!widget) return;
    widget.isPaused((paused) => (paused ? widget?.play() : widget?.pause()));
  });

  dock?.querySelector<HTMLButtonElement>("[data-dock-close]")?.addEventListener("click", () => {
    widget?.pause();
    dock.hidden = true;
    document.body.classList.remove("has-dock");
    dock.querySelector("[data-dock-widget]")?.replaceChildren();
    iframe = inline;
    widget = null;
    playing = false;
    render();
  });

  // Track pages: bind the inline widget once it is near, so its own play button also syncs our controls.
  if (inline) void bindWidget();
};
