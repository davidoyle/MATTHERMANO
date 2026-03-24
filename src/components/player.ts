export const initializeDecorativePlayer = (): void => {
  const rows = document.querySelectorAll<HTMLElement>(".track-row[data-target]");

  rows.forEach((row) => {
    const button = row.querySelector<HTMLButtonElement>(".track-play");
    const embed = document.querySelector<HTMLElement>(row.dataset.target ?? "");

    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      row.classList.toggle("active");
      if (embed) {
        embed.classList.toggle("active-embed");
      }
    });
  });
};
