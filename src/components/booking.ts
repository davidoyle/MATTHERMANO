import { site } from "../data/site";

export const initializeBookingForm = (): void => {
  const form = document.querySelector<HTMLFormElement>(".booking-form");
  if (!form) return;

  const status = document.createElement("p");
  status.className = "form-status";
  status.setAttribute("aria-live", "polite");
  form.append(status);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector<HTMLButtonElement>("button[type=submit]");
    status.textContent = "Sending...";
    if (button) button.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Unable to submit form");
      form.reset();
      status.textContent = "Thank you. Your inquiry is on its way to Matt.";
    } catch {
      status.innerHTML = `That did not go through. Please email <a href="mailto:${site.email}">${site.email}</a> instead.`;
    } finally {
      if (button) button.disabled = false;
    }
  });
};
