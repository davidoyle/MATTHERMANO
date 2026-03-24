"use strict";
const tracks = [
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
const activeTimers = new Map();
const toClock = (seconds) => {
    const mins = Math.floor(seconds / 60)
        .toString()
        .padStart(1, "0");
    const secs = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
    return `${mins}:${secs}`;
};
const startPlayer = (index, progressBar, currentTimeNode, button, totalDuration) => {
    const previousTimer = activeTimers.get(index);
    if (previousTimer) {
        window.clearInterval(previousTimer);
        activeTimers.delete(index);
        button.textContent = "Play";
        return;
    }
    button.textContent = "Pause";
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
            button.textContent = "Play";
        }
    }, 1000);
    activeTimers.set(index, timer);
};
const trackList = document.querySelector("#tracks");
if (trackList) {
    tracks.forEach((track, index) => {
        const card = document.createElement("article");
        card.className = "track";
        const headingId = `track-${index}-title`;
        card.innerHTML = `
      <div class="track-header">
        <h3 id="${headingId}">${track.title}</h3>
        <a href="${track.link}" target="_blank" rel="noreferrer">Share</a>
      </div>
      <div class="player" aria-labelledby="${headingId}">
        <button type="button">Play</button>
        <div class="progress"><span></span></div>
        <span>${track.durationLabel}</span>
      </div>
      <div class="meta">
        <span class="current-time">0:00</span>
        <a href="${track.link}" target="_blank" rel="noreferrer">Track page</a>
      </div>
    `;
        const button = card.querySelector("button");
        const progressBar = card.querySelector(".progress > span");
        const currentTimeNode = card.querySelector(".current-time");
        if (button && progressBar && currentTimeNode) {
            button.addEventListener("click", () => {
                startPlayer(index, progressBar, currentTimeNode, button, track.durationSeconds);
            });
        }
        trackList.append(card);
    });
}
