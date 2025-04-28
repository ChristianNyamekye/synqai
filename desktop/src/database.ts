import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Memory, Scope } from "@synqai/shared";
import { encrypt, decrypt, generateMemoryId } from "@synqai/shared";

let db: any;

export const setupDatabase = async () => {
  db = await open({
    filename: "synqai.db",
    driver: sqlite3.Database,
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      scope TEXT NOT NULL,
      data TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      embedding TEXT,
      metadata TEXT
    );

    CREATE TABLE IF NOT EXISTS permissions (
      agent_id TEXT NOT NULL,
      scope TEXT NOT NULL,
      granted_at INTEGER NOT NULL,
      expires_at INTEGER,
      PRIMARY KEY (agent_id, scope)
    );

    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      version TEXT NOT NULL,
      required_scopes TEXT NOT NULL,
      optional_scopes TEXT NOT NULL,
      price REAL,
      subscription BOOLEAN,
      container_image TEXT,
      container_port INTEGER,
      container_env TEXT
    );
  `);
};

// Memory store operations
export const getMemory = async (scope: Scope): Promise<any> => {
  const rows = await db.all("SELECT * FROM memories WHERE scope = ?", scope);
  return rows.map((row: any) => ({
    ...row,
    data: decrypt(row.data, process.env.ENCRYPTION_KEY || "default-key"),
    embedding: row.embedding ? JSON.parse(row.embedding) : undefined,
    metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
  }));
};

export const storeMemory = async (scope: Scope, data: any): Promise<void> => {
  const memory: Memory = {
    id: generateMemoryId(scope, data),
    scope,
    data,
    timestamp: Date.now(),
  };

  await db.run(
    "INSERT OR REPLACE INTO memories (id, scope, data, timestamp, embedding, metadata) VALUES (?, ?, ?, ?, ?, ?)",
    [
      memory.id,
      memory.scope,
      encrypt(memory.data, process.env.ENCRYPTION_KEY || "default-key"),
      memory.timestamp,
      memory.embedding ? JSON.stringify(memory.embedding) : null,
      memory.metadata ? JSON.stringify(memory.metadata) : null,
    ]
  );
};

// Permission operations
export const getPermissions = async (agentId: string): Promise<any[]> => {
  return db.all("SELECT * FROM permissions WHERE agent_id = ?", agentId);
};

export const grantPermission = async (
  agentId: string,
  scope: Scope,
  expiresAt?: number
): Promise<void> => {
  await db.run(
    "INSERT OR REPLACE INTO permissions (agent_id, scope, granted_at, expires_at) VALUES (?, ?, ?, ?)",
    [agentId, scope, Date.now(), expiresAt]
  );
};

export const revokePermission = async (
  agentId: string,
  scope: Scope
): Promise<void> => {
  await db.run("DELETE FROM permissions WHERE agent_id = ? AND scope = ?", [
    agentId,
    scope,
  ]);
};

// Agent operations
export const registerAgent = async (agent: any): Promise<void> => {
  await db.run(
    "INSERT OR REPLACE INTO agents (id, name, description, version, required_scopes, optional_scopes, price, subscription, container_image, container_port, container_env) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      agent.id,
      agent.name,
      agent.description,
      agent.version,
      JSON.stringify(agent.requiredScopes),
      JSON.stringify(agent.optionalScopes),
      agent.price,
      agent.subscription,
      agent.container.image,
      agent.container.port,
      JSON.stringify(agent.container.env),
    ]
  );
};

export const unregisterAgent = async (agentId: string): Promise<void> => {
  await db.run("DELETE FROM agents WHERE id = ?", agentId);
  await db.run("DELETE FROM permissions WHERE agent_id = ?", agentId);
};
