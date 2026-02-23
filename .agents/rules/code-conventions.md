---
trigger: model_decision
description: Always use this when generating, refactoring, or reviewing TypeScript/React code. It guarantees strict typings (no any), proper error handling, feature-sliced folder structure, and completely prevents spaghetti code.
---

# 💻 Code Conventions & Architecture
**Project:** Minimalist Notion-like Desktop App

> **⚠️ STRICT RULE FOR LLMs / AGENTS:** > Do NOT write spaghetti code. Strictly enforce separation of concerns. UI components must be dumb (presentation only) whenever possible, delegating business logic to custom hooks or Zustand stores.

## 1. Naming Conventions
* **Components:** `cascalCase` for both the file name and the function name (e.g., `Sidebar.tsx`, `PageEditor.tsx`).
* **Functions & Variables:** `camelCase` (e.g., `fetchPages`, `isSidebarOpen`).
* **Interfaces & Types:** `PascalCase`. Do NOT prefix with 'I' (e.g., use `User`, not `IUser`).
* **Hooks:** Must start with `use` and be `camelCase` (e.g., `useDatabase`, `useKeyboardShortcuts`).
* **Utility Files:** `camelCase` for files containing helper functions (e.g., `dateUtils.ts`, `db.ts`).

## 2. TypeScript Rules
* **Strict Mode:** TypeScript strict mode is ON.
* **The "No Any" Policy:** NEVER use `any`. If a type is truly unknown at runtime, use `unknown` and narrow it down with type guards.
* **Props Definition:** Always define a `Props` interface directly above the component function. Do not use `React.FC`.
  ```typescript
  interface ButtonProps {
    label: string;
    onClick: () => void;
  }
  export function Button({ label, onClick }: ButtonProps) { ... }