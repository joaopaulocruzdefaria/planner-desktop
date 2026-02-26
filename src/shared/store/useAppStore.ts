import { create } from "zustand";
import type { Workspace, Page, Folder } from "../types";
import {
  fetchWorkspaces,
  createWorkspace,
  fetchPages,
  createPage,
  fetchFolders,
  createFolder,
  updatePageFolder,
  updatePageTitle,
  updateFolderName,
  deleteFolder,
  deletePage,
} from "../db/queries";

interface AppState {
  // Data
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  folders: Folder[];
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
  addNewPage: (title: string, folderId?: string | null) => Promise<void>;
  setActivePage: (pageId: string) => void;
  // Folder Actions
  addNewFolder: (name: string) => Promise<void>;
  movePageToFolder: (pageId: string, folderId: string | null) => Promise<void>;
  createFolderFromPages: (
    sourcePageId: string,
    targetPageId: string,
    folderName: string,
  ) => Promise<void>;
  renameFolder: (folderId: string, newName: string) => Promise<void>;
  removeFolder: (folderId: string) => Promise<void>;

  // Page Actions
  renamePage: (pageId: string, newTitle: string) => Promise<void>;
  removePage: (pageId: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  folders: [],
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
      let folders: Folder[] = [];

      if (workspaces.length > 0) {
        currentWorkspace = workspaces[0];
        pages = await fetchPages(currentWorkspace.id);
        folders = await fetchFolders(currentWorkspace.id);
      }

      set({
        workspaces,
        currentWorkspace,
        folders,
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
      const folders = await fetchFolders(workspace.id);
      set({
        currentWorkspace: workspace,
        folders,
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

  addNewPage: async (title: string, folderId: string | null = null) => {
    const { currentWorkspace } = get();
    if (!currentWorkspace) return;

    try {
      const newPage = await createPage(currentWorkspace.id, folderId, title);
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

  addNewFolder: async (name: string) => {
    const { currentWorkspace } = get();
    if (!currentWorkspace) return;

    try {
      const newFolder = await createFolder(currentWorkspace.id, name);
      set((state) => ({ folders: [...state.folders, newFolder] }));
    } catch (error) {
      set({ error: String(error) });
    }
  },

  movePageToFolder: async (pageId: string, folderId: string | null) => {
    try {
      await updatePageFolder(pageId, folderId);
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId ? { ...p, folderId } : p,
        ),
      }));
    } catch (error) {
      set({ error: String(error) });
    }
  },

  createFolderFromPages: async (
    sourcePageId: string,
    targetPageId: string,
    folderName: string,
  ) => {
    const { currentWorkspace, movePageToFolder } = get();
    if (!currentWorkspace) return;

    try {
      // 1. Create the new folder
      const newFolder = await createFolder(currentWorkspace.id, folderName);
      set((state) => ({ folders: [...state.folders, newFolder] }));

      // 2. Move both pages into the new folder
      await movePageToFolder(sourcePageId, newFolder.id);
      await movePageToFolder(targetPageId, newFolder.id);
    } catch (error) {
      set({ error: String(error) });
    }
  },

  renamePage: async (pageId: string, newTitle: string) => {
    try {
      await updatePageTitle(pageId, newTitle);
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId ? { ...p, title: newTitle } : p,
        ),
      }));
    } catch (error) {
      set({ error: String(error) });
    }
  },

  removePage: async (pageId: string) => {
    try {
      await deletePage(pageId);
      set((state) => ({
        pages: state.pages.filter((p) => p.id !== pageId),
        activePageId:
          state.activePageId === pageId
            ? state.pages.find((p) => p.id !== pageId)?.id || null
            : state.activePageId,
      }));
    } catch (error) {
      set({ error: String(error) });
    }
  },

  renameFolder: async (folderId: string, newName: string) => {
    try {
      await updateFolderName(folderId, newName);
      set((state) => ({
        folders: state.folders.map((f) =>
          f.id === folderId ? { ...f, name: newName } : f,
        ),
      }));
    } catch (error) {
      set({ error: String(error) });
    }
  },

  removeFolder: async (folderId: string) => {
    try {
      await deleteFolder(folderId);
      set((state) => ({
        folders: state.folders.filter((f) => f.id !== folderId),
        // DB handles ON DELETE SET NULL for pages, so we update the cache to reflect "un-foldered" pages
        pages: state.pages.map((p) =>
          p.folderId === folderId ? { ...p, folderId: null } : p,
        ),
      }));
    } catch (error) {
      set({ error: String(error) });
    }
  },
}));
