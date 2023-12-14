// Search.tsx

import React, { useEffect } from "react";
import { CrossCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { useScriptList } from "@/lib/store/scripts";
import { cn } from "@/lib/utils";
import { SingleScript } from "./single-script";
import { ScrollArea } from "./ui/scroll-area";

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
                "bg-background"
            )}
        >
            <div className="w-full h-fit flex items-center gap-2 px-5 border-b border-gray-700 border-opacity-30">
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
                <input
                    placeholder="Search for your scripts here..."
                    value={searchTerm}
                    autoFocus
                    className="w-full bg-background text-gray-900 outline-none border-none  py-3"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm.length > 0 && (
                    <CrossCircledIcon
                        className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-900"
                        onClick={() => setSearchTerm("")}
                    />
                )}
            </div>

            {searchResults.length > 0 && (
                <div className="w-[500px] mx-auto h-full bg-background flex flex-col items-center justify-start py-2 px-5">
                    <ScrollArea className="w-full h-[350px]">
                        {searchResults.map((file) => (
                            <SingleScript key={file?.path} file={file!} />
                        ))}
                    </ScrollArea>
                </div>
            )}
        </div>
    );
};

export default Search;
