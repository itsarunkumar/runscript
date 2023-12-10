import { invoke } from "@tauri-apps/api/tauri";

interface ExecuteScript {
  command: string;
  args: string[];
}

const executeScript = async ({ command, args }: ExecuteScript) => {
  try {
    const result = await invoke("run_script", {
      command,
      args,
    });

    console.log(result);

    return result;
  } catch (error) {
    console.error("Error executing script:", error);
    return error;
  }
};

export default executeScript;
