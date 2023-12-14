import { Store } from "tauri-plugin-store-api";
import { homeDir, join } from "@tauri-apps/api/path";

export class LocalStore {
    private store!: Store;
    private localDbPath: string;

    constructor(localDbPath: string) {
        this.localDbPath = localDbPath;
        this.initStore();
    }

    private async initStore() {
        this.store = new Store(this.localDbPath);
    }

    async newStore(key: string, value: any) {
        if (!this.store) {
            await this.initStore();
        }

        // Implement the logic to set a new value in the store
        await this.store.set(key, value);

        await this.store.save();

        return await this.store.get(key);
    }

    async getStore(key: string) {
        // Implement the logic to retrieve a value from the store
        const resultStore = await this.store.get(key);
        return resultStore;
    }

    async allEntriesFromStore() {
        return await this.store.entries();
    }
}

const localDbPath = await join(await homeDir(), "runscript", "db.json");

export const localStore = new LocalStore(localDbPath);
