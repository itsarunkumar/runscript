import { Store } from "tauri-plugin-store-api";
import { homeDir, join } from "@tauri-apps/api/path";

interface Language {
  name: string;
  extension: string;
  command: string;
}

class ConfigManager {
  private store!: Store;

  constructor() {
    this.initStore();
  }

  private async initStore() {
    const configPath = await join(await homeDir(), "runscript", "config.json");
    this.store = new Store(configPath);
  }

  async newStore(key: string, value: any) {
    await this.store.set(key, value);
    this.store.save();
  }

  async getStore(key: string) {
    const result_store = await this.store.get(key);

    return result_store;
  }

  async setLanguage(lang: string, extension: string, command: string) {
    const prev = ((await this.store.get("language")) as Language[]) || [];

    const exists = prev.find((item) => item.name === lang);

    console.log("lang exists", exists);
    if (exists) {
      return;
    }

    prev.push({
      name: lang,
      extension,
      command,
    });

    await this.store.set("language", prev);
    await this.store.save();
  }

  async getLanguageCommands(): Promise<Language[]> {
    return (await this.store.get("language")) as Language[];
  }
}

export const appConfig = new ConfigManager();
