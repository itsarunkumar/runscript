import { FileEntry } from "@tauri-apps/api/fs";
import { metadata, Metadata } from "tauri-plugin-fs-extra-api";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { invoke, InvokeArgs } from "@tauri-apps/api/tauri";

import { getLanguageCommands } from "@/lib/config-store";
import { Button } from "./ui/button";

export default function Preview({ file }: { file: FileEntry }) {
  const [scriptMeta, setMeta] = useState<Metadata | undefined>();
  const [command, setCommand] = useState<string | undefined>();
  const [langName, setLangName] = useState<string | undefined>();

  useEffect(() => {
    async function updatePreview() {
      const meta = await metadata(file.path);
      const langs = await getLanguageCommands();
      const extension = file.name!.split(".").pop();

      const matchingLang = langs.find((lang) => lang.extension === extension);
      if (matchingLang) {
        setCommand(matchingLang.command);
        setLangName(matchingLang.name);
      } else {
        setCommand(undefined);
        setLangName(undefined);
      }
      setMeta(meta);
    }

    updatePreview();
  }, [file]);

  async function executeScript() {
    const res = await invoke("execute_script", {
      command: "code",
      args: file.path,
    });
    console.log("res execed", res);
  }

  // Check if data is available before rendering
  if (!scriptMeta || !command || !langName) {
    return (
      <p className="text-gray-500 first-letter:uppercase   flex flex-col gap-2">
        <span>{file.name}</span>
        script is not selected or selected script language is not in the config
        file.
      </p>
    );
  }

  return (
    <div className="w-full px-3 flex flex-col items-start justify-start space-y-3 ">
      <p>
        Description of <span className="font-semibold">{file.name}</span>
      </p>
      <span className="text-xs text-gray-400">
        last accessed at :{" "}
        {format(new Date(scriptMeta.accessedAt ?? new Date()), "dd-MM-yyyy")}
      </span>
      <span className="text-gray-200 capitalize">
        script language : {langName}
      </span>
      <span className="text-gray-200 font-semibold capitalize flex flex-col gap-3">
        command to run the script :
        <span className="font-semibold normal-case">
          {command && (
            <code className="bg-gray-400 text-gray-800 px-2 py-1 rounded-md">
              {command} "file path"
            </code>
          )}
        </span>
      </span>
      <Button size="sm" onClick={executeScript}>
        Open script
      </Button>
    </div>
  );
}
