const express = require("express");
const http = require("http");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const JWT_SECRET = "talknest_secret_key";
const DB_FILE = path.join(__dirname, "data.json");
const GROUP_NAME = "TalkNest Lounge";
const ROOM_NAME = "talknest-lounge";

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], messages: [] }, null, 2));
}

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const db = readDB();
  const normalizedEmail = email.trim().toLowerCase();
  const exists = db.users.find((user) => user.email === normalizedEmail);

  if (exists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const user = {
    id: makeId(),
    name: name.trim(),
    email: normalizedEmail,
    password: await bcrypt.hash(password, 10),
  };

  db.users.push(user);
  writeDB(db);

  res.json({ token: createToken(user), user: publicUser(user) });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const db = readDB();
  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find((item) => item.email === normalizedEmail);

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.json({ token: createToken(user), user: publicUser(user) });
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

function getOnlineMembers() {
  return Array.from(onlineUsers.values()).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    socketId: Array.from(user.socketIds)[0],
  }));
}

function emitGroupMembers() {
  io.emit("group_members", getOnlineMembers());
}

function getGroupMessages() {
  const db = readDB();

  return db.messages.filter(
    (message) =>
      message.type === "chat" &&
      message.groupName === GROUP_NAME &&
      message.senderId &&
      message.senderName &&
      message.text
  );
}

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    socket.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  const existingUser = onlineUsers.get(socket.user.id);

  if (existingUser) {
    existingUser.socketIds.add(socket.id);
  } else {
    onlineUsers.set(socket.user.id, {
      id: socket.user.id,
      name: socket.user.name,
      email: socket.user.email,
      socketIds: new Set([socket.id]),
    });
  }

  socket.join(ROOM_NAME);

  socket.emit("message_history", getGroupMessages());
  emitGroupMembers();

  socket.to(ROOM_NAME).emit("receive_message", {
    id: makeId(),
    type: "system",
    text: `${socket.user.name} joined the chat`,
  });

  socket.on("send_message", ({ text }) => {
    if (!text || !text.trim()) return;

    const db = readDB();

    const message = {
      id: makeId(),
      type: "chat",
      groupName: GROUP_NAME,
      senderId: socket.user.id,
      senderName: socket.user.name,
      text: text.trim(),
      time: getTime(),
      sentTo: getOnlineMembers()
        .filter((member) => member.id !== socket.user.id)
        .map((member) => member.name),
    };

    db.messages.push(message);
    writeDB(db);

    io.to(ROOM_NAME).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    const existingUser = onlineUsers.get(socket.user.id);

    if (existingUser) {
      existingUser.socketIds.delete(socket.id);

      if (existingUser.socketIds.size === 0) {
        onlineUsers.delete(socket.user.id);

        socket.to(ROOM_NAME).emit("receive_message", {
          id: makeId(),
          type: "system",
          text: `${socket.user.name} left the chat`,
        });
      }
    }

    emitGroupMembers();
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
