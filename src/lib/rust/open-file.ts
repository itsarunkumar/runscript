import { invoke } from "@tauri-apps/api/tauri";

const openFile = async (path: string) => {
    await invoke("open_script", {
        args: path,
    });
};

export default openFile;
