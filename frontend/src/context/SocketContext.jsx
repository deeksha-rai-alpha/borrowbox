import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [liveNotification, setLiveNotification] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("borrowbox_token");

    // Only connect once the user is logged in
    if (!user || !token) {
      socketRef.current?.disconnect();
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
    });

    socket.on("new-notification", (notification) => {
      setLiveNotification(notification);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ liveNotification, clearLiveNotification: () => setLiveNotification(null) }}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);
