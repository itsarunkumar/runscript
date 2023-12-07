import { FileEntry } from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api/tauri";
import { PlayIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

export function SingleScript({ file }: { file: FileEntry }) {
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
      <div
        key={file.path}
        className="w-full px-4 py-1.5 flex items-center justify-between "
      >
        <h1 className="capitalize ">{file.name}</h1>

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
