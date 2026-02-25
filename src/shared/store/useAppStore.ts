import { create } from "zustand";
import type { Workspace, Page } from "../types";
import {
  fetchWorkspaces,
  createWorkspace,
  fetchPages,
  createPage,
} from "../db/queries";

interface AppState {
  // Data
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  pages: Page[];
  activePageId: string | null;

  // App Status
  isDbReady: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeStore: () => Promise<void>;
  selectWorkspace: (workspaceId: string) => Promise<void>;
  addNewWorkspace: (name: string) => Promise<void>;
  addNewPage: (title: string) => Promise<void>;
  setActivePage: (pageId: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  pages: [],
  activePageId: null,
  isDbReady: false,
  isLoading: true,
  error: null,

  initializeStore: async () => {
    try {
      set({ isLoading: true, error: null });
      const workspaces = await fetchWorkspaces();

      let currentWorkspace = null;
      let pages: Page[] = [];

      if (workspaces.length > 0) {
        currentWorkspace = workspaces[0];
        pages = await fetchPages(currentWorkspace.id);
      }

      set({
        workspaces,
        currentWorkspace,
        pages,
        activePageId: pages.length > 0 ? pages[0].id : null,
        isDbReady: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to initialize store:", error);
      set({ error: String(error), isLoading: false, isDbReady: false });
    }
  },

  selectWorkspace: async (workspaceId: string) => {
    const { workspaces } = get();
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (!workspace) return;

    try {
      set({ isLoading: true });
      const pages = await fetchPages(workspace.id);
      set({
        currentWorkspace: workspace,
        pages,
        activePageId: pages.length > 0 ? pages[0].id : null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  addNewWorkspace: async (name: string) => {
    try {
      const newWorkspace = await createWorkspace(name);
      set((state) => ({
        workspaces: [newWorkspace, ...state.workspaces],
      }));
      await get().selectWorkspace(newWorkspace.id);
    } catch (error) {
      set({ error: String(error) });
    }
  },

  addNewPage: async (title: string) => {
    const { currentWorkspace } = get();
    if (!currentWorkspace) return;

    try {
      const newPage = await createPage(currentWorkspace.id, title);
      set((state) => ({
        pages: [newPage, ...state.pages],
        activePageId: newPage.id,
      }));
    } catch (error) {
      set({ error: String(error) });
    }
  },

  setActivePage: (pageId: string) => {
    set({ activePageId: pageId });
  },
}));
