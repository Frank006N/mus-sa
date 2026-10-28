import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@/db/schema";

const sqlite = new Database("local.db");
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// CRITICAL FIX: Serialize arrays and dates for SQLite compatibility
sqlite.function("serialize_json", (val: any) => JSON.stringify(val));
sqlite.function("parse_json", (val: string) => (val ? JSON.parse(val) : null));

export const db = drizzle(sqlite, { 
  schema,
  // Force primitive binding for SQLite
  logger: false 
});
