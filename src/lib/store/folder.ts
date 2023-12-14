import { create } from "zustand";
import { sep } from "@tauri-apps/api/path";

import { folderDb } from "../db";
import { Folder } from "@/types";

interface FolderStore {
    folders: Folder[];
    fetchFolders: () => Promise<void>;
    addFolder: (folder: string) => void;
    deleteFolder: (folder: string) => void;
}

export const useFolderStore = create<FolderStore>((set, get) => ({
    folders: [],
    fetchFolders: async () => {
        const folder = await folderDb.getFolders();
        set({ folders: folder });
    },
    addFolder: async (path: string) => {
        const folderName = path.split(sep);
        const name = folderName[folderName.length - 1];

        await folderDb.insertFolder({ name, path });

        await get().fetchFolders();
    },
    deleteFolder: async (folderId: string) => {
        await folderDb.deleteFolder(folderId);

        await get().fetchFolders();
    },
}));
