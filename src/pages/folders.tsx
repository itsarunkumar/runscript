import React, { useCallback, useEffect } from "react";
import { open } from "@tauri-apps/api/dialog";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFolderStore } from "@/lib/store/folder";

import { Folder } from "@/types";

export default function FoldersPage() {
    const {
        folders,
        fetchFolders,
        addFolder: addF,
        deleteFolder,
    } = useFolderStore();

    useEffect(() => {
        async function initApp() {
            await fetchFolders();
        }

        initApp();
    }, []);

    const addFolder = useCallback(async () => {
        try {
            const path = (await open({ directory: true })) as string;

            await addF(path);
        } catch (error) {
            console.error("Error adding folder:", error);
        }
    }, []);

    const deleteFolderDb = useCallback(async (id: string | number) => {
        try {
            await deleteFolder(id as string);
        } catch (error) {
            console.error("Error deleting folder:", error);
        }
    }, []);

    return (
        <div>
            <div className="flex justify-between  px-5 my-3">
                <h1 className="capitalize">script folders</h1>
                <Button
                    onClick={addFolder}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    Add folder
                </Button>
            </div>
            <ScrollArea className="w-full h-80 px-5 mx-auto ">
                {folders
                    ? folders.map((folder) => (
                          <FolderItem
                              key={folder.id}
                              folder={folder}
                              onDelete={() => deleteFolderDb(folder.id!)}
                          />
                      ))
                    : "loading"}
            </ScrollArea>
        </div>
    );
}

interface FolderItemProps {
    folder: Folder;
    onDelete: () => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, onDelete }) => (
    <div className="flex justify-between items-center gap-2  py-2 px-5 rounded-md hover:bg-gray-200">
        <div>
            <h1 className="capitalize text-base ">{folder.name}</h1>
            <p className="text-xs text-gray-500">{folder.path}</p>
        </div>
        <Button size="sm" onClick={onDelete}>
            Remove
        </Button>
    </div>
);
