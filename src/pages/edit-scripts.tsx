import { FormEvent, useEffect, useState } from "react";

import { useScriptList } from "@/lib/store/scripts";
import { openFile } from "@/lib/rust";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Script } from "@/types";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function EditScriptsPage() {
    const { fetchScripts, scripts } = useScriptList();

    useEffect(() => {
        async function fetchData() {
            await fetchScripts();
        }

        fetchData();
    }, []);

    return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 px-4">
            <h1 className="text-lg font-medium">Edit Scripts</h1>
            <ScrollArea className="w-full h-[350px] pb-5">
                <div className=" w-full flex flex-col justify-center items-center gap-1">
                    {scripts.map((file, i) => (
                        <div
                            key={file?.path! + i}
                            className=" w-3/4 flex justify-between items-center cursor-pointer border border-slate-100 border-opacity-10 rounded-md px-2 py-3 hover:bg-gray-200"
                        >
                            <div>
                                <h1 className="capitalize">{file?.name}</h1>
                                <span className="text-xs text-gray-500">
                                    {file?.fileName}
                                </span>
                                <p className="text-xs text-gray-400">
                                    {file?.path}
                                </p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        openFile(file?.path as string)
                                    }
                                >
                                    open
                                </Button>
                                <Editor file={file!} />
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

function Editor({ file }: { file: Script }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");

    const editScript = useScriptList((state) => state.editScript);

    async function nameChangeHandler(e: FormEvent, script: Script) {
        e.preventDefault();
        if (newName.length > 0) {
            await editScript(script, newName);
            setNewName("");
        }
        setIsEditing(false);
    }
    return (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger>
                <Button size="sm">edit </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit name of the script</DialogTitle>
                    <DialogDescription>
                        <form
                            className="flex gap-2"
                            onSubmit={(e) =>
                                nameChangeHandler(e, file as Script)
                            }
                        >
                            <Input
                                onChange={(e) => setNewName(e.target.value)}
                                className="text-gray-900"
                            />
                            <Button>Save</Button>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
