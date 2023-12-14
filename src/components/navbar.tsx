import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="w- px-5 flex justify-start items-center gap-3">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive
                        ? "text-gray-900 border-b border-slate-500"
                        : "text-gray-500"
                }
            >
                Scripts
            </NavLink>
            <NavLink
                to="/config"
                className={({ isActive }) =>
                    isActive
                        ? "text-gray-900 border-b border-slate-500"
                        : "text-gray-500"
                }
            >
                Config
            </NavLink>
        </nav>
    );
}
