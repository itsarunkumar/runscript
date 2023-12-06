import { registerAll } from "@tauri-apps/api/globalShortcut";
import { appWindow } from "@tauri-apps/api/window";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ScriptPage from "./pages/scripts";
import ConfigPage from "./pages/config";

const App = () => {
  registerAll(["Alt+;", "escape"], (shortcut) => {
    console.log("shortcut", shortcut);
    if (shortcut === "Alt+;") {
      appWindow.show();
    } else if (shortcut === "escape") {
      appWindow.hide();
    }
  });

  return (
    <Tabs
      defaultValue="scripts"
      className="w-full h-96 rounded-md bg-background px-1"
    >
      <TabsList className="w-full  inline-flex self-start">
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
  );
};

export default App;
