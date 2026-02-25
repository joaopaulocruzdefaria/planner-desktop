---
trigger: model_decision
description: Inject this strictly when building or tweaking UI components and Tailwind CSS. It ensures the AI strictly follows your minimalist Notion-like color palette, typography, spacing, and fluid desktop window layout rules.
---

# 🎨 Design System & UI Guidelines

**Project:** Minimalist Notion-like Desktop App
**Aesthetic:** Clean, monochrome focus, high-contrast typography, distraction-free.

> **⚠️ STRICT RULE FOR LLMs / AGENTS:** > Do NOT use arbitrary hex codes, padding, or text sizes. Strictly adhere to the Tailwind CSS v4 variables and the palette defined below. Do NOT import heavy component libraries (e.g., Material UI, Ant Design, Bootstrap, Chakra UI). Build custom components using purely Tailwind CSS.

## 1. Color Palette (Notion-Inspired)

Keep the UI monochrome and neutral, using color only for specific actions, tags, or subtle states.

- **Backgrounds:**
  - App Background (Light): `#FFFFFF` (Tailwind: `bg-white`)
  - Sidebar Background (Light): `#F7F7F5` (Tailwind: `bg-stone-50`)
  - Hover/Active State: `#EFEFED` (Tailwind: `bg-stone-100`)
- **Typography:**
  - Primary Text: `#37352F` (Tailwind: `text-stone-800`)
  - Muted Text (Dates, placeholders): `#9B9A97` (Tailwind: `text-stone-400`)
- **Borders & Dividers:**
  - Subtle Divider: `#E9E9E7` (Tailwind: `border-stone-200`)
- **Accents (Use sparingly):**
  - Action/Link Blue: `#2383E2` (Tailwind: `text-blue-500`)
  - Destructive Red: `#EB5757` (Tailwind: `text-red-500`)

## 2. Typography Rules

Readability and a premium "technical/editorial" feel are the priority.

- **Font Family (Primary):** Use system sans-serif fonts by default to feel native, or `Inter`.
- **Font Family (Display/Headers):** Use a high-quality Serif font (e.g., `EB Garamond`, `Newsreader`, or generic `ui-serif`) for large headings or welcome screens to give a premium journal feel.
- **Font Family (Technical/Inputs):** Use monospace fonts (`font-mono`) for labels, code blocks, or small technical details.
- **Scale:** Use strict Tailwind utility classes:
  - Regular Body: `text-base leading-relaxed` (16px)
  - Small UI text (Sidebar, metadata): `text-sm leading-tight font-mono` (14px)
  - Heading 1 (Page Title): `text-4xl font-serif tracking-tight`
  - Heading 2: `text-2xl font-serif`
  - Heading 3: `text-xl font-medium`

## 3. Spacing, Sizing & Component Geometry

- Strictly use the standard Tailwind 4px spacing scale (e.g., `p-2`, `m-4`, `gap-6`).
- Avoid "magic numbers" (e.g., `w-[117px]`).
- **Geometry:** Embrace sharp corners (`rounded-none` or `rounded-sm`). Avoid highly rounded corners.
- **Borders:** Use crisp, 1px solid borders (`border-stone-200` or `border-stone-800`). Avoid soft drop shadows (`shadow-md`). Rely on grid lines and spacing for depth.
- **Buttons & Inputs:** Keep them stark and minimal. Standard padding for UI elements: `px-3 py-1.5` or `px-4 py-2`. Focus heavily on hover states (`hover:bg-stone-100`).

## 4. Layout & Responsiveness (Desktop Focus)

- **Fluid Window Layout:** This is a Desktop app (Tauri). Design for resizable windows, not mobile phones.
- Use `flex` and `grid` extensively to manage main content areas and sidebars.
- Ensure sidebars can be toggled or collapsed smoothly.
- Main text editor container should have a maximum width (e.g., `max-w-3xl` or `max-w-4xl`) and be centered on the screen (`mx-auto`) to maintain readable line lengths.

## 5. UI Components Policy

- **Core Styling:** Pure Tailwind CSS v4.
- **Icons:** `lucide-react` (Stroke width: 1.5 for a lighter, cleaner look).
- **Complex Accessible Components (Dropdowns, Modals):** If absolutely necessary, use `@radix-ui/react-primitives` unstyled, and style them manually with Tailwind.
