const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const Document = require("./Document");

const app = express();

app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/editorDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let documentData = "";

io.on("connection", async (socket) => {
  console.log("User Connected");

  // Load saved document
  const savedDoc = await Document.findOne();

  if (savedDoc) {
    documentData = savedDoc.content;
  }

  socket.emit("load-document", documentData);

  // Receive text changes
  socket.on("send-changes", async (data) => {
    documentData = data.text;

    // Send to other users
    socket.broadcast.emit("receive-changes", data);

    // Remove old document
    await Document.deleteMany({});

    // Save new document
    await Document.create({
      content: documentData,
    });
  });

  // Typing status
  socket.on("typing", (name) => {
    socket.broadcast.emit("show-typing", name);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});