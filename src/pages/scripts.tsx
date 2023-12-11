"use client";

import { useEffect, useState } from "react";
import { FileEntry } from "@tauri-apps/api/fs";

import { SingleScript } from "@/components/single-script";
import { ScrollArea } from "@/components/ui/scroll-area";
import Preview from "@/components/preview";
import { Separator } from "@/components/ui/separator";

import { useScriptList } from "@/lib/store/scripts";

// import { execa } from "execa";

export default function ScriptPage() {
    const { scripts, fetchScripts, searchTerm } = useScriptList();

    const [selectedScript, setSelectedScript] = useState<FileEntry | null>(
        null
    );

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

    if (scripts.length === 0) {
        return (
            <div className="w-full h-full px-6 text-center flex flex-col justify-center items-center text-gray-400">
                <h1 className="text-lg">
                    Add a folder , where you keep all your scripts
                </h1>
                <p className="py-4">
                    To add folder , go to the config , click the scripts option
                    , and you will see an option to add folders to your app ,
                    From then you can acces all you scripts in one place.
                </p>
                <span>You can add multiple folders</span>
            </div>
        );
    }

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
                {out && out}
                {selectedScript && <Preview file={selectedScript!} />}
                {!selectedScript && (
                    <p className="text-gray-500">Select a script</p>
                )}
            </div>
        </div>
    );
}
