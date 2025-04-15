import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import "./config/mongo.js";

import { VerifyToken, VerifySocketToken } from "./middlewares/VerifyToken.js";
import chatRoomRoutes from "./routes/chatRoom.js";
import chatMessageRoutes from "./routes/chatMessage.js";
import userRoutes from "./routes/user.js";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(VerifyToken);

const PORT = process.env.PORT || 8080;

app.use("/chatapi/room", chatRoomRoutes);
app.use("/chatapi/message", chatMessageRoutes);
app.use("/chatapi/user", userRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// io.use(VerifySocketToken);

global.onlineUsers = new Map();



// Socket.IO event listeners
let onlineUsers = [];

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.emit("getUsers", Array.from(onlineUsers));
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const sendUserSocket = onlineUsers.get(receiverId);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("getMessage", {
        senderId,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    // onlineUsers.delete(getKey(onlineUsers, socket.id));
    // socket.emit("getUsers", Array.from(onlineUsers));
    console.log("User disconnected");
  });

  socket.on("join", (userId) => {
    // Join the room if not already joined
    if (!socket.rooms.has(userId)) {
      socket.join(userId);
      if (!onlineUsers.includes(userId)) {
        onlineUsers.push(userId);
      }
    }
    console.log("User joined room:", userId);
    // Notify all users about the updated online users list
    onlineUsers.forEach((user) => {
      io.to(user).emit("online-users-updated", onlineUsers);
    });
  });

  socket.on("send-new-message", (message) => {
    console.log("New message sent:", message);
    // Emit the new message event to each user in the chat
    message.chat.users.forEach((user) => {
      io.to(user._id).emit("new-message-received", message);
    });
  });

  socket.on("read-all-messages", ({ chatId, users, readByUserId }) => {
    // Notify each chat participant that the messages have been read
    users.forEach((user) => {
      io.to(user._id).emit("user-read-all-chat-messages", { chatId, readByUserId });
    });
  });

  socket.on("typing", ({ chat, senderId, senderName }) => {
    console.log("User is typing:", senderId);
    // Inform the other chat participants that someone is typing
    chat.users.forEach((user) => {
      if (user._id !== senderId)
        io.to(user._id).emit("typing", { chat, senderName });
    });
  });

  socket.on("logout", (userId) => {
    // Leave the room and update the online users list
    socket.leave(userId);
    onlineUsers = onlineUsers.filter((user) => user !== userId);
    onlineUsers.forEach((user) => {
      io.to(user).emit("online-users-updated", onlineUsers);
    });
  });
  
});
