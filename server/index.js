const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);


// ✅ ALLOWED ORIGINS (IMPORTANT)
const allowedOrigins = [
  "http://localhost:5173", // local
  "https://skill-swap-67zi.vercel.app" // your vercel frontend
];


// ✅ SOCKET.IO CORS FIX
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// ✅ EXPRESS CORS FIX
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json());


// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);


// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.json({ message: "SkillSwap API Running 🚀" });
});


// ✅ SOCKET LOGIC
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on("user_online", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("online_users", Array.from(onlineUsers.keys()));
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send_message", async (data) => {
    const { roomId, senderId, receiverId, content } = data;

    try {
      const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        roomId,
        content,
      });

      io.to(roomId).emit("receive_message", message);
    } catch (err) {
      console.error("Message save error:", err);
    }
  });

  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("user_typing", { userId: data.userId });
  });

  socket.on("stop_typing", (data) => {
    socket.to(data.roomId).emit("user_stop_typing", { userId: data.userId });
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("online_users", Array.from(onlineUsers.keys()));
  });
});


// ✅ DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/skillswap")
  .then(() => {
    console.log("✅ MongoDB Connected");

    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB Error:", err.message));