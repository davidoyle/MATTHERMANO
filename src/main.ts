type Track = {
  title: string;
  durationLabel: string;
  durationSeconds: number;
  link: string;
};

const tracks: Track[] = [
  {
    title: "Lost in your eyes",
    durationLabel: "3:33",
    durationSeconds: 213,
    link: "https://heymhmusic.com/track/3547680/lost-in-your-eyes",
  },
  {
    title: "One night love",
    durationLabel: "3:01",
    durationSeconds: 181,
    link: "https://heymhmusic.com/track/3657550/one-night-love",
  },
  {
    title: "Ghost me",
    durationLabel: "2:47",
    durationSeconds: 167,
    link: "https://heymhmusic.com/track/3920363/matt-hermano-ghost-me",
  },
];

const galleryImages: string[] = [
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ==.webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (1).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (2).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (3).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (4).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (5).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (6).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (7).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (8).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (9).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (10).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (11).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (12).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (13).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (14).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (15).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (16).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (17).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (18).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (19).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (20).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (21).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (22).webp",
  "meta_eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ== (23).webp",
  "meta_aeyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ==.webp",
];

const activeTimers = new Map<number, number>();

const toClock = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
};

const sectionLabel = (label: string): string => `
  <header class="section-header">
    <span>${label}</span>
    <div aria-hidden="true"></div>
  </header>
`;

const stopTrack = (index: number, button: HTMLButtonElement): void => {
  const timer = activeTimers.get(index);
  if (!timer) {
    return;
  }

  window.clearInterval(timer);
  activeTimers.delete(index);
  button.classList.remove("is-playing");
  button.setAttribute("aria-label", "Play preview");
};

const startPlayer = (
  index: number,
  progressBar: HTMLSpanElement,
  currentTimeNode: HTMLElement,
  button: HTMLButtonElement,
  totalDuration: number,
): void => {
  const previousTimer = activeTimers.get(index);

  if (previousTimer) {
    stopTrack(index, button);
    return;
  }

  button.classList.add("is-playing");
  button.setAttribute("aria-label", "Pause preview");

  let elapsed = Number(progressBar.dataset.elapsed ?? 0);

  const timer = window.setInterval(() => {
    elapsed += 1;
    progressBar.dataset.elapsed = elapsed.toString();

    const ratio = Math.min(elapsed / totalDuration, 1);
    progressBar.style.width = `${ratio * 100}%`;
    currentTimeNode.textContent = toClock(elapsed);

    if (elapsed >= totalDuration) {
      window.clearInterval(timer);
      activeTimers.delete(index);
      button.classList.remove("is-playing");
      button.setAttribute("aria-label", "Play preview");
    }
  }, 1000);

  activeTimers.set(index, timer);
};

const initializeTracks = (): void => {
  const trackList = document.querySelector<HTMLDivElement>("#tracks");

  if (!trackList) {
    return;
  }

  trackList.innerHTML = sectionLabel("Music") + '<div class="track-list"></div>';
  const trackRows = trackList.querySelector<HTMLDivElement>(".track-list");

  if (!trackRows) {
    return;
  }

  tracks.forEach((track, index) => {
    const row = document.createElement("article");
    row.className = "track-row";

    const headingId = `track-${index}-title`;

    row.innerHTML = `
      <span class="track-number">${String(index + 1).padStart(2, "0")}</span>
      <button type="button" class="play-button" aria-label="Play preview"></button>
      <div class="track-body" aria-labelledby="${headingId}">
        <h3 id="${headingId}">${track.title}</h3>
        <div class="waveform" aria-hidden="true">
          <span style="height: 25%"></span><span style="height: 50%"></span><span style="height: 35%"></span>
          <span style="height: 70%"></span><span style="height: 40%"></span><span style="height: 90%"></span>
          <span style="height: 50%"></span><span style="height: 80%"></span><span style="height: 60%"></span>
          <span style="height: 30%"></span><span style="height: 75%"></span><span style="height: 45%"></span>
          <span class="wave-progress"></span>
        </div>
      </div>
      <span class="duration">${track.durationLabel}</span>
      <a class="ghost-link" href="${track.link}" target="_blank" rel="noreferrer">Share</a>
      <span class="current-time" aria-live="polite">0:00</span>
    `;

    const button = row.querySelector<HTMLButtonElement>(".play-button");
    const progressBar = row.querySelector<HTMLSpanElement>(".wave-progress");
    const currentTimeNode = row.querySelector<HTMLElement>(".current-time");

    if (button && progressBar && currentTimeNode) {
      button.addEventListener("click", () => {
        startPlayer(index, progressBar, currentTimeNode, button, track.durationSeconds);
      });
    }

    trackRows.append(row);
  });
};

const initializeGallery = (): void => {
  const galleryNode = document.querySelector<HTMLDivElement>("#gallery-grid");
  if (!galleryNode) {
    return;
  }

  galleryImages.forEach((image, index) => {
    const figure = document.createElement("figure");
    figure.className = "gallery-item";

    const img = document.createElement("img");
    img.src = `./${encodeURIComponent(image).replace(/%2F/g, "/")}`;
    img.alt = `Matt Hermano gallery photo ${index + 1}`;
    img.loading = "lazy";

    figure.append(img);
    galleryNode.append(figure);
  });
};


const initializeBookingForm = (): void => {
  const bookingForm = document.querySelector<HTMLFormElement>(".booking-form");

  if (!bookingForm) {
    return;
  }

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    bookingForm.reset();

    let confirmation = bookingForm.nextElementSibling as HTMLParagraphElement | null;
    if (!confirmation || !confirmation.classList.contains("form-confirmation")) {
      confirmation = document.createElement("p");
      confirmation.className = "form-confirmation";
      bookingForm.insertAdjacentElement("afterend", confirmation);
    }

    confirmation.textContent = "Thanks — your booking inquiry has been received. I will reply soon.";
  });
};

const initializeMobileMenu = (): void => {
  const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle");
  const navLinks = document.querySelector<HTMLUListElement>(".nav-links");

  if (!menuButton || !navLinks) {
    return;
  }

  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
};

initializeTracks();
initializeGallery();
initializeMobileMenu();
initializeBookingForm();
