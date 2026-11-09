import "./style.css";
import { initializeBookingForm } from "./components/booking";
import { initializeCalendar } from "./components/calendar";
import { initializeCarousel } from "./components/carousel";
import { initializeGallery } from "./components/gallery";
import { initializeNavMenu } from "./components/nav";
import { initializePlayer } from "./components/player";
import { initializeYouTube } from "./components/youtube";

initializeNavMenu();
initializePlayer();
initializeYouTube();
initializeCarousel();
initializeGallery();
initializeCalendar();
initializeBookingForm();
