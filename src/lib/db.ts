import Database from "tauri-plugin-sql-api";
import { homeDir } from "@tauri-apps/api/path";

import { idGenerator } from "./unique-id";

const path = `${await homeDir()}/runscript`;

export const db = await Database.load(`sqlite:${path}/rs.sqlite`);

export interface Folder {
  id?: string;
  name: string;
  path: string;
}

export async function getFolders() {
  return await db.select("SELECT * FROM folders");
}

export async function insertFolder(data: Folder) {
  await db.execute(
    "CREATE TABLE IF NOT EXISTS folders (id TEXT PRIMARY KEY UNIQUE, name TEXT unique, path TEXT unique)"
  );

  const folderId = idGenerator.generateUniqueId(); // Generate a UUID for the folder

  await db.execute(`INSERT INTO folders (id, name, path) VALUES ($1, $2, $3)`, [
    folderId + data.name,
    data.name,
    data.path,
  ]);

  const dbPath = await db.path;
  const result = await db.select("SELECT * FROM folders");

  console.log("from sqlite", dbPath, result);

  // await db.execute("DROP TABLE IF EXISTS folders;");
}

export async function deleteFolder(id: string | number) {
  await db.execute(`DELETE FROM folders WHERE id = '${id}'`);
}
