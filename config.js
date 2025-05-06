// Inject environment variable at build time
window.CONFIG = {
  API_URL: process.env.API_URL || "https://default-api-url.com", // fallback URL
};
