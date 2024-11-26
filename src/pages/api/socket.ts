import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";
import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}
export default function SocketHandler(
  _req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    res.status(200).json({
      success: true,
      message: "Socket is already running",
      socket: `:${process.env.NEXT_PUBLIC_SOCKET_PORT}`,
    });
    return;
  }

  console.log(
    "Starting Socket.IO server on port:",
    process.env.NEXT_PUBLIC_SOCKET_PORT
  );

  const io = new Server({
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: "*",
    },
  }).listen(
    process.env.NEXT_PUBLIC_SOCKET_PORT
      ? +process.env.NEXT_PUBLIC_SOCKET_PORT
      : 3001
  );

  io.on("connect", (socket) => {
    console.log("socket connect", socket.id);

    const { userId } = socket.handshake.query;
    if (userId) {
      socket.join(userId as string);
    }
    socket.on("notification", (notify, userId) => {
      console.log("Received notify from client:", notify);

      io.to(userId).emit("notification", notify);
    });
    socket.on("message", (notify, userId) => {
      console.log("Received message notify from client:", notify);

      io.to(userId).emit("message", notify);
    });

    socket.on("leaveConversation", (conversationId) => {
      if (conversationId) {
        socket.leave(conversationId);
        console.log(`${socket.id} left conversation ${conversationId}`);
      }
    });
    socket.on("joinConversation", (conversationId) => {
      console.log(conversationId);

      if (conversationId) {
        socket.join(conversationId); // Odaya katıl
        console.log(`${socket.id} joined conversation ${conversationId}`);
      }
    });

    // Listen for message event from the client
    socket.on("message", (conversationId, message) => {
      console.log("Received message from client:", message);

      io.in(conversationId as string).emit("message", message);
    });

    socket.on("disconnect", async () => {
      console.log("socket disconnect");
    });
  });

  res.socket.server.io = io;
  res.status(201).json({
    success: true,
    message: "Socket is started",
    socket: `:${process.env.NEXT_PUBLIC_SOCKET_PORT}`,
  });
}
