import { invoke } from "@tauri-apps/api/tauri";

interface OpenFile {
  path: string;
}

const openFile = async (path: OpenFile) => {
  await invoke("open_script", {
    args: path,
  });
};

export default openFile;
