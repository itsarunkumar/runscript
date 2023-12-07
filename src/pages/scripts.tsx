"use client";

import { useCallback, useEffect, useState } from "react";
import { readDir, FileEntry } from "@tauri-apps/api/fs";

import { getFolders, Folder } from "@/lib/db";
import { SingleScript } from "@/components/single-script";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ScriptPage() {
  const [data, setData] = useState<(FileEntry | null)[][]>();

  const loadData = useCallback(async () => {
    try {
      const folders = (await getFolders()) as Folder[];

      const entries = await Promise.all(
        folders.map(async (folder) => {
          const filesOnly = await readDir(folder.path);

          // Use Promise.all to perform the asynchronous operation for each file
          const filteredFiles = await Promise.all(
            filesOnly.map(async (file) => {
              // Perform asynchronous operation for each file
              const hasChildren = file.children ? true : false;
              return hasChildren ? null : file;
            })
          );

          // Filter out null values (entries with children)
          return filteredFiles.filter((file) => file !== null);
        })
      );

      // filesOnly now contains an array of file extensions for each entry

      setData(entries);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  data && console.log(data.flat());

  return (
    <div className="w-full flex items-center justify-center flex-grow-1">
      <div className="w-1/2 flex flex-col items-center justify-center ">
        <ScrollArea className="w-full h-[300px]">
          {data?.flatMap((folderEntries) =>
            folderEntries.map((file) => (
              <SingleScript key={file?.path} file={file!} />
            ))
          )}
        </ScrollArea>
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <ScrollArea>
          <h1>preview</h1>
        </ScrollArea>
      </div>
    </div>
  );
}
