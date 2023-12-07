// App.tsx

import React from "react";
import { registerAll } from "@tauri-apps/api/globalShortcut";
import { appWindow } from "@tauri-apps/api/window";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScriptPage from "./pages/scripts";
import ConfigPage from "./pages/config";
import Search from "@/components/search";

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

  return (
    <div className="relative w-full">
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {searchTerm.length === 0 ? (
        <Tabs
          defaultValue="scripts"
          className="w-full relative  rounded-b-lg bg-background px-1"
        >
          <TabsList className="w-full  inline-flex self-start p-0 text-sm">
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
