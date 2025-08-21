import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = (accessToken) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
      auth: { token: accessToken },
    });

    // newSocket.on("connect", () => {
    //   console.log("[socket] connected:", newSocket.id);
    // });

    newSocket.on("connect_error", (err) => {
      console.error("[socket] connect_error:", err.message);
    });

    // newSocket.on("disconnect", (reason) => {
    //   console.log("[socket] disconnected:", reason);
    // });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [accessToken]);

  return socket;
};

export default useSocket;
