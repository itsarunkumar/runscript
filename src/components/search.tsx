// Search.tsx

import React, { useEffect, useState, useCallback } from "react";
import { FileEntry, readDir } from "@tauri-apps/api/fs";
import Fuse from "fuse.js";
import { getFolders, Folder } from "../lib/db";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { SingleScript } from "./single-script";

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, setSearchTerm }) => {
  const [data, setData] = useState<FileEntry[][] | null>(null);
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
  }, []);

  useEffect(() => {
    loadData();
  }, []);

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
    const results = search(searchTerm);
    setSearchResults(results.map((result) => result.item));
  }, [data, searchTerm]);

  return (
    <div className="w-full  bg-background/95 text-foreground sticky top-0 rounded-t-lg overflow-hidden">
      <div className="flex items-center gap-2 border-b-2 px-3 ">
        <MagnifyingGlassIcon className="w-6 h-6 text-gray-500" />
        <input
          placeholder="Search"
          className="w-full px-3 py-2 outline-none  border-none bg-background/95 text-foreground dark:placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {searchResults.length > 0 && (
        <div className="w-full">
          {searchResults.map((item) => (
            <SingleScript key={item.path} file={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
