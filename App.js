import React, { useState } from "react";
import Editor from "./Editor";
import "./App.css";

function App() {

  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : "light"}>

      <h1>Real-Time Collaborative Editor</h1>

      <p className="subtitle">
        Edit together. In real-time. Seamlessly.
      </p>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="mode-btn"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <Editor />

    </div>
  );
}

export default App;