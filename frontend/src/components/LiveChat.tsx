import { Send, SendHorizontal } from "lucide-react";

function LiveChat() {
    return (<div className="bg-card rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Chat ao vivo</h3>
                <div className="space-y-2.5 overflow-y-auto max-h-48 pr-1 scrollbar-thin  scrollbar-thumb-secondary scrollbar-track-card " style={{ height: 200, overflowY: "auto" }}>
                  {[
                    { user: "Edmilson Wy DURO", msg: "Essa cena é incrível! 🦁" },
                    { user: "Gilson", msg: "Melhor filme de todos os tempos" },
                    { user: "Luzizila", msg: "Quem mais tá chorando? 😭" },
                    { user: "Liedson come empresário", msg: "Hakuna Matata!! 🎶" },
                  ].map((chat, i) => (
                    <div key={i} className="text-xs">
                      <span className="font-semibold text-primary">{chat.user}: </span>
                      <span className="text-muted-foreground">{chat.msg}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex content-center items-center gap-2 p-0  bg-secondary rounded-lg">
                {/* <textarea name="text" id="" placeholder="Enviar mensagem..." className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"></textarea> */}
                <input
                  type="text"
                  placeholder="Enviar mensagem..."
                  className=" bg-transparent w-full h-full px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button className="px-2 py-2 rounded-lg text-primary text-xs font-medium hover:bg-secondary/20 transition-colors"><SendHorizontal  size={20} strokeWidth={3} /></button>
                </div>
              </div>
              );
}
export default LiveChat;