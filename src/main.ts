import "./style.css";
import { initializeGallery } from "./components/gallery";
import { markActiveNav } from "./components/nav";
import { renderTrackRows } from "./components/tracks";

renderTrackRows("#tracks");
initializeGallery();
markActiveNav();
