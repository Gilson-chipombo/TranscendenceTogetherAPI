import { Home, LayoutGrid, Tv, Users, MessageCircle, Settings, LogOut } from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: LayoutGrid, label: "Overview" },
  { icon: Tv, label: "My Homes", expandable: true },
  { icon: Users, label: "Friends" },
  { icon: MessageCircle, label: "Messages", badge: 3 },
];

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Home");

  return (
    <aside className="flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
        <span className="text-xl font-bold tracking-tight text-foreground font-['Space_Grotesk']">
          <span className="text-primary">TOGETHER</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveItem(item.label)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeItem === item.label
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {item.badge}
              </span>
            )}
            {item.expandable && (
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors">
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
