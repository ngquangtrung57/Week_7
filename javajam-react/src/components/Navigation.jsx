import {NavLink} from "react-router-dom";

const links = [
    {name: "Home", path: "/"},
    {name: "Menu", path: "/menu"},
    {name: "Music", path: "/music"},
    {name: "Jobs", path: "/jobs"}
];

function Navigation(){
    return (
        <nav className="flex gap-1 overflow-x-auto bg-roast-300 px-3 py-2 md:flex-col md:px-3 md:py-5">
            {links.map(link => (
                <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.path === "/"}
                    className={({isActive}) =>
                        `rounded-md px-3 py-2 font-bold no-underline transition-colors ${
                            isActive
                                ? "bg-roast-100 text-roast-900 shadow-sm"
                                : "text-roast-600 hover:bg-roast-200 hover:text-roast-900"
                        }`
                    }
                >
                    {link.name}
                </NavLink>
            ))}
        </nav>
    );
}

export default Navigation;
