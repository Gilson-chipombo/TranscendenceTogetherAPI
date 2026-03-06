import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BarChart2, Tv, Users, MessageCircle, Settings, LogOut, Search, Bell } from "lucide-react";
import  Header  from "./Header.tsx";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: BarChart2, label: "Overview", path: "/overview" },
  { icon: Tv, label: "My Channels", path: "/channels" },
  { icon: Users, label: "Friends", path: "/friends" },
  { icon: MessageCircle, label: "Messages", path: "/messages", badge: 3 },
];

const bottomItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: LogOut, label: "Sign out", path: "/signout" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex flex-col bg-card border-r border-border shrink-0">
        <div className="p-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">CF</span>
          </div>
          <span className="font-display font-bold text-foreground tracking-tight">CINEFLIX</span>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        < Header name={navItems.find((i) => i.path === pathname)?.label || "Page"} />
        {/* <header className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0 bg-card">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {navItems.find((i) => i.path === pathname)?.label || "Page"}
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-1.5">
              <Search size={14} className="text-muted-foreground" />
              <input
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-40"
              />
            </div>
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
            </button>
            <Link to="/profile" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                U
              </div>
              <span className="text-sm text-foreground">ft_user</span>
            </Link>
          </div>
        </header> */}

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
