/*
 * Click-to-load YouTube. Each [data-yt] link shows a thumbnail and only swaps in
 * the real player when pressed, so pages do not pay for YouTube until someone watches.
 */

const embedSrc = (id: string): string => `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

const activate = (link: HTMLAnchorElement): void => {
  const id = link.dataset.yt;
  if (!id) return;
  const frame = document.createElement("iframe");
  frame.src = embedSrc(id);
  frame.title = link.dataset.ytTitle ?? "YouTube video";
  frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  frame.allowFullscreen = true;

  const holder = document.createElement("div");
  holder.className = `${link.className} is-live`;
  holder.dataset.ytLive = id;
  holder.append(frame);
  holder.dataset.ytFacade = link.outerHTML;
  link.replaceWith(holder);
  frame.focus();
};

/** Put a playing video back to its thumbnail (stops audio). */
export const resetVideos = (scope: ParentNode): void => {
  scope.querySelectorAll<HTMLElement>("[data-yt-live]").forEach((holder) => {
    const markup = holder.dataset.ytFacade;
    if (!markup) return;
    holder.insertAdjacentHTML("beforebegin", markup);
    holder.remove();
  });
};

export const initializeYouTube = (): void => {
  document.addEventListener("click", (event) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[data-yt]");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    // One video at a time across the page.
    resetVideos(document);
    activate(link);
  });
};
