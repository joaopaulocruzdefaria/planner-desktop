import { getDb } from "./db";
import type { Workspace, Page, Block, Event } from "../types";
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
  title: string,
): Promise<Page> {
  const db = await getDb();
  const id = nanoid();
  const now = Date.now();

  await db.execute(
    "INSERT INTO pages (id, workspace_id, title, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)",
    [id, workspaceId, title, now, now],
  );

  return { id, workspaceId, title, createdAt: now, updatedAt: now };
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
