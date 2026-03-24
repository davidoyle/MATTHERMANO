import "./style.css";
import { initializeGallery } from "./components/gallery";
import { markActiveNav } from "./components/nav";
import { renderTrackRows } from "./components/tracks";

const bookingForm = document.querySelector<HTMLFormElement>(".booking-form");
if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    bookingForm.reset();

    let confirmation = document.querySelector<HTMLElement>(".form-confirmation");
    if (!confirmation) {
      confirmation = document.createElement("p");
      confirmation.className = "form-confirmation";
      bookingForm.insertAdjacentElement("afterend", confirmation);
    }

    confirmation.textContent = "Thanks — your booking inquiry has been sent. Matt will reply soon.";
  });
}

renderTrackRows("#tracks");
initializeGallery();
markActiveNav();
