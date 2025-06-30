import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectToServer = () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    setError('');
    const websocket = new WebSocket('ws://localhost:5000');
    websocket.onopen = () => {
      setIsConnected(true);
      websocket.send(JSON.stringify({
        type: 'init',
        username: username.trim()
      }));
    };
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'history') {
        setMessages(data.messages);
      } else if (data.type === 'message') {
        setMessages(prev => [...prev, data]);
      }
    };
    websocket.onclose = () => {
      setIsConnected(false);
    };
    websocket.onerror = (error) => {
      setError('Failed to connect to server. Please check if the backend is running.');
    };
    setWs(websocket);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !ws) return;
    ws.send(JSON.stringify({
      type: 'message',
      message: newMessage.trim()
    }));
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const disconnect = () => {
    if (ws) {
      ws.close();
      setWs(null);
    }
    setIsConnected(false);
    setMessages([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Real-Time Chat App</h1>
      </header>
      <main className="chat-container">
        {!isConnected ? (
          <div className="login-section enhanced-login">
            <div className="login-avatar">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="30" fill="#667eea"/>
                <circle cx="30" cy="26" r="13" fill="#fff"/>
                <ellipse cx="30" cy="48" rx="17" ry="10" fill="#fff"/>
              </svg>
            </div>
            <h2>Welcome!</h2>
            <p className="login-desc">Enter your username to join the chat room</p>
            <div className="username-input enhanced-username-input">
              <input
                type="text"
                placeholder="Type your username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && connectToServer()}
                maxLength={20}
                autoFocus
              />
              <button className="enhanced-login-btn" onClick={connectToServer}>
                <span role="img" aria-label="wave">👋</span> Join Chat
              </button>
            </div>
            {error && <div className="login-error">{error}</div>}
          </div>
        ) : (
          <div className="chat-section">
            <div className="chat-header">
              <h3>Welcome, {username}!</h3>
              <button onClick={disconnect} className="disconnect-btn">Leave Chat</button>
            </div>
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.username === username ? 'own-message' : 'other-message'}`}
                >
                  <div className="message-header">
                    <span className="username">{msg.username}</span>
                    <span className="timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="message-content">{msg.message}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="message-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
