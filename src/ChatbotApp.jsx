import { useState, useRef, useEffect } from "react";

// Correct backend endpoint
const API_URL = "https://chat-backend-production-bba6.up.railway.app/chat";

const SUGGESTIONS = [
 
];

const BotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4"/>
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const SendIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22d3a5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const StarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a99fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
  </svg>
);

const ThinkingDots = () => (
  <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: "6px", height: "6px", borderRadius: "50%",
        background: "#3a3860",
        animation: "dotBounce 1.3s ease-in-out infinite",
        animationDelay: `${i * 0.15}s`
      }}/>
    ))}
  </div>
);

const HISTORY_ITEMS = [

];

export default function ChatbotApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    setMessages(prev => [...prev, { id: Date.now(), role: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: "bot", isError: true,
       text: "Could not reach the backend. Please try again.",
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const copyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }

        .app-shell {
          display: flex; height: 100vh;
          background: #0a0a0f; font-family: 'Inter', sans-serif;
          color: #c8c4e0; overflow: hidden;
        }

        .sidebar {
          width: 230px; background: #0f0f18;
          border-right: 0.5px solid #1a1a2e;
          display: flex; flex-direction: column; flex-shrink: 0;
        }
        .sb-head { padding: 18px 16px 12px; border-bottom: 0.5px solid #1a1a2e; }
        .logo { display: flex; align-items: center; gap: 10px; }
        .logo-gem {
          width: 30px; height: 30px; border-radius: 9px;
          background: #5b4fcf; display: flex; align-items: center; justify-content: center;
        }
        .logo-name {
          font-family: 'Syne', sans-serif; font-size: 15px;
          font-weight: 700; color: #e8e4ff; letter-spacing: 0.01em;
        }
        .logo-sub { font-size: 10px; color: #3a3a5a; margin-top: 1px; }

        .new-btn {
          margin: 12px; padding: 8px 12px;
          background: #1c1a33; border: 0.5px solid #2e2a52; border-radius: 10px;
          color: #9b95d4; font-size: 12px; font-family: 'Inter', sans-serif;
          cursor: pointer; display: flex; align-items: center; gap: 7px;
          transition: all 0.15s;
        }
        .new-btn:hover { background: #231f3d; color: #c4bfef; }

        .sb-section {
          padding: 8px 14px 4px; font-size: 10px; color: #2e2e4a;
          font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase;
        }
        .chat-item {
          padding: 8px 14px; display: flex; align-items: center; gap: 9px;
          cursor: pointer; border-radius: 8px; margin: 1px 8px; transition: background 0.12s;
        }
        .chat-item:hover { background: #151528; }
        .chat-item.active { background: #1c1a33; }
        .chat-dot { width: 6px; height: 6px; border-radius: 50%; background: #2e2e4a; flex-shrink: 0; }
        .chat-item.active .chat-dot { background: #7b6ef6; }
        .chat-label { font-size: 12px; color: #4a4a6a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .chat-item.active .chat-label { color: #c4bfef; }

        .sb-footer { margin-top: auto; padding: 12px; border-top: 0.5px solid #1a1a2e; }
        .user-row {
          display: flex; align-items: center; gap: 9px;
          padding: 7px 8px; border-radius: 9px; cursor: pointer;
        }
        .user-row:hover { background: #151528; }
        .avatar-sm {
          width: 28px; height: 28px; border-radius: 50%; background: #2a1f52;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 600; color: #9b87f5; flex-shrink: 0;
        }
        .user-name { font-size: 12px; color: #5a5a7a; font-weight: 500; }

        .main { flex: 1; display: flex; flex-direction: column; background: #080810; min-width: 0; }

        .topbar {
          padding: 13px 20px; border-bottom: 0.5px solid #1a1a2e;
          display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
        }
        .model-badge { display: flex; align-items: center; gap: 8px; }
        .live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #22d3a5;
          animation: pulseDot 2s ease-in-out infinite;
        }
        .model-name { font-size: 12px; color: #3d6a5a; font-weight: 500; }
        .topbar-right { display: flex; gap: 8px; }
        .icon-btn {
          width: 28px; height: 28px; border-radius: 8px;
          border: 0.5px solid #1a1a2e; background: transparent; cursor: pointer;
          color: #2e2e4a; display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .icon-btn:hover { background: #151528; color: #5a5a7a; }

        .messages {
          flex: 1; overflow-y: auto; padding: 20px 24px 10px;
          display: flex; flex-direction: column; gap: 18px;
          scrollbar-width: thin; scrollbar-color: #1a1a2e transparent;
        }
        .messages::-webkit-scrollbar { width: 4px; }
        .messages::-webkit-scrollbar-thumb { background: #1a1a2e; border-radius: 4px; }

        .empty-state {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 10px; padding: 40px; animation: fadeUp 0.3s ease;
        }
        .empty-gem {
          width: 56px; height: 56px; border-radius: 16px; background: #1c1a33;
          display: flex; align-items: center; justify-content: center; margin-bottom: 8px;
        }
        .empty-gem svg { width: 24px; height: 24px; }
        .empty-title {
          font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700;
          color: #e8e4ff; letter-spacing: -0.02em;
        }
        .empty-sub { font-size: 13px; color: #3a3a5a; }

        .msg-row {
          display: flex; gap: 10px; animation: fadeUp 0.22s ease;
          max-width: 820px; width: 100%; align-self: center;
        }
        .msg-row.user { flex-direction: row-reverse; }

        .msg-avatar {
          width: 28px; height: 28px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px;
        }
        .msg-avatar.bot { background: #1c1a33; color: #7b6ef6; }
        .msg-avatar.user { background: #1a1535; color: #9b87f5; }

        .bubble-col { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
        .msg-row.user .bubble-col { align-items: flex-end; }

        .bubble {
          padding: 10px 14px; border-radius: 14px;
          font-size: 13px; line-height: 1.7;
          max-width: 82%; white-space: pre-wrap; word-break: break-word;
        }
        .bubble.bot {
          background: #0f0f1c; border: 0.5px solid #1e1e32;
          border-bottom-left-radius: 4px; color: #c8c4e0;
        }
        .bubble.user {
          background: #1c1a33; border: 0.5px solid #2e2a52;
          border-bottom-right-radius: 4px; color: #d4cfff;
        }
        .bubble.error { background: #1a0f15; border-color: #3a1525; color: #f87171; }

        .bubble-meta { display: flex; align-items: center; gap: 7px; padding: 0 2px; }
        .msg-row.user .bubble-meta { justify-content: flex-end; }
        .meta-time { font-size: 10px; color: #2e2e4a; }

        .copy-btn {
          width: 18px; height: 18px; border-radius: 4px;
          border: none; background: transparent; cursor: pointer;
          color: #2e2e4a; display: flex; align-items: center; justify-content: center;
          transition: color 0.15s;
        }
        .copy-btn:hover { color: #5a5a7a; }

        .typing-row { display: flex; gap: 10px; animation: fadeUp 0.22s ease; max-width: 820px; align-self: center; width: 100%; }
        .typing-bubble {
          background: #0f0f1c; border: 0.5px solid #1e1e32;
          border-radius: 14px; border-bottom-left-radius: 4px; padding: 12px 16px;
        }

        .sug-row { display: flex; gap: 8px; flex-wrap: wrap; padding: 0 24px 14px; justify-content: center; }
        .sug {
          padding: 6px 13px; border-radius: 20px;
          border: 0.5px solid #1e1e32; background: #0f0f1c;
          color: #4a4a6a; font-size: 11px; cursor: pointer;
          font-family: 'Inter', sans-serif; transition: all 0.15s; white-space: nowrap;
        }
        .sug:hover { border-color: #3d35a0; color: #9b87f5; background: #130f28; }

        .input-zone { padding: 10px 16px 14px; border-top: 0.5px solid #1a1a2e; flex-shrink: 0; }
        .input-box {
          background: #0f0f1c; border: 0.5px solid #1e1e32; border-radius: 14px;
          padding: 10px 12px; display: flex; align-items: flex-end; gap: 10px;
          transition: border-color 0.2s; max-width: 820px; margin: 0 auto;
        }
        .input-box:focus-within { border-color: #3d35a0; }
        .chat-input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #c8c4e0; font-size: 13px; font-family: 'Inter', sans-serif;
          resize: none; max-height: 130px; min-height: 22px; line-height: 1.55; padding: 3px 0;
        }
        .chat-input::placeholder { color: #2e2e4a; }
        .send-btn {
          width: 30px; height: 30px; border-radius: 9px;
          border: none; background: #5b4fcf; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s; flex-shrink: 0;
        }
        .send-btn:hover:not(:disabled) { background: #4f44b8; }
        .send-btn:disabled { background: #1c1a33; cursor: not-allowed; }
        .hint { text-align: center; font-size: 10px; color: #1e1e32; margin-top: 7px; letter-spacing: 0.03em; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dotBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

      <div className="app-shell">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sb-head">
            <div className="logo">
              <div className="logo-gem"><StarIcon /></div>
              <div>
                <div className="logo-name">GemChat</div>
                <div className="logo-sub">Powered by Aun's AI</div>
              </div>
            </div>
          </div>

          <button className="new-btn" onClick={() => { setMessages([]); setActiveHistory(-1); }}>
            <PlusIcon /> New conversation
          </button>

          <div className="sb-section"></div>
          {HISTORY_ITEMS.map((item, i) => (
            <div key={i} className={`chat-item ${activeHistory === i ? "active" : ""}`} onClick={() => setActiveHistory(i)}>
              <div className="chat-dot" />
              <div className="chat-label">{item}</div>
            </div>
          ))}

          <div className="sb-footer">
            <div className="user-row">
              <div className="avatar-sm">AU</div>
              <div className="user-name">My Account</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="topbar">
            <div className="model-badge">
              <div className="live-dot" />
              <div className="model-name">Aun's AI · active</div>
            </div>
            <div className="topbar-right">
              <button className="icon-btn" title="Clear chat" onClick={() => setMessages([])}>
                <TrashIcon />
              </button>
            </div>
          </div>

          <div className="messages">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-gem"><StarIcon /></div>
                <div className="empty-title">How can I help you?</div>
                <div className="empty-sub">Ask me anything — powered by Gemini 2.5 Flash</div>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`msg-row ${msg.role}`}>
                  <div className={`msg-avatar ${msg.role}`}>
                    {msg.role === "bot" ? <BotIcon /> : <UserIcon />}
                  </div>
                  <div className="bubble-col">
                    <div className={`bubble ${msg.role}${msg.isError ? " error" : ""}`}>{msg.text}</div>
                    <div className="bubble-meta">
                      <span className="meta-time">{now}</span>
                      {msg.role === "bot" && !msg.isError && (
                        <button className="copy-btn" onClick={() => copyText(msg.id, msg.text)}>
                          {copiedId === msg.id ? <CheckIcon /> : <CopyIcon />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="typing-row">
                <div className="msg-avatar bot"><BotIcon /></div>
                <div className="typing-bubble"><ThinkingDots /></div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length === 0 && (
            <div className="sug-row">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="sug" onClick={() => sendMessage(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="input-zone">
            <div className="input-box">
              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder="Ask anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                onInput={e => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px";
                }}
              />
              <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
                <SendIcon />
              </button>
            </div>
            <div className="hint">Enter to send · Shift+Enter for new line</div>
          </div>
        </div>
      </div>
    </>
  );
}
