export const initializeDecorativePlayer = (): void => {
  const rows = document.querySelectorAll<HTMLElement>(".track-row[data-target]");

  rows.forEach((row) => {
    const button = row.querySelector<HTMLButtonElement>(".track-play");
    const embed = document.querySelector<HTMLElement>(row.dataset.target ?? "");

    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      const willBeActive = !row.classList.contains("active");
      row.classList.toggle("active", willBeActive);
      button.setAttribute("aria-expanded", String(willBeActive));

      if (embed) {
        embed.hidden = !willBeActive;
      }
    });
  });
};
