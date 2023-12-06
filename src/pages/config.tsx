"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { open } from "@tauri-apps/api/dialog";
import { sep } from "@tauri-apps/api/path";

import { Button } from "@/components/ui/button";

import { getFolders, insertFolder, deleteFolder, Folder } from "@/lib/db";
import { idGenerator } from "@/lib/unique-id";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ConfigPage() {
  const [data, setData] = useState<Folder[]>([]);

  useEffect(() => {
    async function initApp() {
      try {
        const folders = (await getFolders()) as Folder[];
        console.log("foldes", folders);

        setData(folders);
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    }

    initApp();
  }, []);

  const addFolder = useCallback(async () => {
    try {
      const path = (await open({ directory: true })) as string;

      const folderName = path.split(sep);
      const name = folderName[folderName.length - 1];

      await insertFolder({ name, path });

      setData((prev) => (prev ? [...prev, { name, path }] : []));
    } catch (error) {
      console.error("Error adding folder:", error);
    }
  }, []);

  const deleteFolderDb = useCallback(async (id: string | number) => {
    try {
      await deleteFolder(id);
      setData((prev) => (prev ? prev.filter((item) => item.id !== id) : []));
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center px-5">
      <div className="w-full flex  items-center justify-between">
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
      <ScrollArea className="w-full h-[300px]">
        <Suspense fallback="loading...">
          {data
            ? data.map((folder) => (
                <FolderItem
                  key={idGenerator.generateUniqueId()}
                  folder={folder}
                  onDelete={() => deleteFolderDb(folder.id!)}
                />
              ))
            : "loading"}
        </Suspense>
      </ScrollArea>
    </div>
  );
}

interface FolderItemProps {
  folder: Folder;
  onDelete: () => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, onDelete }) => (
  <div className="w-full flex justify-between items-start space-x-3 space-y-3 px-5  rounded-md ">
    <div className="flex flex-col items-start gap-1">
      <h1 className="capitalize text-lg text-slate-50">{folder.name}</h1>
      <p className="text-xs text-muted-foreground w-full overflow-hidden">
        {folder.path}
      </p>
    </div>
    <Button variant="ghost" onClick={onDelete}>
      Delete
    </Button>
  </div>
);
