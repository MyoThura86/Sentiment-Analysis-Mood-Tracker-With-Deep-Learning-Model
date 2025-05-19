import React, { useRef, useState } from "react";
import Header from "./header";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import ArrowForward from "@mui/icons-material/ArrowForward";
import SentimentCard from "./sentimentCard";

function ImportText({ ai, setAi, selectedMode, setSelectedMode }) {
  const textareaRef = useRef(null);
  const dataRef = useRef({ text: "", sentiment: "" }); // Dictionary to hold message & sentiment
  const [, setTick] = useState(0); // Force re-render

  const forceRender = () => setTick((t) => t + 1);

  const sendMessage = () => {
    const text = textareaRef.current?.value.trim();
    if (text) {
      console.log("Sending message:", text);
      textareaRef.current.value = ""; // Clear textarea

      // Store text and sentiment (use your own logic to get sentiment)
      dataRef.current = {
        text,
        sentiment: "Positive", // Replace with actual sentiment logic
      };

      forceRender(); // Rerender to show SentimentCard
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const { text, sentiment } = dataRef.current;

  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", width: "510px" }}>
      <div style={{ display: "flex", alignItems: "center", flexDirection: "column", marginBottom: "30px" }}>
        <Header
          ai={ai}
          setAi={setAi}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
        />

        <div
          style={{
            width: "510px",
            display: "flex",
            backgroundColor: "#5A5067",
            borderRadius: "30px",
            padding: "10px",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <TextareaAutosize
            ref={textareaRef}
            onKeyDown={handleKeyDown}
            minRows={1}
            placeholder="Enter your text"
            style={{
              width: "400px",
              border: "none",
              backgroundColor: "transparent",
              color: "white",
              outline: "none",
              resize: "none",
              fontFamily: "Roboto",
              fontSize: "16px",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              marginLeft: "1rem",
              backgroundColor: "transparent",
              padding: "0.75rem",
              borderRadius: "9999px",
              display: "flex",
              
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <ArrowForward />
          </button>
        </div>
      </div>

      {/* Only show SentimentCard if sentiment is set */}
      {sentiment && <SentimentCard sentiment={sentiment} text={text} />}
    </div>
  );
}

export default ImportText;
