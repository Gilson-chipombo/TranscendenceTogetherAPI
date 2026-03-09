import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BarChart2, Tv, Users, MessageCircle, Settings, LogOut, Search, Bell } from "lucide-react";
import  Header  from "./Header.tsx";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: BarChart2, label: "Overview", path: "/overview" },
  { icon: Tv, label: "My Rooms", path: "/myrooms" },
  { icon: Users, label: "Friends", path: "/friends" },
  { icon: MessageCircle, label: "Messages", path: "/messages", badge: 3 },
];

const bottomItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: LogOut, label: "Sign out", path: "/signout" },
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen overflow-hidden sticky top-0">
      {/* Sidebar */}
      <aside className="w-18 sm:w-56 flex flex-col justify-center bg-card border-r border-border shrink-0">
        <div className="p-5 flex items-center gap-0 sm:gap-2 justify-center sm:justify-start">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="w-6 h-6 object-contain"
          />
          </div>
          <span className="font-display font-bold text-foreground tracking-tight">TOGETHER</span>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-0 sm:gap-3 align-middle justify-center sm:justify-start px-0 sm:px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface"
                }`}
              >
                <item.icon size={18} />
                <span className="hidden sm:inline-block">{item.label}</span>
                {item.badge && (
                  <span className="hidden ml-auto bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
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
              className="flex items-center gap-0 justify-center sm:justify-start sm:gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
            >
              <item.icon size={18} />
              <span className="hidden sm:inline-block">{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      </div>
  );
}