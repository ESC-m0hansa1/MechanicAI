import { useState } from "react";
import Sidebar from "./Components/Sidebar";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChatIndex, setSelectedChatIndex] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNewChat = () => {
    setChatHistory([...chatHistory, []]); // Adds a new empty chat
    setSelectedChatIndex(chatHistory.length);
    setCurrentMessages([]);
  };

  const handleChatSelection = (index) => {
    setSelectedChatIndex(index);
    setCurrentMessages(chatHistory[index]);
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newMessages = [...currentMessages, { sender: "user", text: query }];
    setCurrentMessages(newMessages);
    setQuery(""); // Clear input field

    // Simulate a bot response
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Bot's response" },
      ]);
    }, 1000);
  };

  return (
    <div className="app-container">
      <Sidebar
        chatHistory={chatHistory}
        selectedChatIndex={selectedChatIndex}
        handleNewChat={handleNewChat}
        handleChatSelection={handleChatSelection}
      />
      <div className="main-content">
        <div className="messages-container">
          {currentMessages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
          {isLoading && <div className="message bot">Typing...</div>}
          {error && <div className="message error">{error}</div>}
        </div>
        <div className="input-wrapper">
          <form onSubmit={handleQuerySubmit}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your message..."
              className="message-input"
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
