export interface Track {
  id: string;
  title: string;
  duration: string;
  spotifyId?: string;
  fallbackUrl?: string;
}

export const tracks: Track[] = [
  {
    id: "lost-in-your-eyes",
    title: "Lost in Your Eyes",
    duration: "3:33",
    spotifyId: "0kuTNBoL52fIatGLuJ7CJO"
  },
  {
    id: "ghost-me",
    title: "Ghost Me",
    duration: "2:47",
    spotifyId: "0ldl4VDhEEukukchrnVDhI"
  }
];

export const getTrackById = (id: string): Track | undefined => tracks.find((track) => track.id === id);
