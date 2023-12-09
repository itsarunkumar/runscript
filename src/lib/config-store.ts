import { Store } from "tauri-plugin-store-api";
import { homeDir, join } from "@tauri-apps/api/path";

const config = await join(await homeDir(), "runscript", "config.json");

const store = new Store(config);

export async function setStore() {
  await store.set("some-key", {
    value: Math.floor(Math.random() * 100),
  });

  const val = await store.get("some-key");
  console.log("val", val);

  const res = await store.save();
  console.log("res", res);
}

// this manually saves the store, otherwise the store is only saved when your app is closed

export async function setLanguage(
  lang: string,
  extension: string,
  command: string
) {
  const prev =
    ((await store.get("language")) as Array<Record<string, string>>) || [];

  const exists = prev.find((item) => item.name === lang);

  console.log("lang exists", exists);
  if (exists) {
    return;
  }

  prev.push({
    name: lang,
    extension: extension,
    command: command,
  });

  await store.set("language", prev);
  await store.save();
}

export async function getLanguageCommands() {
  return (await store.get("language")) as Array<Record<string, string>>;
}
