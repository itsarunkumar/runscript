import { Language } from "@/types";
import { create } from "zustand";

import { appConfig } from "./config-store";

interface LanguageStore {
    languages: Language[];
    fetchLanguages: () => Promise<void>;
    addLanguage: (lang: Language) => Promise<void>;
    removeLanguage: (lang: Language) => Promise<void>;
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
    languages: [],
    fetchLanguages: async () => {
        const lang = await appConfig.getStore("language");

        set({ languages: lang as Language[] });
    },
    addLanguage: async (lang: Language) => {
        await appConfig.setLanguage(lang);
        await get().fetchLanguages();
    },
    removeLanguage: async (lang: Language) => {
        await appConfig.removeLanguage(lang);

        await get().fetchLanguages();
    },
}));
