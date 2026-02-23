---
trigger: model_decision
description: Use this when starting a new feature, modeling the SQLite database, or making architectural decisions. It teaches the AI your business logic, exact terminology (like "Blocks" vs "Pages"), and the local-first philosophy.
---

# 🧠 Project Context & Business Rules
**Project:** Minimalist Notion-like Desktop App

## 1. The Application & The User
This application is a lightning-fast, distraction-free, local-first productivity tool. It combines a block-based text editor (like Notion) with a minimal agenda/calendar system. 

**The Target Audience:** Professionals, writers, and students who are overwhelmed by heavy, cloud-dependent, slow tools. They want an app that opens instantly, works 100% offline, guarantees extreme privacy (data lives on their own hard drive via SQLite), and gets out of their way so they can focus on writing and organizing their day. The keyword is *frictionless*.

## 2. Ubiquitous Language (Business Terminology)
To maintain consistency, ALWAYS use these exact terms when naming database tables, variables, and UI elements:

* **Page (Página):** The main document entity. A Page has a title, optional metadata (like an icon or cover), and contains Blocks.
* **Block (Bloco):** The atomic unit of content inside a Page. A paragraph is a block, a heading is a block, a to-do checkbox is a block. Blocks can be reordered. (Powered by Tiptap).
* **Workspace (Espaço de Trabalho):** The overarching container for all Pages. Even if the app is local and single-user, the root level is the Workspace.
* **Event (Evento / Agenda):** A time-bound entry meant for the calendar/agenda feature. It has a start time, end time, and can optionally be linked to a Page.
* **Local-First:** This means the SQLite database is the absolute source of truth. We do not wait for cloud synchronization to render the UI.

## 3. Core Philosophy
If a feature makes the app much slower, clunkier, or requires a constant internet connection to function basically, it does not belong in this project.