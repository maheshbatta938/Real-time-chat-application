# Assignment Submission

As a part of my Internship assignment, I have developed this full-stack real-time chat application using the MERN stack (MongoDB, Express.js, React.js, Node.js) and WebSocket for real-time communication.

# Real-Time Chat Application

A modern, real-time chat application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring WebSocket communication for instant messaging.

## 🚀 Features

- **Real-time messaging** using WebSocket connections
- **User authentication** with username-based login
- **Message persistence** with MongoDB database
- **Chat history** - displays last 50 messages on connection
- **Modern UI** with responsive design and beautiful animations
- **Multi-user support** - multiple users can chat simultaneously
- **Auto-scroll** to latest messages
- **Graceful error handling** with fallback to in-memory storage

## 🏗️ Architecture

### Backend (Node.js + Express.js)
- **Express.js server** with RESTful API endpoints
- **WebSocket server** using the `ws` module for real-time communication
- **MongoDB integration** with Mongoose ODM for data persistence
- **Asynchronous I/O** handling for concurrent client connections
- **Error handling** with fallback to in-memory storage if MongoDB is unavailable

### Frontend (React.js)
- **Single Page Application (SPA)** built with React.js
- **WebSocket client** using browser's native WebSocket API
- **State management** with React hooks (useState, useEffect, useRef)
- **Responsive design** that works on desktop and mobile devices
- **Modern UI** with gradient backgrounds and smooth animations

### Database (MongoDB)
- **Message schema** with username, message content, and timestamp
- **Automatic indexing** on timestamp for efficient querying
- **Connection pooling** for optimal performance

## 📁 Project Structure

```
├── backend/
│   ├── server.js          # Main Express server with WebSocket
│   ├── config.js          # Configuration (MongoDB URI, port)
│   ├── package.json       # Backend dependencies
│   └── node_modules/      # Backend packages
├── Messenger/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Styling for the chat application
│   │   └── main.jsx       # React entry point
│   ├── package.json       # Frontend dependencies
│   └── node_modules/      # Frontend packages
└── README.md              # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure MongoDB connection:**
   - Edit `config.js` and update the `MONGO_URI` with your MongoDB connection string
   - If using MongoDB Atlas, ensure your IP is whitelisted in Network Access

4. **Start the backend server:**
   ```bash
   npm start
   ```
   The server will start on port 5000 (or the port specified in config.js)

### Frontend Setup

1. **Navigate to the Messenger directory:**
   ```bash
   cd Messenger
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The React app will start on `http://localhost:5173`

## 🚀 Usage

1. **Open your browser** and navigate to `http://localhost:5173`
2. **Enter a username** in the login screen
3. **Click "Join Chat"** to connect to the WebSocket server
4. **Start chatting!** Messages will appear in real-time for all connected users
5. **Use "Leave Chat"** to disconnect from the server

## 🔧 Configuration

### Backend Configuration (`backend/config.js`)
```javascript
module.exports = {
  MONGO_URI: 'your-mongodb-connection-string',
  PORT: 5000
};
```

### Frontend Configuration
The frontend connects to `ws://localhost:5000` by default. To change this:
1. Edit `Messenger/src/App.jsx`
2. Update the WebSocket URL in the `connectToServer` function

## 🌐 Deployment

### Backend Deployment (Heroku/Render)

1. **Create a new repository** and push your code
2. **Deploy to Heroku:**
   ```bash
   heroku create your-chat-app
   heroku config:set MONGO_URI=your-mongodb-connection-string
   git push heroku main
   ```

3. **Deploy to Render:**
   - Connect your repository to Render
   - Set environment variables: `MONGO_URI`
   - Build command: `npm install`
   - Start command: `npm start`

### Frontend Deployment (Netlify/Vercel)

1. **Build the production version:**
   ```bash
   cd Messenger
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your repository and set build command: `npm run build`

3. **Deploy to Vercel:**
   - Connect your repository to Vercel
   - Set build command: `npm run build`
   - Set output directory: `dist`

### Environment Variables for Production

**Backend:**
- `MONGO_URI`: Your MongoDB connection string
- `PORT`: Server port (usually set by hosting platform)

**Frontend:**
- Update WebSocket URL to your deployed backend URL
- Example: `wss://your-backend-app.herokuapp.com`

## 🔒 Security Considerations

- **Input validation** on both frontend and backend
- **XSS protection** through proper message sanitization
- **Rate limiting** (can be added to prevent spam)
- **CORS configuration** for cross-origin requests
- **Environment variables** for sensitive data

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed:**
   - Check your connection string in `config.js`
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify username and password are correct

2. **WebSocket Connection Failed:**
   - Ensure backend server is running on port 5000
   - Check firewall settings
   - Verify CORS configuration

3. **Frontend Not Loading:**
   - Check if React dev server is running
   - Clear browser cache
   - Check browser console for errors

### Error Handling

The application includes robust error handling:
- **MongoDB fallback:** Uses in-memory storage if database is unavailable
- **WebSocket reconnection:** Automatic reconnection attempts
- **User feedback:** Clear error messages for common issues

## 📝 API Documentation

### WebSocket Events

**Client to Server:**
- `init`: Send username on connection
  ```json
  {
    "type": "init",
    "username": "user123"
  }
  ```
- `message`: Send a new message
  ```json
  {
    "type": "message",
    "message": "Hello, world!"
  }
  ```

**Server to Client:**
- `history`: Chat history on connection
  ```json
  {
    "type": "history",
    "messages": [
      {
        "username": "user1",
        "message": "Hello!",
        "timestamp": "2024-01-01T12:00:00.000Z"
      }
    ]
  }
  ```
- `message`: New message broadcast
  ```json
  {
    "type": "message",
    "username": "user1",
    "message": "Hello, world!",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
  ```

### REST Endpoints

- `GET /`: Health check endpoint
- `GET /api/messages`: Get recent messages (if implemented)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created as a full-stack development project demonstrating real-time communication, database integration, and modern web development practices.

---

**Note:** This application is designed for educational and demonstration purposes. For production use, consider implementing additional security measures, user authentication, and scalability features. 
