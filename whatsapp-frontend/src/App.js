
// src/App.js
import React, { useEffect, useState } from "react";
import { getConversations, getMessages } from "./api";
import "./styles.css";

function App() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // Load all chats on page load
  useEffect(() => {
    getConversations().then(setChats);
  }, []);

  // When chat clicked → load messages
  function openChat(chat) {
    setSelectedChat(chat);
    getMessages(chat._id).then(setMessages);
  }

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        {chats.map((chat) => (
          <div
            className={`chat-item ${selectedChat?._id === chat._id ? "active" : ""}`}
            key={chat._id}
            onClick={() => openChat(chat)}
          >
            <strong>{chat.name || chat._id}</strong>
            <p>{chat.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="chat-header">
              <h4>{selectedChat.name || "Unknown"}</h4>
              <p>{selectedChat._id}</p>
            </div>

            {/* Messages */}
            <div className="chat-body">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message-bubble ${
                    msg.direction === "outbound" ? "sent" : "received"
                  }`}
                >
                  <span>{msg.text}</span>
                  <div className="msg-info">
                    <small>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                    <StatusIcon status={msg.status} />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-chat">Select a chat to view messages</div>
        )}
      </div>
    </div>
  );
}

// Status icon for sent/delivered/read
function StatusIcon({ status }) {
  if (status === "sent") return <span>✓</span>;
  if (status === "delivered") return <span>✓✓</span>;
  if (status === "read")
    return <span style={{ color: "blue" }}>✓✓</span>;
  return null;
}

export default App;
