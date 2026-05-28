import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Editor() {
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {

    // Load saved document
    socket.on("load-document", (data) => {
      setText(data);
    });

    // Receive live updates
    socket.on("receive-changes", (data) => {
      setText(data.text);
    });

    // Typing indicator
    socket.on("show-typing", (name) => {
      setTypingUser(name);

      setTimeout(() => {
        setTypingUser("");
      }, 2000);
    });

  }, []);

  const handleChange = (e) => {
    const value = e.target.value;

    setText(value);

    socket.emit("send-changes", {
      text: value,
      user: username,
    });

    socket.emit("typing", username);
  };

  return (
    <div>

      <input
        type="text"
    placeholder="Enter your name"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />

  <br />

  <div className="status">
    🟢 Connected
  </div>

  {typingUser && (
    <p>
      <b>{typingUser}</b> is typing...
    </p>
  )}

  <textarea
    value={text}
    onChange={handleChange}
    placeholder="Start typing..."
       
      />

    </div>
  );
}

export default Editor;
