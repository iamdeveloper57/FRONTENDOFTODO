// Inject environment variable at build time
window.CONFIG = {
  API_URL: process.env.API_URL || "https://backend-2-mz8c.onrender.com/api", // fallback URL
};
