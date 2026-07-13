import "./style.css";
import { initializeBookingForm } from "./components/booking";
import { initializeGallery } from "./components/gallery";
import { initializeNavMenu, markActiveNav } from "./components/nav";
import { renderTrackDetail } from "./components/track-detail";
import { renderTrackRows } from "./components/tracks";
import { initializeVideoCarousel } from "./components/videos";

renderTrackRows("#tracks .track-list");
initializeGallery();
markActiveNav();
initializeNavMenu();
initializeBookingForm();
initializeVideoCarousel("#video-carousel");
renderTrackDetail();
