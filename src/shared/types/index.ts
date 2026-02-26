// Domain Models
export interface Workspace {
  id: string;
  name: string;
  createdAt: number;
}

export interface Folder {
  id: string;
  workspaceId: string;
  name: string;
  createdAt: number;
}

export interface Page {
  id: string;
  workspaceId: string;
  folderId?: string | null;
  title: string;
  icon?: string;
  cover?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Block {
  id: string;
  pageId: string;
  type: string;
  content: string; // JSON string of Tiptap content
  orderIndex: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  pageId?: string; // Optional link to a Page
  createdAt: number;
}
