import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./styles.css";
import { ThemeProvider } from "./components/theme-provider";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NewScripts from "./pages/new-scripts";
import ConfigPage from "./pages/config";
import Folders from "./pages/folders";
import LanguagePage from "./pages/language";
import EditScriptsPage from "./pages/edit-scripts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <NewScripts />,
            },
            {
                path: "/config",
                element: <ConfigPage />,
            },
            {
                path: "/folders",
                element: <Folders />,
            },
            {
                path: "/languages",
                element: <LanguagePage />,
            },
            {
                path: "/edit-scripts",
                element: <EditScriptsPage />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>
);
