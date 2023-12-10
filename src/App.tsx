// App.tsx

import React, { useEffect } from "react";
import { ArchiveIcon, GearIcon } from "@radix-ui/react-icons";
import { register } from "@tauri-apps/api/globalShortcut";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";
import { homeDir, join } from "@tauri-apps/api/path";
import { enable, isEnabled } from "tauri-plugin-autostart-api";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Search from "@/components/search";

import ScriptPage from "@/pages/scripts";
import ConfigPage from "@/pages/config";
import { initializeApp } from "@/lib/initialize";

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");

  enable();

  useEffect(() => {
    async function initAuto() {
      await initializeApp();

      await register("Alt+;", () => {
        appWindow.isVisible().then((visible) => {
          console.log(visible);
          if (visible) {
            appWindow.hide();
          } else {
            appWindow.show();
          }
        });
      });
      console.log("auto", await isEnabled());
    }

    function closeonEsc(e: KeyboardEvent) {
      if (e.code === "Escape") {
        appWindow.hide();
      }
    }

    document.addEventListener("keydown", closeonEsc);

    initAuto();

    return () => {
      document.removeEventListener("keydown", closeonEsc);
    };
  }, []);

  async function openScript() {
    const res = await invoke("open_script", {
      args: await join(await homeDir(), "runscript", "config.json"),
    });
    console.log("res execed", res);
  }

  return (
    <div className="w-full h-full relative bg-gray-950 ">
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {searchTerm.length === 0 ? (
        <Tabs defaultValue="scripts">
          <TabsList>
            <TabsTrigger value="scripts" className="flex items-center gap-1">
              <ArchiveIcon className="w-3 h-3" /> Scripts
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-1">
              <GearIcon className="w-3 h-3" /> Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scripts">
            <ScriptPage />
          </TabsContent>

          <TabsContent value="config">
            <ConfigPage />
          </TabsContent>
        </Tabs>
      ) : null}
      <div className="absolute bottom-0 w-full px-3 py-1 text-sm border-t flex justify-between items-center">
        <button>Made with ❤️</button>
        <button onClick={openScript}>open config</button>
      </div>
    </div>
  );
};

export default App;
