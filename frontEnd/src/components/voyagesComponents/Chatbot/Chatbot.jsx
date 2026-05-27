import { useState } from "react";
import axios from "axios";
import BASE_URL from "../../../../config";
import { MessageCircle, X, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(true); 
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "👋 Welcome aboard! How can I help with your cruise booking today?",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post(`${BASE_URL}/chatbot/chat`, {
        message,
      });

      const botMsg = {
        sender: "bot",
        text: res.data.reply,
      };

      setChat((prev) => [...prev, botMsg]);
      if (res.data.route) {
        navigate(res.data.route);
      }
      
    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: error.response?.data?.reply || "Server error occurred.",
        },
      ]);
    }

    setMessage("");
  };

  return (
    <>
      {/* Floating Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl z-50 hover:scale-110 transition"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border">
          {/* Header */}
          <div className="bg-[#1b4c6d] text-white p-4 flex justify-between items-center">
            <h2 className="font-semibold">Cruise Assistant</h2>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-2 rounded-xl whitespace-pre-line ${
                  msg.sender === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "bg-white text-black shadow"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about cruises..."
              className="flex-1 border border-[#1b4c6d] rounded-lg px-4 py-2 outline-none text-black"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white p-3 rounded-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
