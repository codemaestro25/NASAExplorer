import { useState, useRef, useEffect } from "react";
import "./ChatbotModal.css";

interface Message {
  sender: "user" | "bot";
  text: string;
}
//just trieds it but not integrated in the project
const ChatbotModal = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: input }]);
    setInput("");
    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: "bot", text: data.reply }]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "Sorry, I couldn't reach the server." },
      ]);
    }
  };

  return (
    <div className="chatbot-modal-overlay">
      <div className="chatbot-modal">
        <button className="chatbot-close-btn" onClick={onClose}>×</button>
        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatbot-input-row">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask NASA anything..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal; 