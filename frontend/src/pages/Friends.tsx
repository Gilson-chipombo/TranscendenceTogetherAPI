import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, MessageCircle, MoreHorizontal, Check, X, UserX, Ban, BellOff, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type FriendStatus = "online" | "offline" | "watching";

interface Friend {
  id: string;
  name: string;
  username: string;
  status: FriendStatus;
  watching?: string;
  initials: string;
  color: string;
}

interface PendingRequest {
  id: string;
  name: string;
  username: string;
  initials: string;
}

const initialFriends: Friend[] = [
  { id: "1", name: "Luzizila Helena.", username: "@lnzila_h", status: "online", initials: "LH", color: "bg-primary/20 text-primary" },
  { id: "2", name: "Edmilson Alexandre", username: "@edalexan_a", status: "watching", watching: "O Rei Leão", initials: "EA", color: "bg-accent/20 text-accent" },
  { id: "3", name: "Jose Andre", username: "@jondre_a", status: "online", initials: "JA", color: "bg-primary/20 text-primary" },
  { id: "4", name: "Gilson Bravo", username: "@gbravo_f", status: "offline", initials: "GB", color: "bg-muted text-muted-foreground" },
  { id: "5", name: "Angelo Quissanga", username: "@aquissan_q", status: "watching", watching: "Marvel Marathon", initials: "AQ", color: "bg-accent/20 text-accent" },
  { id: "6", name: "Ana Sobrinho.", username: "@asobrinh", status: "online", initials: "AS", color: "bg-primary/20 text-primary" },
  { id: "7", name: "Darilton Mario", username: "@dmario_r", status: "offline", initials: "DM", color: "bg-muted text-muted-foreground" },
  { id: "8", name: "Domingas Quissanga", username: "@dquissan_d", status: "online", initials: "DQ", color: "bg-primary/20 text-primary" },
];

const initialPending: PendingRequest[] = [
  { id: "p1", name: "Tiago Matias", username: "@timatias_t", initials: "TM" },
  { id: "p2", name: "Constancia Tati", username: "@ctati_C", initials: "CT" },
];

const allUsers = [
  { name: "Liedson Habacuc", username: "@lied_h", initials: "LH" },
  { name: "Fernanda Diando", username: "@fer_d", initials: "FD" },
  { name: "Jormaedes Luis", username: "@jorm_l", initials: "JL" },
  { name: "Eva Monteiro", username: "@emonteir_e", initials: "EV" },
  { name: "Alexandre Nunes", username: "@alex_n", initials: "AN" },
];

const statusDot: Record<FriendStatus, string> = {
  online: "bg-online",
  watching: "bg-primary animate-pulse-glow",
  offline: "bg-muted-foreground/40",
};

const statusLabel: Record<FriendStatus, string> = {
  online: "Online",
  watching: "Watching",
  offline: "Offline",
};

const Friends = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "online" | "pending">("all");
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [pending, setPending] = useState<PendingRequest[]>(initialPending);
  const [addSearch, setAddSearch] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const filtered = friends.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    if (tab === "online") return matchSearch && (f.status === "online" || f.status === "watching");
    return matchSearch;
  });

  const onlineCount = friends.filter((f) => f.status !== "offline").length;

  const searchResults = allUsers.filter(
    (u) =>
      addSearch.length > 0 &&
      (u.name.toLowerCase().includes(addSearch.toLowerCase()) ||
        u.username.toLowerCase().includes(addSearch.toLowerCase())) &&
      !friends.some((f) => f.username === u.username) &&
      !pending.some((p) => p.username === u.username)
  );

  const handleAccept = (req: PendingRequest) => {
    const newFriend: Friend = {
      id: req.id,
      name: req.name,
      username: req.username,
      initials: req.initials,
      status: "online",
      color: "bg-primary/20 text-primary",
    };
    setFriends((prev) => [newFriend, ...prev]);
    setPending((prev) => prev.filter((p) => p.id !== req.id));
    toast({ title: "Friend added!", description: `${req.name} is now your friend.` });
  };

  const handleReject = (req: PendingRequest) => {
    setPending((prev) => prev.filter((p) => p.id !== req.id));
    toast({ title: "Request declined", description: `Declined ${req.name}'s request.` });
  };

  const handleSendRequest = (user: typeof allUsers[0]) => {
    setSentRequests((prev) => [...prev, user.username]);
    toast({ title: "Request sent!", description: `Friend request sent to ${user.name}.` });
  };

  const handleRemoveFriend = (friend: Friend) => {
    setFriends((prev) => prev.filter((f) => f.id !== friend.id));
    toast({ title: "Friend removed", description: `${friend.name} was removed from your friends.` });
  };

  const handleBlockFriend = (friend: Friend) => {
    setFriends((prev) => prev.filter((f) => f.id !== friend.id));
    toast({ title: "User blocked", description: `${friend.name} has been blocked.`, variant: "destructive" });
  };

  const handleMuteFriend = (friend: Friend) => {
    toast({ title: "Notifications muted", description: `Notifications from ${friend.name} are now muted.` });
  };

  const handleOpenChat = (friend: Friend) => {
    navigate(`/messages?chat=${friend.username}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Friends</h1>
          <p className="text-sm text-muted-foreground mt-1">{onlineCount} online now</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <UserPlus size={16} />
              Add Friend
            </button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add Friend</DialogTitle>
              <DialogDescription>O teu novo amigo</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-border">
                <Search size={14} className="text-muted-foreground" />
                <input
                  value={addSearch}
                  onChange={(e) => setAddSearch(e.target.value)}
                  placeholder="Search by name or username..."
                  className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
                  autoFocus
                />
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {addSearch.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Type to search for users</p>
                )}
                {searchResults.length === 0 && addSearch.length > 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
                )}
                {searchResults.map((user) => (
                  <div key={user.username} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {user.initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.username}</div>
                      </div>
                    </div>
                    {sentRequests.includes(user.username) ? (
                      <span className="text-xs text-muted-foreground px-3 py-1.5 rounded-lg bg-surface">Sent</span>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(user)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                      >
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center gap-3">
        <div className="flex bg-card rounded-lg border border-border p-1">
          {(["all", "online", "pending"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-sm capitalize transition-colors ${
                tab === t ? "bg-surface text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {t === "pending" && pending.length > 0 && (
                <span className="ml-1.5 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center gap-2 bg-card rounded-lg border border-border px-3 py-2">
          <Search size={14} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search friends..."
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>

      {/* Pending Requests */}
      {tab === "pending" && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Requests</h3>
          {pending.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No pending requests.</div>
          )}
          {pending.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between bg-card rounded-xl p-4 border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                  {req.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{req.name}</div>
                  <div className="text-xs text-muted-foreground">{req.username}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAccept(req)}
                  className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent hover:bg-accent/30 transition-colors"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => handleReject(req)}
                  className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center text-destructive hover:bg-destructive/30 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Friends List */}
      {tab !== "pending" && (
        <div className="space-y-2">
          {filtered.map((friend) => (
            <div
              key={friend.id}
              onClick={() => handleOpenChat(friend)}
              className="flex items-center justify-between bg-card rounded-xl p-4 border border-border hover:border-primary/20 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${friend.color}`}>
                    {friend.initials}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${statusDot[friend.status]}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{friend.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {friend.status === "watching" ? (
                      <span>🎬 Watching <span className="text-primary">{friend.watching}</span></span>
                    ) : (
                      statusLabel[friend.status]
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleOpenChat(friend)}
                  className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle size={16} />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border w-48">
                    <DropdownMenuItem onClick={() => navigate(`/profile/${friend.username}`)} className="gap-2 text-foreground">
                      <Eye size={14} /> View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenChat(friend)} className="gap-2 text-foreground">
                      <MessageCircle size={14} /> Send Message
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem onClick={() => handleMuteFriend(friend)} className="gap-2 text-foreground">
                      <BellOff size={14} /> Mute Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBlockFriend(friend)} className="gap-2 text-destructive">
                      <Ban size={14} /> Block
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRemoveFriend(friend)} className="gap-2 text-destructive">
                      <UserX size={14} /> Remove Friend
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No friends found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Friends;
