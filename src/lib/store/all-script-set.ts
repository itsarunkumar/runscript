import { Store } from "tauri-plugin-store-api";
import { join, homeDir } from "@tauri-apps/api/path";

import { Folder } from "@/types";
import { ALL_SCRIPTS } from "./store-constants";

const localDbPath = await join(await homeDir(), "runscript", "db.json");

const store = new Store(localDbPath);

export async function setScriptsInDb(scripts: Folder[]) {
    let oldScripts = (await store.get(ALL_SCRIPTS)) as Folder[];

    if (!oldScripts) {
        oldScripts = [];
    }

    // Compare the old scripts with the new scripts by path
    const uniqueNewScripts = scripts.filter((newScript) => {
        return !oldScripts.some(
            (oldScript) => oldScript.path === newScript.path
        );
    });

    // Combine old scripts with unique new scripts
    const updatedScripts = [...oldScripts, ...uniqueNewScripts];

    // Save the updated scripts in the store
    await store.set(ALL_SCRIPTS, updatedScripts);

    await store.save();
}
