export const initializeBookingForm = (): void => {
  const form = document.querySelector<HTMLFormElement>(".booking-form");
  if (!form) return;

  const status = document.createElement("p");
  status.className = "form-confirmation";
  status.setAttribute("aria-live", "polite");
  form.append(status);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("Unable to submit form");
      }

      form.reset();
      status.textContent = "Thanks — your booking request has been sent.";
    } catch {
      status.textContent = "Something went wrong. Please email directly if this persists.";
    }
  });
};
