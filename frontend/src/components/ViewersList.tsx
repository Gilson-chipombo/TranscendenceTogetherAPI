import { Eye } from "lucide-react";

const viewers = [
  { name: "Carlos M.", avatar: "CM", watching: true },
  { name: "Ana Silva", avatar: "AS", watching: true },
  { name: "João Pedro", avatar: "JP", watching: true },
  { name: "Maria L.", avatar: "ML", watching: true },
  { name: "Lucas F.", avatar: "LF", watching: false },
  { name: "Beatriz R.", avatar: "BR", watching: true },
  { name: "Pedro H.", avatar: "PH", watching: true },
  { name: "Fernanda C.", avatar: "FC", watching: false },
];

const ViewersList = () => {
  const watchingCount = viewers.filter((v) => v.watching).length;

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Assistindo agora</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Eye className="w-3.5 h-3.5" />
          <span>{watchingCount} online</span>
        </div>
      </div>

      <div className="space-y-3">
        {viewers.map((viewer) => (
          <div key={viewer.name} className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground">
                {viewer.avatar}
              </div>
              {viewer.watching && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-viewer-dot border-2 border-card" />
              )}
            </div>
            <span className="text-sm text-foreground">{viewer.name}</span>
            {viewer.watching && (
              <span className="ml-auto text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                assistindo
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewersList;
