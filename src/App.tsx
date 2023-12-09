// App.tsx

import React, { useEffect } from "react";
import { registerAll } from "@tauri-apps/api/globalShortcut";
import { appWindow } from "@tauri-apps/api/window";
import { enable, isEnabled } from "tauri-plugin-autostart-api";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Search from "@/components/search";

import ScriptPage from "@/pages/scripts";
import ConfigPage from "@/pages/config";

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");

  registerAll(["Alt+;", "escape"], (shortcut) => {
    console.log("shortcut", shortcut);
    if (shortcut === "Alt+;") {
      appWindow.show();
    } else if (shortcut === "escape") {
      appWindow.hide();
    }
  });

  enable();

  useEffect(() => {
    async function initAuto() {
      console.log("auto", await isEnabled());
    }
    initAuto();
  }, []);

  return (
    <div className="w-full h-full bg-background ">
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {searchTerm.length === 0 ? (
        <Tabs defaultValue="scripts">
          <TabsList>
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="scripts">
            <ScriptPage />
          </TabsContent>

          <TabsContent value="config">
            <ConfigPage />
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  );
};

export default App;
