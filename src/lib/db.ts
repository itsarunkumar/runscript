import Database from "tauri-plugin-sql-api";
import { BaseDirectory, homeDir } from "@tauri-apps/api/path";
import { createDir, exists, readDir } from "@tauri-apps/api/fs";
import { metadata } from "tauri-plugin-fs-extra-api";

import { idGenerator } from "./unique-id";
// import { localStore } from "./store/local-store";
// import { ALL_SCRIPTS } from "./store/store-constants";

import { setScriptsInDb } from "./store/all-script-set";

import { Folder } from "@/types";

class FolderManager {
    private static instance: FolderManager | null = null;
    private db: Database | null = null;

    private constructor() {
        // private constructor to prevent external instantiation
    }

    static getInstance(): FolderManager {
        if (!FolderManager.instance) {
            FolderManager.instance = new FolderManager();
            FolderManager.instance.initialize();
        }

        return FolderManager.instance;
    }

    async initialize() {
        const path = `${await homeDir()}/runscript`;

        if (!(await exists(path, { dir: BaseDirectory.Home }))) {
            await createDir(path, { dir: BaseDirectory.Home });
        }

        this.db = await Database.load(`sqlite:${path}/rs.sqlite`);
        await this.createTable();

        await this.getScriptsFromFolders();
    }

    private async createTable() {
        if (this.db) {
            await this.db.execute(
                "CREATE TABLE IF NOT EXISTS folders (id TEXT PRIMARY KEY UNIQUE, name TEXT unique, path TEXT unique)"
            );
        }
    }

    async getFolders(): Promise<Folder[]> {
        if (this.db) {
            return await this.db.select("SELECT * FROM folders");
        }
        return [];
    }

    //   TODO: implement when the folder is added get the list of scripts in that folder and add it to the db.json in runscript dir in home
    private async getScriptsFromFolders() {
        if (!this.db) {
            return [];
        }

        const folders = (await this.db.select(
            "SELECT * FROM folders"
        )) as Folder[];

        const finalFolders = await Promise.all(
            folders.map(async (folder) => {
                const dirFiles = await readDir(folder.path);

                const scripts = await Promise.all(
                    dirFiles.map(async (file) => {
                        const meta = await metadata(file.path);
                        if (!meta.isDir) {
                            return {
                                name: file.name?.split(".")[0] || "unnamed",
                                fileName: file.name,
                                path: file.path,
                            };
                        }
                        return null;
                    })
                );

                return scripts.filter(Boolean); // Remove null values from the array
            })
        );

        const flattenedFolders = finalFolders.flat();

        // console.log("final folders ---> ", flattenedFolders);

        // localStore.newStore(ALL_SCRIPTS, flattenedFolders);
        await setScriptsInDb(flattenedFolders as Folder[]);
    }

    async insertFolder(data: Folder): Promise<void> {
        if (this.db) {
            const folderId = idGenerator.generateUniqueId();
            await this.db.execute(
                `INSERT INTO folders (id, name, path) VALUES ($1, $2, $3)`,
                [folderId + data.name, data.name, data.path]
            );

            await this.getScriptsFromFolders();
        }
    }

    async deleteFolder(id: string | number): Promise<void> {
        if (this.db) {
            await this.db.execute(`DELETE FROM folders WHERE id = $1 `, [id]);
        }
        await this.getScriptsFromFolders();
    }

    async dropFolders(): Promise<void> {
        if (this.db) {
            await this.db.execute("DROP TABLE IF EXISTS folders;");
        }
    }
}

export const folderDb = FolderManager.getInstance();
