"use client";

import { useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const retryCount = useRef(0);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
      socket?.disconnect();
      return;
    }

    const socketInstance = io(`:${process.env.NEXT_PUBLIC_SOCKET_PORT}`, {
      path: "/api/socket",
      addTrailingSlash: false,
      query: {
        userId: session?.user.id,
      },
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      retryCount.current = 0;
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("connect_error", async (err) => {
      console.log(`connect_error due to ${err.message}`);
      retryCount.current += 1;

      if (retryCount.current <= 4) await fetch("/api/socket");
      else socketInstance.close();
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [status]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
