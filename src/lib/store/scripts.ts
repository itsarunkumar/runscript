import { create } from "zustand";
import Fuse from "fuse.js";

import { localStore } from "./local-store";
import { ALL_SCRIPTS } from "./store-constants";

import { Script } from "@/types";

interface ScriptList {
    scripts: (Script | null)[];
    searchTerm: string;
    searchResults: (Script | null)[];
    fetchScripts: () => Promise<void>;
    editScript: (script: Script, name: string) => void;
    search: (searchTerm: string) => void;
}

export const useScriptList = create<ScriptList>((set, get) => ({
    scripts: [],
    searchTerm: "",
    searchResults: [],
    fetchScripts: async () => {
        const scripts = (await localStore.getStore(
            ALL_SCRIPTS
        )) as (Script | null)[];

        set({ scripts: scripts });
    },
    search: (searchTerm: string) => {
        if (!searchTerm) {
            set({ searchTerm, searchResults: [] });
            return;
        }

        const flattenedData = get().scripts.flat();
        const fuse = new Fuse(flattenedData, {
            shouldSort: true,
            includeScore: true,
            threshold: 0.6,
            keys: ["name", "path", "fileName"],
        });

        const results = fuse.search(searchTerm);
        const searchResults = results.map((result) => result.item);

        set({ searchTerm, searchResults });
    },
    editScript: async (script: Script, name: string) => {
        const oldScripts = (await localStore.getStore(ALL_SCRIPTS)) as Script[];
        const editScript = oldScripts.find((s) => s.path === script.path);

        const unEditedScripts = oldScripts.filter(
            (s) => s.path !== script.path
        );
        const newScripts = [...unEditedScripts, { ...editScript, name }];
        // console.log("from zus edit script", { ...editScript, name });
        // console.log("from zus unedit", unEditedScripts);
        await localStore.newStore(ALL_SCRIPTS, newScripts);

        await get().fetchScripts();
    },
}));
