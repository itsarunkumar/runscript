"use client";

import { useEffect, useState } from "react";
import { FileEntry } from "@tauri-apps/api/fs";

import { SingleScript } from "@/components/single-script";
import { ScrollArea } from "@/components/ui/scroll-area";
import Preview from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { useScriptList } from "@/lib/store/scripts";
import { executeScript } from "@/lib/rust";

// import { execa } from "execa";

export default function ScriptPage() {
  const { scripts, fetchScripts, searchTerm } = useScriptList();

  const [selectedScript, setSelectedScript] = useState<FileEntry | null>(null);

  const [out, setOut] = useState<string>("");

  useEffect(() => {
    fetchScripts();
    setOut("");
  }, [searchTerm, selectedScript]);

  // async function sidecar(path: string) {
  //   const com = Command.sidecar("binary/nodejs/node", [path]);
  //   const ex = await com.execute();
  //   console.log(ex);
  //   // setOut(ex.stdout);
  // }

  // async function other(path: string) {
  //   const ot = new Command("script", [path]);
  //   const sp = await ot.spawn();
  //   console.log(sp.);
  // }

  return (
    <div className="w-full h-full flex my-3 ">
      <div className="w-1/2 h-full flex flex-col gap-2 px-5  ">
        <ScrollArea className="h-72">
          {scripts &&
            scripts?.flatMap((folderEntries) =>
              folderEntries.map((file) => (
                <SingleScript
                  key={file?.path}
                  file={file!}
                  setActive={setSelectedScript}
                />
              ))
            )}
        </ScrollArea>
      </div>
      <Separator orientation="vertical" className="h-full w-1" />
      <div className="w-1/2 h-full flex flex-col items-start ">
        <Button
          onClick={() =>
            executeScript({ command: "node", args: [selectedScript?.path!] })
          }
          variant="outline"
        >
          other
        </Button>

        {out && out}
        {selectedScript && <Preview file={selectedScript!} />}
        {!selectedScript && <p className="text-gray-500">Select a script</p>}
      </div>
    </div>
  );
}
