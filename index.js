const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http, {cors: { origin: '*'}});
// middleware
app.use(cors());
app.use(express.json());
// Routes
app.get("/", (req, res) => {
  res.send("Chat App Backend Running");
});
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));
const Message = require('./models/Message'); // Import Message model

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send_message', async (data) => {
    const { senderId, receiverId, text } = data;

    // Save message to DB
    const message = await Message.create({ sender: senderId, receiver: receiverId, text });

    // Emit message to receiver
    socket.broadcast.emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
