import type { NextConfig } from "next";

// Content Security Policy — allows Firebase, WAQI, Open-Meteo, Google Fonts
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.gstatic.com https://www.googleapis.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://*.googleusercontent.com https://lh3.googleusercontent.com",
  "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://api.waqi.info https://api.open-meteo.com https://api.electricitymap.org wss://*.firebaseio.com http://localhost:* http://127.0.0.1:*",
  "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy",     value: CSP },
          { key: "X-Frame-Options",             value: "DENY" },
          { key: "X-Content-Type-Options",      value: "nosniff" },
          { key: "Referrer-Policy",             value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control",      value: "on" },
          { key: "Permissions-Policy",          value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()" },
          { key: "Strict-Transport-Security",   value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
