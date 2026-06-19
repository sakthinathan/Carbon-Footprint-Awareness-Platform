# 🎨 EcoSentinel Frontend

A premium, modern React application for carbon footprint monitoring and optimization, built with Next.js 15, TypeScript, Tailwind CSS (v4), and Framer Motion.

---

## ✨ Features

*   **🔒 Session-based Authentication**: Full Google and Email Sign-In options integrated via Firebase Authentication.
*   **📊 Dynamic Carbon Dashboard**: Real-time emission calculations and interactive analytical charts showcasing carbon scope categorizations (Scope 1, 2, 3).
*   **🍃 Real-time Air Quality & Weather insights**: Connects with live weather parameters and Air Quality Index (AQI) reports with adaptive color alerts.
*   **🤖 Gemini-powered AI Advisor**: Interactive advisor terminal offering personalized suggestions and real-time generation animations.
*   **📋 Structured Carbon Logs**: Forms for quickly adding energy, waste, and transport metrics.
*   **📄 Report Export**: Localized PDF summaries generation using `jspdf` and `jspdf-autotable`.

---

## 📁 Directory Structure

```
frontend/
├── public/                 # Static assets (svgs, favicons)
├── src/
│   ├── app/                # Next.js App Router (Layouts and Pages)
│   │   ├── (auth)/         # Authentication flow (Login)
│   │   └── (dashboard)/    # Core dashboard sub-routes (Dashboard, Log, Analytics, AI Advisor, Environment)
│   ├── components/         # Reusable layouts, overlays, graphs, and UI modules
│   ├── hooks/              # Custom query, authorization, and notifications hooks
│   ├── infrastructure/     # API request clients (Axios configurations) & Firebase configurations
│   ├── lib/                # Local utilities, testing helpers, and mock datasets
│   └── types/              # Static TypeScript schema and types
├── package.json            # Scripts, project metadata, and dependency declarations
├── tsconfig.json           # TypeScript configuration
└── tailwind.config.ts      # CSS/Tailwind definitions (custom theme setups)
```

---

## 🚀 Commands

Make sure dependencies are installed using `npm install` inside the `frontend` folder.

```bash
# Run local hot-reload server (starts on http://localhost:3000)
npm run dev

# Build production bundle
npm run build

# Start production server locally after building
npm run start

# Run unit and component test suites (using Vitest)
npx vitest

# Open Vitest visual dashboard
npx vitest --ui
```

---

## ⚙️ Environment Configuration (`.env.local`)

Provide a `.env.local` file inside the `frontend/` directory with the following keys:

```ini
# FastAPI Backend URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Firebase Client configuration keys
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```
