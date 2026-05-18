import { Pool } from "pg";

import { type Project, ProjectSchema } from "@/lib/schemas/project";

declare global {
  var viralForgePgPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

export function isDatabaseConfigured() {
  return Boolean(connectionString);
}

function getPool() {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.viralForgePgPool) {
    globalThis.viralForgePgPool = new Pool({
      connectionString,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    });
  }

  return globalThis.viralForgePgPool;
}

async function ensureProjectTable() {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS projects_updated_at_idx
    ON projects (updated_at DESC);
  `);
}

export async function readProjectsFromDatabase() {
  await ensureProjectTable();

  const result = await getPool().query<{ data: unknown }>(
    "SELECT data FROM projects ORDER BY created_at DESC",
  );

  return ProjectSchema.array().parse(result.rows.map((row) => row.data));
}

export async function writeProjectsToDatabase(projects: Project[]) {
  await ensureProjectTable();

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const project of projects) {
      const parsed = ProjectSchema.parse(project);

      await client.query(
        `
          INSERT INTO projects (id, data, created_at, updated_at)
          VALUES ($1, $2::jsonb, $3::timestamptz, $4::timestamptz)
          ON CONFLICT (id)
          DO UPDATE SET
            data = EXCLUDED.data,
            created_at = EXCLUDED.created_at,
            updated_at = EXCLUDED.updated_at
        `,
        [
          parsed.id,
          JSON.stringify(parsed),
          parsed.created_at,
          parsed.updated_at,
        ],
      );
    }

    if (projects.length === 0) {
      await client.query("DELETE FROM projects");
    } else {
      await client.query(
        "DELETE FROM projects WHERE id <> ALL($1::text[])",
        [projects.map((project) => project.id)],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
