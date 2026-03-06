import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import ViewersList from "@/components/ViewersList";
import { ThumbsUp, Share2, Bookmark, Eye } from "lucide-react";
import LiveChat from "@/components/LiveChat";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header name="Home" />

        <main className="flex-1 p-6">
          <div className="flex gap-6">
            {/* Main content */}
            <div className="flex-1 space-y-5">
              <VideoPlayer />

              {/* Video info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-live text-foreground text-[10px] font-bold uppercase tracking-wider">
                        Live
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="w-3.5 h-3.5" />
                        1.2K assistindo
                      </span>
                    </div>
                    <h1 className="text-xl font-bold text-foreground leading-tight">
                      O Rei Leão — Sessão Especial de Cinema
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                      Assista junto com a comunidade! Uma experiência cinematográfica compartilhada com reações em tempo real. Participe do chat e curta esse clássico com milhares de fãs.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      2.4K
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Channel info */}
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    CL
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">CineLive</p>
                    <p className="text-xs text-muted-foreground">48K seguidores</p>
                  </div>
                  <button className="ml-4 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Seguir
                  </button>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="w-72 shrink-0 space-y-4">
              <ViewersList />

              {/* Chat preview */}
              <LiveChat />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
