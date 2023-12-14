import { useEffect } from "react";

import { useScriptList } from "@/lib/store/scripts";
import { SingleScript } from "@/components/single-script";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NewScripts() {
    const { scripts, fetchScripts, searchTerm } = useScriptList();

    useEffect(() => {
        fetchScripts();
    }, [searchTerm]);

    return (
        <div className="w-[500px] h-full flex flex-col items-center gap-y-5 mx-auto">
            <ScrollArea className="w-full h-[350px]">
                {scripts.map((file) => (
                    <SingleScript key={file?.path} file={file!} />
                ))}
            </ScrollArea>
        </div>
    );
}
