import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [isVisible, setIsVisible] = useState(true);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggle = () => {
    setIsVisible(!isVisible);
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query) return;

    setMessages([...messages, { sender: "user", text: query }]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: data.response },
        ]);
      } else {
        setError("Error: " + data.response);
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className={sidebar ${isVisible ? "visible" : "hidden"}}>
        <div className="sidebar-header">
          <img
            src={${process.env.PUBLIC_URL}/m1.jpg}
            alt="logo"
            className="logo"
          />
          <div className="sidebar-brand">Mechanic AI</div>
        </div>
        <div className="icons">
          <img
            src={${process.env.PUBLIC_URL}/toggle.png}
            alt="toggle"
            className="toggle-icon"
            onClick={toggle}
          />
        </div>
        <ul className="sidebar-nav">
          <li className="nav-title">Previous Chats</li>
        </ul>
      </div>

      <div className="chat-area">
        <div className="chat-window">
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={message ${message.sender}}>
                <p>{message.text}</p>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <p>Loading...</p>
              </div>
            )}
            {error && (
              <div className="message bot error">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
        <div className="chat-input-container">
          <form className="chat-input" onSubmit={handleQuerySubmit}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question"
              required
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}