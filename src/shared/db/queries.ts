import { getDb } from "./db";
import type { Workspace, Page, Block, Event, Folder } from "../types";
import { nanoid } from "nanoid";

// --- WORKSPACES ---
export async function fetchWorkspaces(): Promise<Workspace[]> {
  const db = await getDb();
  return await db.select<Workspace[]>(
    "SELECT * FROM workspaces ORDER BY created_at DESC",
  );
}

export async function createWorkspace(name: string): Promise<Workspace> {
  const db = await getDb();
  const id = nanoid();
  const createdAt = Date.now();

  await db.execute(
    "INSERT INTO workspaces (id, name, created_at) VALUES ($1, $2, $3)",
    [id, name, createdAt],
  );

  return { id, name, createdAt };
}

// --- FOLDERS ---
export async function fetchFolders(workspaceId: string): Promise<Folder[]> {
  const db = await getDb();
  return await db.select<Folder[]>(
    "SELECT * FROM folders WHERE workspace_id = $1 ORDER BY created_at ASC",
    [workspaceId],
  );
}

export async function createFolder(
  workspaceId: string,
  name: string,
): Promise<Folder> {
  const db = await getDb();
  const id = nanoid();
  const createdAt = Date.now();

  await db.execute(
    "INSERT INTO folders (id, workspace_id, name, created_at) VALUES ($1, $2, $3, $4)",
    [id, workspaceId, name, createdAt],
  );

  return { id, workspaceId, name, createdAt };
}

export async function updateFolderName(
  folderId: string,
  name: string,
): Promise<void> {
  const db = await getDb();
  await db.execute("UPDATE folders SET name = $1 WHERE id = $2", [
    name,
    folderId,
  ]);
}

export async function deleteFolder(folderId: string): Promise<void> {
  const db = await getDb();
  // Pages linked to this folder will have their folder_id set to NULL
  // because of ON DELETE SET NULL in our schema.
  await db.execute("DELETE FROM folders WHERE id = $1", [folderId]);
}

// --- PAGES ---
export async function fetchPages(workspaceId: string): Promise<Page[]> {
  const db = await getDb();
  return await db.select<Page[]>(
    "SELECT * FROM pages WHERE workspace_id = $1 ORDER BY updated_at DESC",
    [workspaceId],
  );
}

export async function createPage(
  workspaceId: string,
  folderId: string | null,
  title: string,
): Promise<Page> {
  const db = await getDb();
  const id = nanoid();
  const now = Date.now();

  await db.execute(
    "INSERT INTO pages (id, workspace_id, folder_id, title, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
    [id, workspaceId, folderId, title, now, now],
  );

  return { id, workspaceId, folderId, title, createdAt: now, updatedAt: now };
}

export async function updatePageFolder(
  pageId: string,
  folderId: string | null,
): Promise<void> {
  const db = await getDb();
  const now = Date.now();
  await db.execute(
    "UPDATE pages SET folder_id = $1, updated_at = $2 WHERE id = $3",
    [folderId, now, pageId],
  );
}

export async function updatePageTitle(
  pageId: string,
  title: string,
): Promise<void> {
  const db = await getDb();
  const now = Date.now();
  await db.execute(
    "UPDATE pages SET title = $1, updated_at = $2 WHERE id = $3",
    [title, now, pageId],
  );
}

export async function deletePage(pageId: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM pages WHERE id = $1", [pageId]);
}

// --- BLOCKS ---
export async function fetchBlocks(pageId: string): Promise<Block[]> {
  const db = await getDb();
  return await db.select<Block[]>(
    "SELECT * FROM blocks WHERE page_id = $1 ORDER BY order_index ASC",
    [pageId],
  );
}

// In a real scenario, saving blocks might involve syncing an array of blocks.
// For now, a simple insert/replace placeholder.
export async function saveBlock(
  block: Omit<Block, "id"> & { id?: string },
): Promise<Block> {
  const db = await getDb();
  const id = block.id || nanoid();

  await db.execute(
    "INSERT OR REPLACE INTO blocks (id, page_id, type, content, order_index) VALUES ($1, $2, $3, $4, $5)",
    [id, block.pageId, block.type, block.content, block.orderIndex],
  );

  return { ...block, id };
}

// --- EVENTS ---
export async function fetchEvents(): Promise<Event[]> {
  const db = await getDb();
  return await db.select<Event[]>(
    "SELECT * FROM events ORDER BY start_time ASC",
  );
}
