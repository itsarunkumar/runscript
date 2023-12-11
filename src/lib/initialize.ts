import {
  createDir,
  BaseDirectory,
  exists,
  writeTextFile,
} from "@tauri-apps/api/fs";

export async function initializeApp() {
  console.log("initialize app");

  await initializeAppdir();

  await initializeConfig();

  await initializeDb();
}

async function initializeAppdir() {
  const isExists = await exists("runscript", { dir: BaseDirectory.Home });
  if (isExists) {
    console.log("runscript folder alredy present");
    return;
  }
  await createDir("runscript", { dir: BaseDirectory.Home });
  console.log("runscript folder created");
}

async function initializeDb() {
  const isDbExists = await exists("runscript/db.json", {
    dir: BaseDirectory.Home,
  });
  if (isDbExists) {
    console.log("runscript json db alredy present");

    return;
  }
  await writeTextFile(
    "runscript/db.json",
    JSON.stringify({ name: "Runscript", folders: [] }),
    {
      dir: BaseDirectory.Home,
    }
  );

  console.log("runscript json db created");
}
async function initializeConfig() {
  const isConfigExists = await exists("runscript/config.json", {
    dir: BaseDirectory.Home,
  });
  if (isConfigExists) {
    console.log("runscript config alredy present");

    return;
  }
  await writeTextFile(
    "runscript/config.json",
    JSON.stringify({
      name: "Runscript",
      language: [
        { name: "Javascript", command: "node", extension: "js" },
        { name: "Python", command: "python", extension: "py" },
      ],
    }),
    {
      dir: BaseDirectory.Home,
    }
  );

  console.log("runscript config created");
}
