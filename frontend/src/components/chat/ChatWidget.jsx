import { useState } from "react";
import Chat from "./Chat";
import "./ChatWidget.css"; // import CSS

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Floating Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="chat-floating-btn">
        💬
      </button>

      {/* Modal Chat */}
      {isOpen && (
        <div className="chat-modal">
          {/* Header */}
          <div className="chat-header">
            <span>Chat</span>
            <button onClick={() => setIsOpen(false)} className="chat-close-btn">
              ✖
            </button>
          </div>

          {/* Body */}
          <div className="chat-body">
            <Chat />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
