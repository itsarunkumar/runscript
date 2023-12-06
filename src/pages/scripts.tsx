"use client";

import { useCallback, useEffect, useState } from "react";
import { readDir, FileEntry } from "@tauri-apps/api/fs";
import { MagicWandIcon, PlayIcon } from "@radix-ui/react-icons";
import Fuse from "fuse.js";

import { invoke } from "@tauri-apps/api/tauri";

import { getFolders, Folder } from "@/lib/db";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ScriptPage() {
  const [data, setData] = useState<FileEntry[][] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FileEntry[]>([]);

  const loadData = useCallback(async () => {
    try {
      const folders = (await getFolders()) as Folder[];

      const entries = await Promise.all(
        folders.map(async (folder) => await readDir(folder.path))
      );

      setData(entries);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, [searchResults, searchTerm]);

  useEffect(() => {
    loadData();
  }, []);

  // data && console.log("data", JSON.stringify(data, null, 2));

  const search = (searchPattern: string) => {
    if (!data) {
      console.warn("Data is null. Skipping search.");
      return [];
    }

    const flattenedData = data.flat();
    const fuse = new Fuse(flattenedData, {
      shouldSort: true,
      includeScore: true,
      threshold: 0.6,
      keys: ["name", "path"],
    });

    const results = fuse.search(searchPattern);
    return results;
  };

  useEffect(() => {
    const results = search(searchTerm); // Replace with your actual search term
    console.log(results, "results");
    setSearchResults(results.map((result) => result.item));
  }, [data, searchTerm]);

  async function executeScript(args: Array<string>) {
    console.log("command", args[0].split(".")[1]);

    let command;

    if (args[0].split(".")[1] === "py") {
      command = "py";
    }
    if (args[0].split(".")[1] === "js") {
      command = "node";
    }

    const res = await invoke("run_script", { command: command, args: args });
    console.log("res execed", res);
  }

  return (
    <>
      <div className="w-full flex items-center justify-center space-x-5">
        <MagicWandIcon className="w-6 h-6" />
        <Input
          type="text"
          name="search"
          id="search"
          placeholder="Search your scripts"
          className="w-96 active:outline-none "
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchResults.length ? (
        <div className="w-full flex flex-col items-center justify-center my-5">
          {searchResults.map((file) => (
            <SingleScript
              key={file.path}
              file={file}
              executeScript={executeScript}
            />
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center my-5">
          {data?.flatMap((folderEntries) =>
            folderEntries.map((file) => (
              <SingleScript
                key={file.path}
                file={file}
                executeScript={executeScript}
              />
            ))
          )}
        </div>
      )}
    </>
  );
}

function SingleScript({
  file,
  executeScript,
}: {
  file: FileEntry;
  executeScript: (args: Array<string>) => void;
}) {
  return (
    <>
      <div
        key={file.path}
        className="w-80 px-4 py-1.5 flex items-center justify-between "
      >
        <h1>{file.name?.split(".")[0]}</h1>

        <Button
          onClick={() => executeScript([file.path])}
          variant="ghost"
          size="icon"
        >
          <PlayIcon />
        </Button>
      </div>
    </>
  );
}
