import { create } from "zustand";
import { FileEntry, readDir } from "@tauri-apps/api/fs";
import { metadata } from "tauri-plugin-fs-extra-api";
import Fuse from "fuse.js";

import { Folder, folderDb } from "../db";

interface ScriptList {
  scripts: (FileEntry | null)[][];
  searchTerm: string;
  searchResults: (FileEntry | null)[];
  fetchScripts: () => Promise<void>;
  search: (searchTerm: string) => void;
}

export const useScriptList = create<ScriptList>((set, get) => ({
  scripts: [],
  searchTerm: "",
  searchResults: [],
  fetchScripts: async () => {
    const folders = (await folderDb.getFolders()) as Folder[];

    const entries = await Promise.all(
      folders.map(async (folder) => {
        const filesOnly = await readDir(folder.path);

        // Use Promise.all to perform the asynchronous operation for each file
        const filteredFiles = await Promise.all(
          filesOnly.map(async (file) => {
            // // Perform asynchronous operation for each file
            // const hasChildren = file.children ? true : false;
            // return hasChildren ? null : file;

            const meta = await metadata(file.path);

            if (meta.isDir) {
              return null;
            } else {
              return file;
            }
          })
        );

        // Filter out null values (entries with children)
        return filteredFiles.filter((file) => file !== null);
      })
    );
    const scripts = await Promise.all(entries);

    set({ scripts: scripts });
  },
  search: (searchTerm: string) => {
    if (!searchTerm || searchTerm.length === 0 || searchTerm === " ") {
      return (get().searchResults = []);
    }

    const flattenedData = get().scripts.flat();
    const fuse = new Fuse(flattenedData, {
      shouldSort: true,
      includeScore: true,
      threshold: 0.6,
      keys: ["name", "path"],
    });

    const results = fuse.search(searchTerm);
    const searchResults = results.map((result) => result.item);

    set({ searchTerm, searchResults });
  },
}));
