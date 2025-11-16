import React, { useRef, useState } from "react";
import Header from "./header";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import ArrowForward from "@mui/icons-material/ArrowForward";
import SentimentCard from "./sentimentCard";
import { sendMessage as sendMessageApi } from "../api/importTextApi";
import LinearProgress from '@mui/material/LinearProgress';
import { Box } from '@mui/material';


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
      console.log("API result:", result); // Debug log

      // Our API returns both models, let's use the selected AI model
      let sentiment;
      if (ai === "roberta" && result.roberta) {
        sentiment = result.roberta.sentiment;
      } else if (ai === "lstm" && result.lstm) {
        sentiment = result.lstm.sentiment;
      } else if (result.roberta) {
        // Default to RoBERTa if no specific model selected
        sentiment = result.roberta.sentiment;
      } else {
        sentiment = "Unknown";
      }

      dataRef.current = {
        text,
        sentiment: sentiment,
      };
      console.log("Setting dataRef:", dataRef.current); // Debug log
      forceRender();
    } catch (error) {
      console.error("Error in handleSend:", error);
      // Show error to user
      dataRef.current = {
        text,
        sentiment: "Error - Please try again",
      };
      forceRender();
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
    <Box sx={{
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      width: { xs: "100%", sm: "90%", md: "510px" },
      maxWidth: "510px",
      px: { xs: 2, sm: 0 }
    }}>
      <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mb: 4, width: "100%" }}>
        <Header
          ai={ai}
          setAi={setAi}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
        />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            backgroundColor: "#5A5067",
            borderRadius: "30px",
            p: { xs: "8px", sm: "10px" },
            justifyContent: "space-between",
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
              width: "100%",
              maxWidth: "400px",
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
            disabled={loading}
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
              flexShrink: 0
            }}
          >
            <ArrowForward />
          </button>
        </Box>
      </Box>
      {loading && (<LinearProgress sx={{ width: "100%", mt: 2 }} />)}


      {sentiment && <SentimentCard sentiment={sentiment} text={text} />}
    </Box>
  );
}

export default ImportText;
