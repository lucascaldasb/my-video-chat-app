const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit("user-connected", userId)

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId)
    })

    socket.on('send-message', (data) => {
      // Emite a mensagem para todos os usuários da sala
      io.emit('receive-message', { userId: data.userId, text: data.text });
    });    
  })
})

server.listen(5000, () => console.log("server is running on port 5000"))
