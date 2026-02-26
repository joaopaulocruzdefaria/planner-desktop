import Database from "@tauri-apps/plugin-sql";

const DB_NAME = "sqlite:planner.db";

// Check if we are running inside the Tauri window
const isTauri =
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

// A simple mock class to prevent the UI from crashing in a standard web browser
class MockDatabase {
  async execute() {
    return [];
  }
  async select() {
    return [];
  }
}

let dbInstance: Database | MockDatabase | null = null;

export async function getDb() {
  if (!isTauri) {
    if (!dbInstance) {
      console.warn(
        "Tauri API not found. Running in Browser mode with Mock DB.",
      );
      dbInstance = new MockDatabase();
    }
    return dbInstance as unknown as Database;
  }

  if (!dbInstance) {
    dbInstance = await Database.load(DB_NAME);
  }
  return dbInstance as Database;
}

export async function initDb() {
  if (!isTauri) {
    console.log("Mock Database initialized successfully (Browser Mode).");
    return;
  }

  const db = await getDb();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      folder_id TEXT,
      title TEXT NOT NULL,
      icon TEXT,
      cover TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
    )
  `);

  // Try to alter the table for existing databases (SQLite doesn't support IF NOT EXISTS on ALTER)
  try {
    await db.execute(
      "ALTER TABLE pages ADD COLUMN folder_id TEXT REFERENCES folders(id) ON DELETE SET NULL",
    );
  } catch (e) {
    // Column likely already exists
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS blocks (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      start_time INTEGER NOT NULL,
      end_time INTEGER NOT NULL,
      page_id TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE SET NULL
    )
  `);

  console.log("Database initialized successfully.");
}
