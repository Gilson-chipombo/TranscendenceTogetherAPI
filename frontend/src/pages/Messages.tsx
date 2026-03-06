import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useLocation } from "react-router-dom";

interface ChatMessage {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
}

interface ChatContact {
  name: string;
  username: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread?: number;
  messages: ChatMessage[];
}

const initialContacts: ChatContact[] = [
  {
    name: "Domingas Quissanga.",
    username: "@dquissan_d",
    initials: "DQ",
    lastMessage: "Vamos assistir hoje?",
    time: "2min",
    unread: 1,
    messages: [
      { id: "1", from: "them", text: "E aí, tudo bem?", time: "14:30" },
      { id: "2", from: "me", text: "Tudo sim! E você?", time: "14:32" },
      { id: "3", from: "them", text: "Vamos assistir hoje?", time: "14:35" },
    ],
  },
  {
    name: "Luzizila Helena",
    username: "@lnzila_h",
    initials: "LH",
    lastMessage: "O Rei Leão é incrível!",
    time: "15min",
    messages: [
      { id: "1", from: "them", text: "Já viu O Rei Leão?", time: "13:00" },
      { id: "2", from: "me", text: "Ainda não!", time: "13:05" },
      { id: "3", from: "them", text: "O Rei Leão é incrível!", time: "13:06" },
    ],
  },
  {
    name: "Jose Andre",
    username: "@jondre_a",
    initials: "JA",
    lastMessage: "Com grandes poderes...",
    time: "1h",
    messages: [
      { id: "1", from: "them", text: "Com grandes poderes...", time: "12:00" },
    ],
  },
];

interface MessagesProps {}

const Messages = ({}: MessagesProps) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatUser = params.get("chat");

  const [contacts] = useState<ChatContact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(
    chatUser ? initialContacts.find((c) => c.username === chatUser) || null : null
  );
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(
    Object.fromEntries(initialContacts.map((c) => [c.username, c.messages]))
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedContact) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      from: "me",
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => ({
      ...prev,
      [selectedContact.username]: [...(prev[selectedContact.username] || []), msg],
    }));
    setNewMessage("");
  };

  const messages = selectedContact ? chatMessages[selectedContact.username] || [] : [];

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedContact]);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)]">
      <div className="flex h-full bg-card rounded-xl border border-border overflow-hidden">
        {/* Contact list */}
        <div className={`w-72 border-r border-border flex flex-col shrink-0 ${selectedContact ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-display font-bold text-foreground">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <button
                key={contact.username}
                onClick={() => setSelectedContact(contact)}
                className={`w-full flex items-center gap-3 p-3 text-left hover:bg-surface transition-colors ${
                  selectedContact?.username === contact.username ? "bg-surface" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                  {contact.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground truncate">{contact.name}</span>
                    <span className="text-xs text-muted-foreground">{contact.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {contact.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${!selectedContact ? "hidden md:flex" : "flex"}`}>
          {selectedContact ? (
            <>
              <div className="p-4 border-b border-border flex items-center gap-3">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="md:hidden text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {selectedContact.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{selectedContact.name}</div>
                  <div className="text-xs text-muted-foreground">{selectedContact.username}</div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
                        msg.from === "me"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-surface text-foreground rounded-bl-sm"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[10px] mt-1 block ${msg.from === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>

              <div className="p-4 border-t border-border flex items-center gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-surface rounded-lg px-3 py-2 text-sm text-black placeholder:text-muted-foreground border-none outline-none"
                />
                <button
                  onClick={handleSend}
                  className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;