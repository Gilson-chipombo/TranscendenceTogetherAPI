import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

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

// const [userSelected, setUserSelected] = useState<string>("null");

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

interface MessagesProps { }

const Messages = ({ }: MessagesProps) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatUser = params.get("chat");

  const [contacts] = useState<ChatContact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(
    chatUser ? initialContacts.find((c) => c.username === chatUser) || null : null
  );
  const [newMessage, setNewMessage] = useState("");
  const [textareaRows, setTextareaRows] = useState(1);
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
    setTextareaRows(1);
  };

  const messages = selectedContact ? chatMessages[selectedContact.username] || [] : [];

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedContact]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header name="Room" />
        <div className="px-6 pt-6 pb-4 flex-1 min-h-0 overflow-hidden">
          <div className="flex h-[calc(100%-1rem)] bg-card rounded-xl border border-border overflow-hidden">
            {/* Contact list */}
            <div className={`w-72 border-r border-border flex flex-col shrink-0 overflow-hidden ${selectedContact ? "hidden md:flex" : "flex"}`}>
              <div className="p-5 border-b border-border">
                <h2 className="text-lg font-display font-bold text-foreground">Messages</h2>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
                {contacts.map((contact) => (
                  <button
                    key={contact.username}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-surface transition-colors ${selectedContact?.username === contact.username ? "bg-secondary text-primary-foreground" : ""
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
            <div className={`flex-1 flex flex-col min-h-0 overflow-hidden ${!selectedContact ? "hidden md:flex" : "flex"}`}>
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

                  <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`px-3 py-2 rounded-xl text-sm ${msg.from === "me"
                            ? "bg-primary text-primary-foreground rounded-br-sm rounded-tr-none"
                            : "bg-secondary text-foreground rounded-bl-sm rounded-tl-none"
                            }`}
                        >
                          <div className="whitespace-pre-wrap break-words max-w-[140px] sm:max-w-[240px] md:max-w-[10rem] lg:max-w-[20rem] xl:max-w-[35rem] flex-wrap "><p>{msg.text}</p></div>
                          <span className={`text-[10px]  mt-1 block ${msg.from === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                  </div>

                  <div className="bg-secondary p-4 border-t border-border flex items-end gap-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        const lines = e.target.value.split('\n').length;
                        setTextareaRows(Math.min(lines, 4));
                      }}
                      rows={textareaRows}
                      placeholder="Type a message"
                      className="m-0 flex-1 bg-black/10 rounded-sm px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground border-none outline-none resize-none overflow-y-auto scrollbar-thin  scrollbar-thumb-primary scrollbar-track-card"
                      style={{ lineHeight: '1.5' }}
                    />
                    <button
                      onClick={handleSend}
                      className="m-0 px-5 py-2.5 rounded-sm gap-2 bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Send size={20} /> 
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
      </div>
    </div>
  );
};

export default Messages;