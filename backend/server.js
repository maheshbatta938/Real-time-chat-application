// Express.js, WebSocket, and MongoDB real-time chat server
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const config = require('./config');

// Load environment variables
// dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// In-memory storage as fallback
let inMemoryMessages = [];
let useInMemory = false;

// MongoDB connection
mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  useInMemory = false;
}).catch((err) => {
  console.log('MongoDB connection failed, using in-memory storage:', err.message);
  useInMemory = true;
});

// Mongoose schema for chat messages
const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

// Store connected clients and their usernames
const clients = new Map();

// Handle WebSocket connections
wss.on('connection', (ws) => {
  let username = null;

  // Receive messages from client
  ws.on('message', async (data) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'init') {
        // Client sends username on connect
        username = parsed.username;
        clients.set(ws, username);
        
        // Send last 50 messages as chat history
        if (useInMemory) {
          const history = inMemoryMessages.slice(-50);
          ws.send(JSON.stringify({ type: 'history', messages: history }));
        } else {
          const history = await Message.find().sort({ timestamp: -1 }).limit(50).sort({ timestamp: 1 });
          ws.send(JSON.stringify({ type: 'history', messages: history }));
        }
      } else if (parsed.type === 'message') {
        // Save and broadcast new message
        const newMsg = {
          username,
          message: parsed.message,
          timestamp: new Date(),
        };
        
        if (useInMemory) {
          inMemoryMessages.push(newMsg);
          // Keep only last 1000 messages in memory
          if (inMemoryMessages.length > 1000) {
            inMemoryMessages = inMemoryMessages.slice(-1000);
          }
        } else {
          const savedMsg = new Message(newMsg);
          await savedMsg.save();
          newMsg.timestamp = savedMsg.timestamp;
        }
        
        const outMsg = {
          type: 'message',
          username,
          message: parsed.message,
          timestamp: newMsg.timestamp,
        };
        
        // Broadcast to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(outMsg));
          }
        });
      }
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    // Optionally broadcast user left
  });
});

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Chat server is running');
});

const PORT = config.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
}); 