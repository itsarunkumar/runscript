import Database from "tauri-plugin-sql-api";
import { BaseDirectory, homeDir } from "@tauri-apps/api/path";

import { idGenerator } from "./unique-id";
import { createDir, exists } from "@tauri-apps/api/fs";

export interface Folder {
  id?: string;
  name: string;
  path: string;
}

/* The `FolderManager` class is a singleton class that manages folders by initializing a database,
creating a table, and providing methods to retrieve, insert, delete, and drop folders. */
class FolderManager {
  private static instance: FolderManager | null = null;
  private db: Database | null = null;

  private constructor() {
    // private constructor to prevent external instantiation
  }

  /**
   * The function getInstance() returns an instance of the FolderManager class, creating it if it doesn't
   * already exist.
   * @returns The `FolderManager.instance` is being returned.
   */
  static getInstance(): FolderManager {
    if (!FolderManager.instance) {
      FolderManager.instance = new FolderManager();
      FolderManager.instance.initialize();
    }

    return FolderManager.instance;
  }

  /**
   * The function initializes a database by creating a directory, loading a SQLite database, and
   * creating a table.
   */
  private async initialize() {
    const path = `${await homeDir()}/runscript`;

    if (!(await exists(path, { dir: BaseDirectory.Home }))) {
      await createDir(path, { dir: BaseDirectory.Home });
    }

    this.db = await Database.load(`sqlite:${path}/rs.sqlite`);
    await this.createTable();
  }

  /**
   * The function creates a table named "folders" in a database if it doesn't already exist.
   */
  private async createTable() {
    if (this.db) {
      await this.db.execute(
        "CREATE TABLE IF NOT EXISTS folders (id TEXT PRIMARY KEY UNIQUE, name TEXT unique, path TEXT unique)"
      );
    }
  }

  /**
   * The function `getFolders` retrieves all folders from the database if it exists, otherwise it
   * returns an empty array.
   * @returns The function `getFolders` returns a promise that resolves to an array of `Folder`
   * objects. If the `db` property is defined, it executes a SQL query to select all rows from the
   * "folders" table and returns the result. If the `db` property is not defined, it simply returns an
   * empty array.
   */
  async getFolders(): Promise<Folder[]> {
    if (this.db) {
      return await this.db.select("SELECT * FROM folders");
    }
    return [];
  }

  /**
   * The `insertFolder` function inserts a new folder into a SQLite database and logs the database path
   * and the result of a select query.
   * @param {Folder} data - The `data` parameter is an object of type `Folder` that contains the
   * information about the folder to be inserted. It has the following properties:
   */
  async insertFolder(data: Folder): Promise<void> {
    if (this.db) {
      const folderId = idGenerator.generateUniqueId();
      await this.db.execute(
        `INSERT INTO folders (id, name, path) VALUES ($1, $2, $3)`,
        [folderId + data.name, data.name, data.path]
      );

      const dbPath = await this.db.path;
      const result = await this.db.select("SELECT * FROM folders");

      console.log("from sqlite", dbPath, result);
    }
  }

  /**
   * The function deletes a folder from a database based on its ID.
   * @param {string | number} id - The `id` parameter is a string or number that represents the unique
   * identifier of the folder that needs to be deleted.
   */
  async deleteFolder(id: string | number): Promise<void> {
    if (this.db) {
      await this.db.execute(`DELETE FROM folders WHERE id = $1 `, [id]);
    }
  }

  /**
   * The function `dropFolders` drops the `folders` table if it exists in the database.
   */
  async dropFolders(): Promise<void> {
    if (this.db) {
      await this.db.execute("DROP TABLE IF EXISTS folders;");
    }
  }
}

export const folderDb = FolderManager.getInstance();
