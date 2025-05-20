import React, { useRef, useState } from "react";
import Header from "./header";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import ArrowForward from "@mui/icons-material/ArrowForward";
import SentimentCard from "./sentimentCard";
import { sendMessage as sendMessageApi } from "../api/importTextApi";
import LinearProgress from '@mui/material/LinearProgress';


function ImportText({ ai, setAi, selectedMode, setSelectedMode }) {
  const textareaRef = useRef(null);
  const dataRef = useRef({ text: "", sentiment: "" });
  const [, setTick] = useState(0);
  const [loading, setLoading] = useState(false);


  const forceRender = () => setTick((tick) => tick + 1);

  const handleSend = async () => {
    const text = textareaRef.current?.value.trim();
    if (!text) return;
  
    console.log("Sending message:", text);
    setLoading(true); // Start loading
  
    try {
      const result = await sendMessageApi(text);
      dataRef.current = {
        text,
        sentiment: result.sentiment_lvl,
      };
      forceRender();
    } catch (error) {
      console.error("Error in handleSend:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
            id="user-text"
            name="userText"
            ref={textareaRef}
            disabled={loading}
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
            onClick={handleSend}
            isabled={loading}
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
      {loading && (<LinearProgress sx={{ width: "100%", maxWidth: "510px", mt: 2 }} />)}


      {sentiment && <SentimentCard sentiment={sentiment} text={text} />}
    </div>
  );
}

export default ImportText;
