import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FileEntry } from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api/tauri";

import { PlayIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { getLanguageCommands } from "@/lib/config-store";

export function SingleScript({
  file,
  setActive,
}: {
  file: FileEntry;
  setActive: Dispatch<SetStateAction<FileEntry | null>>;
}) {
  const [command, setCommand] = useState<string>();
  const [langName, setlangName] = useState<string>();

  async function executeScript() {
    const res = await invoke("run_script", { command, args: [file.path] });
    console.log("res execed", res);
  }

  useEffect(() => {
    async function initApp() {
      const langs = await getLanguageCommands();
      console.log(langs);
      const extension = file.name!.split(".").pop();

      langs.find((lang) => {
        lang.extension === extension && setCommand(lang.command);
      });

      langs.find((lang) => {
        lang.extension === extension && setlangName(lang.name);
      });
    }

    initApp();
  }, []);

  return (
    <>
      <Button
        variant="transparent"
        onClick={() => setActive(file)}
        type="button"
        className="w-full h-fit hover:bg-gray-700"
      >
        <div className="w-full flex flex-col items-start justify-center gap-1">
          <h1 className="text-base">{file.name}</h1>
          <span className="text-sm text-gray-500">{langName}</span>
        </div>

        {command && (
          <Button onClick={executeScript} variant="ghost" size="sm">
            <PlayIcon className="text-gray-500" />
          </Button>
        )}
      </Button>
    </>
  );
}
