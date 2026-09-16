// Single source of truth for SEO + metadata.
// If the domain ever changes again, update SITE_URL only.

export const SITE_URL = "https://hayasaka.8man.in";
export const SITE_NAME = "Meow";
export const SITE_BRAND = "Meow Music";
export const SITE_TAGLINE = "High Fidelity Streaming, MP3 Downloads & 10-Band Studio EQ";

export const DEFAULT_TITLE = `${SITE_NAME} - ${SITE_TAGLINE}`;
export const DEFAULT_DESCRIPTION =
  "Meow is a modern liquid-glass music streaming experience with a 10-band studio equalizer, real-time visualizer, and free high quality streaming without ads.";

export const DEFAULT_KEYWORDS = [
  "meow",
  "meow music",
  "meow app",
  "music streaming",
  "equalizer music player",
  "free music streaming",
  "free music download",
  "mp3 download",
  "online music player",
  "listen songs online",
  "hindi songs",
  "bollywood songs",
  "punjabi songs",
  "english songs",
  "tamil songs",
  "telugu songs",
  "latest songs",
  "trending songs",
  "new songs 2026",
  "music playlists",
  "high quality audio streaming",
];

export const OG_IMAGE = "/icon-512x512.png";
export const TWITTER_HANDLE = "@meow_music";

export const ORG_CONTACT_EMAIL = "fryingpanuu@gmail.com";

// Used only when we need an absolute URL for image/og fields.
export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
