import { useEffect, useState } from "react";
import { Metadata, metadata } from "tauri-plugin-fs-extra-api";

import { ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";
import { executeScript } from "@/lib/rust";
import { appConfig } from "@/lib/store/config-store";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Language, Script } from "@/types";

export function SingleScript({ file }: { file: Script }) {
    const [meta, setMetadata] = useState<Metadata | undefined>();
    const [commandAndLang, setCommandAndLang] = useState<
        Language | undefined
    >();

    useEffect(() => {
        async function updatePreview() {
            const filemetadata = await metadata(file.path);
            setMetadata(filemetadata);

            const extension = file.fileName.split(".").toReversed()[0];

            const getCandL = await appConfig.getLangAndCommand(extension);

            setCommandAndLang(getCandL);
        }
        updatePreview();
    }, []);

    return (
        <div className=" w-full  flex justify-between items-center gap-2  py-2 px-5 rounded-md hover:bg-gray-100">
            <HoverCard>
                <HoverCardTrigger className="cursor-pointer capitalize font-semibold">
                    {file.name}
                    {!commandAndLang && (
                        <p className="text-xs text-gray-500 font-normal first-letter:capitalize">
                            language of this script is not configured
                        </p>
                    )}
                </HoverCardTrigger>
                <HoverCardContent sideOffset={10} className="w-fit">
                    <div className="w-fit space-y-1">
                        <h1 className="text-sm uppercase">{file.name}</h1>
                        <h1 className="text-xs text-gray-600">
                            File:{file.fileName}
                        </h1>
                        <p className="text-xs text-gray-500">
                            Last run : {meta?.accessedAt.toLocaleDateString()}
                        </p>
                    </div>
                </HoverCardContent>
            </HoverCard>
            {commandAndLang ? (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                        executeScript({
                            command: commandAndLang?.command!,
                            args: [file.path],
                        })
                    }
                >
                    Run
                </Button>
            ) : (
                <ShieldAlert className="w-5 text-neutral-500" />
            )}
        </div>
    );
}
