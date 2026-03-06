import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, UserX, Ban, BellOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FriendData {
  name: string;
  username: string;
  initials: string;
  bio: string;
  status: "online" | "offline" | "watching";
  watching?: string;
  memberSince: string;
  favoriteGenres: string[];
}

const friendsData: Record<string, FriendData> = {
  "@lnzila_h": { name: "Luzizila Helena..", username: "@lnzila_h", initials: "LH", bio: "Apaixonada por tecnologia.", status: "online", memberSince: "Jan 2026", favoriteGenres: ["Sci-Fi", "Action", "Thriller"] },
  "@edalexan_a": { name: "Edmilson Alexandre", username: "@edalexan_a", initials: "EA", bio: "Amo animações e filmes clássicos.", status: "watching", watching: "O Rei Leão", memberSince: "Mar 2026", favoriteGenres: ["Animation", "Drama", "Romance"] },
  "@jondre_a": { name: "Jose Andre", username: "@jondre_a", initials: "JA", bio: "Com grandes poderes vêm grandes responsabilidades.", status: "online", memberSince: "Feb 2026", favoriteGenres: ["Action", "Superhero", "Comedy"] },
  "@gbravo_f": { name: "Gilson Bravo.", username: "@gbravo_f", initials: "GB", bio: "Fan de animações e aventuras.", status: "offline", memberSince: "Feb 2026", favoriteGenres: ["Animation", "Adventure", "Fantasy"] },
  "@aquissan_q": { name: "Angelo Quissanga", username: "@aquissan_q", initials: "AQ", bio: "Marvel é vida!", status: "watching", watching: "Marvel Marathon", memberSince: "Mar 2026", favoriteGenres: ["Superhero", "Action", "Sci-Fi"] },
  "@asobrinh": { name: "Ana Sobrinho.", username: "@asobrinh", initials: "AS", bio: "Dramas e documentários são minha paixão.", status: "online", memberSince: "Feb 2026", favoriteGenres: ["Drama", "Documentary", "Crime"] },
  "@dmario_r": { name: "Darilton Mario", username: "@dmario_r", initials: "DM", bio: "Romântica incurável.", status: "offline", memberSince: "Jan 2026", favoriteGenres: ["Romance", "Comedy", "Drama"] },
  "@dquissan_d": { name: "Domingas Quissanga", username: "@dquissan_d", initials: "DQ", bio: "Horror e suspense me fascinam.", status: "online", memberSince: "Jan 2026", favoriteGenres: ["Horror", "Thriller", "Mystery"] },
};

const statusColors: Record<string, string> = {
  online: "bg-online",
  watching: "bg-primary animate-pulse-glow",
  offline: "bg-muted-foreground/40",
};

const FriendProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const friend = friendsData[`@${username?.replace("@", "")}`] || friendsData[username || ""];

  if (!friend) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Utilizador não encontrado.</p>
        <button onClick={() => navigate("/friends")} className="mt-4 text-primary hover:underline text-sm">
          Voltar aos amigos
        </button>
      </div>
    );
  }

  return (
   <div className="max-w-2xl space-y-6 ml-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
        <ArrowLeft size={16} /> Voltar
      </button>

      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
              {friend.initials}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${statusColors[friend.status]}`} />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">{friend.name}</h1>
            <p className="text-sm text-muted-foreground">{friend.username}</p>
            {friend.status === "watching" && (
              <p className="text-xs text-primary mt-1">🎬 A assistir {friend.watching}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Bio</h3>
          <p className="text-sm text-foreground">{friend.bio}</p>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Membro desde</h3>
            <p className="text-sm text-foreground">{friend.memberSince}</p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Status</h3>
            <p className="text-sm text-foreground capitalize">{friend.status}</p>
          </div>
        </div>

        {/* Genres */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Géneros favoritos</h3>
          <div className="flex flex-wrap gap-2">
            {friend.favoriteGenres.map((g) => (
              <span key={g} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <button
            onClick={() => navigate(`/messages?chat=${friend.username}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <MessageCircle size={16} /> Enviar mensagem
          </button>
          <button
            onClick={() => { toast({ title: "Notificações silenciadas", description: `Silenciaste ${friend.name}.` }); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface text-muted-foreground text-sm hover:text-foreground transition-colors border border-border"
          >
            <BellOff size={16} /> Silenciar
          </button>
          <button
            onClick={() => { toast({ title: "Utilizador bloqueado", description: `${friend.name} foi bloqueado.`, variant: "destructive" }); navigate("/friends"); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-destructive text-sm hover:bg-destructive/10 transition-colors"
          >
            <Ban size={16} /> Bloquear
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;
