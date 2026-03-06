import { Bell, Search } from "lucide-react";
import "./Header.css"

type ScreenName = {
  name?: string;
};

const Header = function ({ name = "Undefined" }: ScreenName) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          {name}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative rounded-md w-full sm:w-32 lg:w-56 sm:bg-secondary hover:bg-secondary transition-colors cursor-pointer gap-2 sm:ps-4 flex items-center justify-center">
          <Search className="w-4 h-4 my-2 sm:m-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="hidden sm:block pl-2 pr-4 bg-transparent w-full outline-none border-none 
            py-2 text-sm text-foreground placeholder:text-muted-foreground  
            "
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
            U
          </div>
          <span className="text-sm font-medium text-foreground">ft_user 42</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
