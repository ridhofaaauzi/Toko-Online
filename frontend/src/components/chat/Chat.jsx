import { useEffect, useState } from "react";
import useSocket from "../../hooks/socket/UseSocket";
import "./Chat.css";

const Chat = () => {
  const accessToken = localStorage.getItem("accessToken");
  const socket = useSocket(accessToken);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // 🔹 Simpan messages ke localStorage setiap kali ada perubahan
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const updateUsername = () => {
      setUsername(localStorage.getItem("username") || "");
    };

    updateUsername();
    window.addEventListener("storage", updateUsername);
    return () => {
      window.removeEventListener("storage", updateUsername);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onReceive = (data) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === data.id)) return prev;
        return [...prev, data];
      });
    };

    socket.on("receive_message", onReceive);

    return () => {
      socket.off("receive_message", onReceive);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!socket || !socket.connected) return;
    if (message.trim() === "") return;

    const payload = {
      id: Date.now(),
      text: message,
      username: localStorage.getItem("username") || "Anonymous",
      time: new Date().toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("send_message", payload);
    setMessages((prev) => [...prev, payload]); // 🔹 tambahkan langsung ke state
    setMessage("");
  };

  return (
    <div className="chat-container">
      <h3>Real-Time Chat {socket?.connected ? "🟢" : "🟡 Connecting..."}</h3>
      <div className="chat-messages">
        {messages.map((msg) => (
          <p key={msg.id} className="chat-message">
            <b>
              [{msg.time}] {msg.username}:
            </b>{" "}
            {msg.text}
          </p>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="chat-input"
        />
        <button
          onClick={sendMessage}
          disabled={!socket?.connected}
          className="chat-send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
