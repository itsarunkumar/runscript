// Search.tsx

import React, { useEffect } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { useScriptList } from "@/lib/store/scripts";
import { cn } from "@/lib/utils";

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, setSearchTerm }) => {
  const { searchResults, search } = useScriptList();

  useEffect(() => {
    search(searchTerm);
  }, [searchTerm]);

  return (
    <div
      className={cn(
        "w-full",
        searchTerm.length > 0 ? "h-full" : "",
        "bg-slate-700"
      )}
    >
      <div className="w-full h-fit flex items-center gap-x-3 px-5">
        <MagnifyingGlassIcon className="w-6 h-6 text-gray-500" />
        <input
          placeholder="Search for your scripts here..."
          value={searchTerm}
          autoFocus
          className="w-full bg-slate-700 text-gray-500 outline-none border-none px-2 py-3"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {searchResults.length > 0 && (
        <div className="w-full">
          {searchResults.map((file) => (
            <div key={file?.path}>
              <h1>{file?.name}</h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
