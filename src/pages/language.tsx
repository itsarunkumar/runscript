import { FormEvent, useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { useLanguageStore } from "@/lib/store/lang-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LanguagePage() {
    const { fetchLanguages, languages, removeLanguage } = useLanguageStore();

    useEffect(() => {
        async function fetchData() {
            await fetchLanguages();
        }

        fetchData();
    }, []);

    console.log("languages", languages);

    return (
        <div className="w-full px-4">
            <div className="flex justify-between items-center px-3">
                <h1 className="text-2xl font-bold">Languages</h1>
                <AddLang />
            </div>
            <ScrollArea className="w-full h-[350px]">
                <Table className="">
                    <TableCaption>
                        A list of your script languages.
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Extension</TableHead>
                            <TableHead>Command</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {languages.map((language, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium capitalize">
                                    {language.name}
                                </TableCell>
                                <TableCell>{language.extension}</TableCell>
                                <TableCell>{language.command}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => removeLanguage(language)}
                                        size="sm"
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}

function AddLang() {
    const addLangtoStore = useLanguageStore((state) => state.addLanguage);

    const [formData, setFormData] = useState({
        name: "",
        extension: "",
        command: "",
    });

    async function addToStore(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(formData);
        await addLangtoStore(formData);
        setFormData({
            name: "",
            extension: "",
            command: "",
        });
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button size="sm">Add</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add a language to your script list
                    </DialogTitle>
                    <DialogDescription>
                        <form
                            onSubmit={addToStore}
                            className="flex flex-col gap-5"
                        >
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="Language name"
                            />
                            <Input
                                value={formData.extension}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        extension: e.target.value,
                                    }))
                                }
                                placeholder="Extension"
                            />
                            <Input
                                value={formData.command}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        command: e.target.value,
                                    }))
                                }
                                placeholder="Command to execute"
                            />
                            <Button size="sm">Add</Button>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
