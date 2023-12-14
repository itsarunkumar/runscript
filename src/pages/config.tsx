import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

const configs = [
    {
        name: "Folders",
        url: "/folders",
        description: "add and remove folders",
    },
    {
        name: "Languages",
        url: "/languages",
        description: "add and remove languages",
    },
    {
        name: "Scripts",
        url: "/edit-scripts",
        description: "edit property of scripts",
    },
];

export default function ConfigPage() {
    return (
        <div className="w-full h-full flex flex-col justify-start items-start px-4">
            <ScrollArea className="w-full h-[350px] flex   ">
                <div className=" flex flex-row flex-wrap  gap-5 my-2">
                    {configs.map((item, i) => (
                        <Link
                            key={i}
                            to={item.url}
                            className=" w-72 h-28 px-4 bg-gray-100 border rounded-md flex flex-col justify-center items-start gap-2"
                        >
                            <h1 className="capitalize text-lg font-bold">
                                {item.name}
                            </h1>
                            <p className="text-sm text-gray-800">
                                {item.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
