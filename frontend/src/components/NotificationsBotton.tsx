import { useState } from "react";
import { Bell, MessageCircle, Users, Film, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Notification {
  id: string;
  type: "message" | "friend" | "room";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: "1", type: "message", title: "Nova mensagem", description: "Luzizila Helena enviou uma mensagem", time: "2 min", read: false },
  { id: "2", type: "room", title: "Sala Épica está ao vivo", description: "O Rei Leão começou agora!", time: "10 min", read: false },
  { id: "3", type: "friend", title: "Pedido de amizade", description: "Jose Andre quer ser seu amigo", time: "1h", read: false },
  { id: "4", type: "message", title: "Nova mensagem", description: "Edmilson Alexandre reagiu à sua mensagem", time: "3h", read: true },
];

const typeIcons = {
  message: MessageCircle,
  friend: Users,
  room: Film,
};

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-card border-border" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h4 className="text-sm font-medium text-foreground">Notificações</h4>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
              <Check size={12} /> Marcar todas como lidas
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sem notificações</p>
          ) : (
            notifications.map((n) => {
              const Icon = typeIcons[n.type];
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-surface transition-colors cursor-pointer ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{n.description}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
