---
trigger: model_decision
description: Use this when setting up the project, installing new packages, or building core logic. It forces the AI to use the exact framework versions (Tauri, Vite, React 19) and prevents it from hallucinating outdated libraries.
---

# 🛠️ Tech Stack & AI Guidelines
**Project:** Minimalist Notion-like Desktop App
**Architecture:** Local-first, Offline-capable Desktop Application

> **⚠️ STRICT RULE FOR LLMs / AGENTS:** > Do NOT deviate from these libraries or versions. Do NOT suggest outdated packages (e.g., Moment.js, Redux, Electron). Always prioritize the official documentation linked below for code generation and API references.

## 1. Core Stack & Exact Versions
* **Desktop Framework:** Tauri `v2.x` (Use Tauri 2.0 APIs, not v1)
* **Frontend Build Tool:** Vite `v6.x`
* **UI Library:** React `v19.x` (Use React 19 hooks and compiler optimizations)
* **Language:** TypeScript `v5.7+` (Strict mode: ON)
* **Styling:** Tailwind CSS `v4.x` (Use the new CSS-only configuration paradigm)

## 2. Task-Specific Libraries
* **State Management:** `zustand` (v5.x) - *Do not use Redux or Context API for complex global state.*
* **Rich Text Editor:** `@tiptap/react` & `@tiptap/pm` (v2.x) - *Headless implementation, styled via Tailwind.*
* **Local Database:** `@tauri-apps/plugin-sql` (v2.x) - *Connecting to local SQLite.*
* **Routing:** `react-router` (v7.x) - *Use the modern data router API.*
* **Date Manipulation:** `date-fns` (v4.x) - *Do NOT use Moment.js or Day.js.*
* **Icons:** `lucide-react`
* **HTTP Requests (External APIs):** Native `fetch` API or `@tauri-apps/plugin-http` - *Do NOT use Axios.*
* **Unique ID Generation:** `nanoid` (or `crypto.randomUUID()` native) - *Do NOT use uuidv4.*

## 3. Official Documentation Links (Source of Truth)
When generating code or solving errors, consult these URLs first:
* **Tauri v2:** https://v2.tauri.app/
* **React 19:** https://react.dev/
* **Tailwind v4:** https://tailwindcss.com/docs
* **Zustand:** https://zustand-demo.pmnd.rs/
* **Tiptap:** https://tiptap.dev/docs/editor
* **React Router v7:** https://reactrouter.com/
* **Tauri SQL Plugin:** https://v2.tauri.app/plugin/sql/

## 4. Architectural Rules
* **Local-First:** All core data MUST be saved to the local SQLite database first. 
* **Minimalism:** Avoid adding new dependencies unless absolutely necessary.
* **UI/UX:** Components must be headless where possible, heavily relying on Tailwind CSS for a clean, distraction-free interface.