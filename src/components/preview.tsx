import { FileEntry } from "@tauri-apps/api/fs";
import { metadata, Metadata } from "tauri-plugin-fs-extra-api";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { getLanguageCommands } from "@/lib/config-store";

export default function Preview({ file }: { file: FileEntry }) {
  const [scriptMeta, setMeta] = useState<Metadata>();
  const [command, setCommand] = useState<string>();
  const [langName, setlangName] = useState<string>();

  useEffect(() => {
    async function initPreview() {
      const meta = await metadata(file.path);
      const langs = await getLanguageCommands();
      const extension = file.name!.split(".").pop();

      langs.find((lang) => {
        lang.extension === extension && setCommand(lang.command);
      });

      langs.find((lang) => {
        lang.extension === extension && setlangName(lang.name);
      });
      setMeta(meta);
    }
    initPreview();
  }, [file]);
  return (
    <div className="w-full px-3 flex flex-col items-start justify-start space-y-3 ">
      <p>
        Description of <span className="font-semibold">{file.name}</span>
      </p>
      <span className="text-xs text-gray-400">
        last accessed at :{" "}
        {format(new Date(scriptMeta?.accessedAt ?? new Date()), "dd-MM-yyyy")}
      </span>
      <span className=" text-gray-800 capitalize">
        script language : {langName}
      </span>
      <span className=" text-gray-800 font-semibold capitalize flex flex-col">
        command to run the script :
        <span className="font-semibold normal-case">
          <code className="bg-gray-200 px-2 py-1 rounded-md">
            {command} "file path"
          </code>
        </span>
      </span>
    </div>
  );
}
