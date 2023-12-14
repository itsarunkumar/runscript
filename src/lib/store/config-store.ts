import { homeDir, join } from "@tauri-apps/api/path";

import { LocalStore } from "./local-store";

import { Language } from "@/types";

class ConfigStore extends LocalStore {
    constructor(localDbPath: string) {
        super(localDbPath);
    }

    async setLanguage(lang: Language) {
        let oldLang = (await this.getStore("language")) as Language[];

        if (!oldLang) {
            oldLang = [];
        }

        const langExists = oldLang.find((l) => l.name === lang.name);

        if (langExists) {
            return;
        }

        await this.newStore("language", [...oldLang, lang]);
    }

    async removeLanguage(lang: Language) {
        let oldLang = (await this.getStore("language")) as Language[];

        const langExists = oldLang.filter((l) => l.name !== lang.name);

        await this.newStore("language", langExists);
    }

    async getLangAndCommand(extension: string) {
        const lang = (await this.getStore("language")) as Language[];

        const langExists = lang.find((l) => l.extension === extension);

        return langExists;
    }
}

const config = await join(await homeDir(), "runscript", "config.json");
export const appConfig = new ConfigStore(config);
