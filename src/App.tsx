// App.tsx

import React, { useEffect, useState } from "react";
import { register } from "@tauri-apps/api/globalShortcut";
import { appWindow } from "@tauri-apps/api/window";
import { enable, isEnabled } from "tauri-plugin-autostart-api";
import { Outlet } from "react-router-dom";

import Search from "@/components/search";

import { initializeApp } from "./lib/initialize";
import { folderDb } from "./lib/db";
import Navbar from "./components/navbar";
import { X } from "lucide-react";

const App: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    enable(); //this is enable the autostart of the app when the system is rebooted

    useEffect(() => {
        async function initAuto() {
            await initializeApp();

            await folderDb.initialize();

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

        function closeonEsc(event: { code: string }) {
            if (event.code === "Escape") {
                appWindow.hide();
            }
        }

        document.addEventListener("keydown", closeonEsc);

        initAuto();

        return () => {
            document.removeEventListener("keydown", closeonEsc);
        };
    }, [searchTerm]);

    return (
        <div className="w-full h-full relative bg-background ">
            <div className="w-full px-2   flex items-center justify-between ">
                <h1 className="text-sm font-semibold">RunScript</h1>
                <button onClick={() => appWindow.hide()}>
                    <X className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-900" />
                </button>
            </div>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <Navbar />

            <Outlet />
        </div>
    );
};

export default App;
